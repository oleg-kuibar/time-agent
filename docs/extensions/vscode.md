# Time Agent: VSCode Extension

This document outlines the architecture, functionality, and development process for the Time Agent VSCode extension.

## Overview

The VSCode extension is a critical component of Time Agent that tracks developer activities within the editor, including:

- Files being edited
- Time spent in specific projects
- Language context
- Editing patterns
- Idle time detection

## Extension Architecture

```
time-agent-vscode/
├── src/                  # TypeScript source files
│   ├── extension.ts      # Extension entry point
│   ├── tracking/         # Activity tracking modules
│   │   ├── activity.ts   # Activity detection
│   │   ├── idle.ts       # Idle detection
│   │   └── context.ts    # Context extraction
│   ├── api/              # API communication
│   │   ├── trpc.ts       # tRPC client setup
│   │   ├── client.ts     # Time Agent API client
│   │   └── sync.ts       # Data synchronization
│   ├── storage/          # Local storage
│   │   ├── database.ts   # SQLite database
│   │   └── queue.ts      # Offline queue
│   └── ui/               # UI components
│       ├── statusBar.ts  # Status bar integration
│       └── webview.ts    # Settings/stats panel
├── package.json          # Extension manifest
└── webpack.config.js     # Build configuration
```

## Core Functionality

### 1. Activity Tracking

The extension tracks several types of editor activities:

#### File Interactions
- File opens/closes
- Active editor changes
- Time spent in specific files

#### Edit Patterns
- Keystrokes and edits
- Code navigation
- Copy/paste operations

#### Context Information
- File language/type
- Project structure
- Git branch/repository

### 2. Idle Detection

Intelligent detection of when the developer is actively working:

- Keyboard/mouse activity monitoring
- Configurable idle threshold (default: 2 minutes)
- Resumption detection for accurate time tracking

### 3. Data Management

The extension manages collected data efficiently:

- Local SQLite database for offline operation
- Queued activity synchronization
- Batched API updates to reduce overhead
- Conflict resolution for offline work

### 4. User Interface

Minimal but informative UI components:

- Status bar indicator showing tracking status
- Quick commands for manual time entries
- Settings panel for configuration
- Activity summary views

### 5. API Communication

Type-safe communication with the Time Agent backend:

- tRPC client for end-to-end type safety
- Authentication token management
- Offline-first approach with queuing
- Batched activity submission

## Technical Implementation

### Event Handling

The extension hooks into VSCode's event system:

```typescript
// Example event handling for editor changes
export function activate(context: vscode.ExtensionContext) {
  // Track active editor changes
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      trackEditorChange(editor);
    }
  }, null, context.subscriptions);
  
  // Track document changes
  vscode.workspace.onDidChangeTextDocument(event => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.document === editor.document) {
      trackDocumentEdit(editor, event);
    }
  }, null, context.subscriptions);
  
  // Track window state
  vscode.window.onDidChangeWindowState(state => {
    trackWindowState(state.focused);
  }, null, context.subscriptions);
}
```

### Activity Detection

The core tracking logic detects meaningful activities:

```typescript
// Example activity detection
async function trackEditorChange(editor: vscode.TextEditor) {
  const document = editor.document;
  
  // Get file details
  const fileName = document.fileName;
  const languageId = document.languageId;
  const lineCount = document.lineCount;
  
  // Get git context if available
  const gitContext = await getGitContext(fileName);
  
  // Record activity
  recordActivity({
    type: 'editor_change',
    file: fileName,
    language: languageId,
    lineCount: lineCount,
    gitBranch: gitContext?.branch,
    gitRepo: gitContext?.repo,
    timestamp: new Date().toISOString()
  });
}
```

### tRPC Client Setup

Type-safe API communication with the Time Agent backend:

```typescript
// src/api/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../lib/trpc/server/routers';
import * as vscode from 'vscode';

// Get stored auth token from VSCode secrets
async function getAuthToken(): Promise<string | undefined> {
  return await vscode.secrets.get('timeAgent.authToken');
}

// Create the tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: vscode.workspace.getConfiguration('timeAgent').get('apiUrl') || 'https://app.timeagent.dev/api/trpc',
      headers: async () => {
        const token = await getAuthToken();
        if (!token) return {};
        
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
```

### Data Synchronization

Efficient data synchronization with the Time Agent API:

```typescript
// Example sync strategy using tRPC
import { trpc } from './trpc';

async function syncActivities() {
  // Get queued activities
  const activities = await storage.getQueuedActivities();
  
  if (activities.length === 0) return;
  
  try {
    // Process activities in batches
    const batches = chunkArray(activities, 50);
    
    for (const batch of batches) {
      // Use tRPC to submit activities with type safety
      await trpc.activity.trackBatch.mutate(
        batch.map(activity => ({
          source: 'vscode',
          startTime: activity.startTime,
          endTime: activity.endTime,
          context: activity.context,
          projectId: activity.projectId
        }))
      );
      
      await storage.markAsSynced(batch.map(a => a.id));
    }
  } catch (error) {
    // Handle sync failure
    console.error('Failed to sync activities:', error);
    // Will retry on next sync cycle
  }
}
```

