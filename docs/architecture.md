# Time Agent: Architecture Overview

This document provides a detailed look at the technical architecture of Time Agent, explaining how various components work together to create a seamless time tracking experience for developers.

## System Overview

Time Agent uses a distributed architecture with multiple components working together:

1. **Web Application**: The central hub for user interaction and data visualization
2. **Client Extensions**: Distributed components that collect activity data
3. **API Layer**: Type-safe communication between clients and server
4. **AI Processing Pipeline**: Analyzes and categorizes collected data
5. **Integration Services**: Connects with external developer tools

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Client           │     │  Web Application  │     │  External         │
│  Extensions       │◄────┤  & tRPC API       │◄────┤  Services         │
│                   │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
        ▲                          ▲                          ▲
        │                          │                          │
        │                          │                          │
        │                          ▼                          │
        │                 ┌───────────────────┐              │
        │                 │                   │              │
        └─────────────────┤  Supabase DB      ├──────────────┘
                          │                   │
                          └───────────────────┘
```

## Core Components

### 1. Web Application (Next.js)

The web application serves as both the user interface and the backend API.

#### Key Areas:

- **Dashboard**: Visual representation of time data
- **Reports**: Detailed analysis of time usage
- **Settings**: User preferences and integration configuration
- **API Endpoints**: tRPC procedures for client extensions

#### Technical Implementation:

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with Supabase provider
- **State Management**: React Context + TanStack Query
- **UI Components**: Tailwind CSS v4 + shadcn/ui
- **API Layer**: tRPC for type-safe client-server communication

### 2. API Layer (tRPC)

The API layer provides end-to-end type safety between the server and all clients.

#### Key Features:

- **Type Safety**: Automatic type inference without code generation
- **Procedure-Based**: Organized into domain-specific routers
- **Authentication**: Integrated with Supabase auth
- **Error Handling**: Structured error responses with Zod validation

#### Implementation:

```typescript
// Server-side router definition
export const activityRouter = router({
  track: protectedProcedure
    .input(z.object({
      source: z.string(),
      startTime: z.string().datetime(),
      endTime: z.string().datetime().optional(),
      context: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),
  
  getByDateRange: protectedProcedure
    .input(z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    }))
    .query(async ({ input, ctx }) => {
      // Implementation
    }),
});

// Client-side usage (with full type safety)
const result = await trpc.activity.track.mutate({
  source: 'vscode',
  startTime: new Date().toISOString(),
  context: { file: 'app.tsx', language: 'typescript' }
});
```

### 3. Client Extensions

Extensions that run on the developer's device to collect activity data.

#### VSCode Extension

Tracks:
- Files being edited
- Time spent in specific projects
- Language context and editing patterns

**Tech Stack**: TypeScript + VSCode Extension API + tRPC Client

#### Browser Extension

Tracks:
- Developer-related websites (GitHub, documentation)
- Web-based tools usage
- Meeting participation via web platforms

**Tech Stack**: TypeScript + Browser Extension API (Chrome/Firefox) + tRPC Client

#### Desktop Agent

Tracks:
- Active application context
- System idle time
- Terminal usage
- Git operations outside the editor

**Tech Stack**: Electron + TypeScript + tRPC Client

### 4. Data Model

The database schema is designed for flexible activity tracking with minimal overhead.

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │  Projects   │       │ Categories  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ name        │       │ name        │       │ name        │
│ email       │       │ user_id     │       │ color       │
│ settings    │       │ created_at  │       │ user_id     │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │                      │
      └──────────┐          │                      │
                 ▼          ▼                      │
           ┌─────────────────────────┐             │
           │       Activities        │             │
           ├─────────────────────────┤             │
           │ id                      │             │
           │ user_id                 │◄────────────┘
           │ project_id              │
           │ category_id             │
           │ start_time              │
           │ end_time                │
           │ source                  │
           │ context                 │
           │ ai_classification       │
           └─────────────────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │    Integration Data     │
           ├─────────────────────────┤
           │ id                      │
           │ activity_id             │
           │ source                  │
           │ external_id             │
           │ metadata                │
           └─────────────────────────┘
```

### 5. AI Processing Pipeline

The AI system processes raw activity data to derive meaningful insights.

#### Components:

1. **Activity Classifier**: Categorizes activities based on context
   - Uses: OpenAI embeddings for semantic understanding
   - Example: Distinguishing between debugging and feature development

2. **Time Predictor**: Estimates time for similar future tasks
   - Uses: Pattern recognition across historical data
   - Example: "Similar PRs typically take you 2-3 hours to complete"

3. **Work Summarizer**: Generates natural language summaries
   - Uses: OpenAI GPT-4o for text generation
   - Example: "This morning you spent 2.5 hours refactoring the authentication module"

#### Implementation:

```typescript
// Simplified classifier architecture
export async function classifyActivity(activity: Activity): Promise<Classification> {
  // 1. Extract context from activity data
  const context = extractContext(activity);
  
  // 2. Generate embeddings for semantic understanding
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: context,
  });
  
  // 3. Match against known patterns or use function calling
  const classification = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: "Classify this developer activity into appropriate categories."
    }, {
      role: "user",
      content: JSON.stringify(activity)
    }],
    functions: [
      {
        name: "classifyActivity",
        description: "Classify a developer activity",
        parameters: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["coding", "debugging", "research", "review", "meeting"]
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 1
            }
          },
          required: ["category", "confidence"]
        }
      }
    ],
    function_call: { name: "classifyActivity" }
  });
  
  return JSON.parse(classification.choices[0].message.function_call.arguments);
}
```

### 6. Integration Services

Services that connect Time Agent with external developer tools, exposed through tRPC procedures.

#### GitHub Integration

- **Webhook Listener**: Captures PR events and activities
- **API Client**: Retrieves detailed information about repos, PRs, and commits
- **Timeline Correlation**: Maps GitHub events to local activity

#### Jira Integration

- **Webhook Listener**: Captures ticket status changes
- **API Client**: Retrieves detailed ticket information
- **Time Association**: Links tracked time to specific tickets

#### Calendar Integration

- **OAuth Connection**: Securely connects to Google/Microsoft calendar
- **Meeting Detection**: Identifies meeting time blocks
- **Context Extraction**: Pulls relevant meeting data for context

## Data Flow

1. **Activity Collection**: Extensions collect raw activity data
2. **API Communication**: Data is sent to the server via tRPC
3. **Storage**: Data is stored in Supabase
4. **AI Processing**: Batch processing for insights
5. **Integration Enrichment**: Data is enriched with external context
6. **Visualization**: Processed data is presented in the dashboard

## Security Considerations

- **Authentication**: OAuth 2.0 + Supabase for secure authentication
- **Data Encryption**: Sensitive data encrypted at rest
- **Permissions**: Row-level security in Supabase
- **API Security**: tRPC with protected procedures
- **Extension Permissions**: Minimal required permissions for each extension

## Performance Optimizations

- **Batched Processing**: Activities are processed in batches to reduce API costs
- **Local Caching**: Client extensions cache data to reduce network traffic
- **Debounced Updates**: Activity recording is debounced to reduce database load
- **Incremental Analysis**: AI processing runs incrementally on new data
- **tRPC Batching**: API requests are batched for efficiency

## Deployment Architecture

For a single developer, Time Agent uses a simplified deployment model:

- **Web Application**: Vercel (serverless)
- **Database**: Supabase (managed PostgreSQL)
- **Extensions**: Self-hosted on developer machines
- **AI Processing**: OpenAI API (external service)

This architecture provides a robust foundation while minimizing operational overhead for a single developer. 