### Idle Detection

Smart detection to avoid tracking inactive time:

```typescript
// Example idle detection
class IdleDetector {
  private lastActivity: number = Date.now();
  private idleThreshold: number = 2 * 60 * 1000; // 2 minutes
  private isIdle: boolean = false;
  private idleStartTime: number = 0;
  
  constructor() {
    // Monitor keyboard and mouse events
    vscode.window.onDidChangeTextEditorSelection(() => this.activityDetected());
    vscode.window.onDidChangeActiveTextEditor(() => this.activityDetected());
    // Check idle status periodically
    setInterval(() => this.checkIdle(), 30000); // Check every 30 seconds
  }
  
  private activityDetected() {
    const now = Date.now();
    
    if (this.isIdle) {
      // Coming back from idle state
      const idleDuration = now - this.idleStartTime;
      this.isIdle = false;
      recordIdleEnd(idleDuration);
    }
    
    this.lastActivity = now;
  }
  
  private checkIdle() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;
    
    if (!this.isIdle && timeSinceLastActivity >= this.idleThreshold) {
      // User is now idle
      this.isIdle = true;
      this.idleStartTime = now;
      recordIdleStart();
    }
  }
}
```

## Development Setup

### Prerequisites

- Node.js 20+ and pnpm
- VSCode Extension Development Environment
- Time Agent backend running locally or in development environment

### Installation

```bash
# Navigate to the extension directory
cd extensions/vscode

# Install dependencies
pnpm install
```

### Development Workflow

1. **Start in Development Mode**

```bash
# Start the extension in development mode
pnpm watch
```

2. **Launch the Extension**

Press F5 in VSCode to launch a new Extension Development Host.

3. **Testing**

```bash
# Run tests
pnpm test
```

### Debugging

Use VSCode's built-in debugging with breakpoints:

1. Set breakpoints in your TypeScript files
2. Launch the extension with F5
3. Use the Debug Console to inspect variables

### Packaging

```bash
# Package the extension
pnpm package
```

This creates a `.vsix` file that can be installed in VSCode.

## Authentication

The extension needs to authenticate with the Time Agent backend:

```typescript
// Example authentication flow
async function authenticate() {
  // Get token from VSCode secrets
  let token = await vscode.secrets.get('timeAgent.authToken');
  
  if (!token) {
    // No token found, prompt user to authenticate
    const result = await vscode.window.showInformationMessage(
      'Time Agent needs to authenticate with your account. Open browser to login?',
      'Login', 'Cancel'
    );
    
    if (result === 'Login') {
      // Generate a device code for authentication
      const deviceCode = await trpc.auth.createDeviceCode.mutate();
      
      // Open browser for authentication
      vscode.env.openExternal(vscode.Uri.parse(deviceCode.verificationUri));
      
      // Show the code to the user
      vscode.window.showInformationMessage(
        `Enter this code in the browser: ${deviceCode.userCode}`
      );
      
      // Poll for token
      token = await pollForToken(deviceCode.deviceCode);
      
      if (token) {
        // Store token in VSCode secrets
        await vscode.secrets.store('timeAgent.authToken', token);
      }
    }
  }
  
  return !!token;
}
```

## Configuration Options

The extension provides several configuration options:

| Setting | Description | Default |
|---------|-------------|---------|
| `timeAgent.enabled` | Enable/disable activity tracking | `true` |
| `timeAgent.idleThreshold` | Time in minutes before considered idle | `2` |
| `timeAgent.syncInterval` | Sync frequency in minutes | `5` |
| `timeAgent.apiUrl` | Time Agent API URL | `https://app.timeagent.dev/api` |
| `timeAgent.showStatusBar` | Show status in editor | `true` |
| `timeAgent.privacyMode` | Limited data collection mode | `false` |

## Privacy Considerations

The extension is designed with privacy in mind:

- Only tracks editing activity, not content
- Local storage for sensitive data
- Configurable tracking level
- Clear activity logs

## Next Steps

### Version 1.0
- Basic activity tracking
- Idle detection
- Local storage
- Manual sync
- tRPC client integration

### Version 1.1
- Automatic sync
- Status bar indicator
- Project detection
- Offline support

### Version 1.2
- Activity summaries
- Context awareness
- Enhanced Git integration

### Version 2.0
- Team awareness
- AI-powered suggestions
- Advanced analytics

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Extension Development Guide](https://code.visualstudio.com/api/get-started/your-first-extension)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [tRPC Documentation](https://trpc.io/docs) 