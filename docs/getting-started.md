# Getting Started with Time Agent

This guide will help you set up Time Agent for local development and testing.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: Version 20.0.0 or higher
- **pnpm**: Version 9.0.0 or higher
- **Git**: Latest version
- **IDE**: VS Code recommended (with ESLint and Prettier extensions)

You'll also need accounts with:

- **Supabase**: For database and authentication
- **OpenAI**: For AI capabilities
- **GitHub**: For repository integration
- **Vercel** (optional): For deployment

## 1. Project Setup

### Clone and Install

Start by cloning the repository and installing dependencies:

```bash
# Clone the repository
git clone https://github.com/yourusername/time-agent.git
cd time-agent

# Install dependencies
pnpm install
```

### Environment Setup

Create a local environment file by copying the example:

```bash
cp .env.example .env.local
```

Then, edit `.env.local` to add your API keys and configuration:

```
# Base configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORGANIZATION=your_openai_org_id

# GitHub configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

To generate a secure random secret for NextAuth, you can use:

```bash
openssl rand -base64 32
```

## 2. Database Setup

### Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your project URL and API keys
3. In the Supabase dashboard, go to SQL Editor

### Schema Setup

Execute the following SQL in the Supabase SQL Editor to create the initial schema:

```sql
-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table is handled by Supabase Auth

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own projects" ON projects 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects 
  FOR DELETE USING (auth.uid() = user_id);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own categories" ON categories 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories" ON categories 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON categories 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON categories 
  FOR DELETE USING (auth.uid() = user_id);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  source TEXT NOT NULL,
  context JSONB,
  ai_classification JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activities" ON activities 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities" ON activities 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activities" ON activities 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activities" ON activities 
  FOR DELETE USING (auth.uid() = user_id);

-- Integration Data table
CREATE TABLE IF NOT EXISTS integration_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE integration_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own integration data" ON integration_data 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = integration_data.activity_id 
        AND activities.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert their own integration data" ON integration_data 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = integration_data.activity_id 
        AND activities.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update their own integration data" ON integration_data 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = integration_data.activity_id 
        AND activities.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete their own integration data" ON integration_data 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = integration_data.activity_id 
        AND activities.user_id = auth.uid()
    )
  );

-- Integration tokens table (for OAuth tokens)
CREATE TABLE IF NOT EXISTS integration_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Create RLS policies
ALTER TABLE integration_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tokens" ON integration_tokens 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tokens" ON integration_tokens 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tokens" ON integration_tokens 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tokens" ON integration_tokens 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to maintain updated_at
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_integration_data_updated_at
BEFORE UPDATE ON integration_data
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_integration_tokens_updated_at
BEFORE UPDATE ON integration_tokens
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
```

### Create Default Categories

Run this SQL to create default categories:

```sql
-- Insert default categories
INSERT INTO categories (name, color, user_id)
VALUES
  ('Coding', '#3B82F6', 'AUTH_UID'),
  ('Debugging', '#EF4444', 'AUTH_UID'),
  ('Research', '#8B5CF6', 'AUTH_UID'),
  ('Meetings', '#F59E0B', 'AUTH_UID'),
  ('Code Review', '#10B981', 'AUTH_UID'),
  ('Planning', '#6366F1', 'AUTH_UID'),
  ('Documentation', '#EC4899', 'AUTH_UID'),
  ('Learning', '#14B8A6', 'AUTH_UID');
```

Replace `AUTH_UID` with your actual user ID after signing up.

## 3. tRPC Setup

Time Agent uses tRPC for type-safe API communication between the server and all clients.

### Install tRPC Dependencies

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @trpc/next zod
```

### Create tRPC Server Files

Create the following directory structure:

```
lib/
└── trpc/
    ├── server/
    │   ├── context.ts          # Request context creation
    │   ├── trpc.ts             # tRPC initialization
    │   └── routers/            # Route definitions
    │       ├── index.ts        # Root router
    │       ├── activity.ts     # Activity routes
    │       └── ...             # Other routers
    └── client/
        └── index.ts            # Client setup
```

#### Basic tRPC Setup (lib/trpc/server/trpc.ts)

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Base procedures
export const router = t.router;
export const procedure = t.procedure;

// Auth procedures
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

### Create Next.js API Route

Create a tRPC API route handler:

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/server/routers';
import { createContext } from '@/lib/trpc/server/context';

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });
};

export { handler as GET, handler as POST };
```

### Set Up tRPC Provider

Create a provider component to wrap your application:

```typescript
// app/providers.tsx
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, getTRPCClient } from '@/lib/trpc/client';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => getTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

Then use this provider in your root layout:

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 4. GitHub Integration Setup

To integrate with GitHub, you'll need to create an OAuth app:

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the details:
   - **Application name**: Time Agent (Development)
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
5. Register the application
6. Generate a client secret
7. Add the Client ID and Client Secret to your `.env.local` file

## 5. Start the Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 6. Set Up Authentication

The first time you visit the application, you'll need to:

1. Sign up with email or GitHub
2. Complete your profile information
3. Update the default categories with your user ID

## 7. Extension Development

### VSCode Extension

```bash
# Navigate to the extension directory
cd extensions/vscode

# Install dependencies
pnpm install

# Build the extension
pnpm build

# Package the extension
pnpm package
```

To test the extension, press F5 in VS Code with the extension folder open.

#### Setting Up tRPC in the VSCode Extension

Create a tRPC client in your extension:

```typescript
// extensions/vscode/src/api.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../lib/trpc/server/routers';
import * as vscode from 'vscode';

// Get stored auth token from VSCode secrets
async function getAuthToken(): Promise<string | undefined> {
  return await vscode.secrets.get('timeAgent.authToken');
}

// Create the client
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

### Browser Extension

```bash
# Navigate to the extension directory
cd extensions/browser

# Install dependencies
pnpm install

# Build the extension
pnpm build
```

Then load the unpacked extension in Chrome/Firefox from the `dist` directory.

### Desktop Agent

```bash
# Navigate to the extension directory
cd extensions/desktop

# Install dependencies
pnpm install

# Start in development mode
pnpm dev
```

## 8. Testing

Run the test suite to ensure everything is working properly:

```bash
pnpm test
```

## Troubleshooting

### Authentication Issues

- Ensure your Supabase URL and keys are correct
- Check that GitHub OAuth settings match exactly
- Verify that NEXTAUTH_URL matches your development URL

### Database Connection Problems

- Check Supabase dashboard for connection status
- Verify that your IP is allowed in Supabase settings
- Test direct connection using Supabase client

### tRPC Issues

- Check that your tRPC routes are properly defined
- Verify that the client is correctly configured
- Look for type errors in your procedures or inputs

### AI Functionality Not Working

- Verify your OpenAI API key is correct and has sufficient credits
- Check that the models being used are available on your OpenAI plan
- Look for rate limiting errors in the server logs

## Next Steps

- [Architecture Overview](./architecture.md) - Learn about the system design
- [API Reference](./api-reference.md) - Explore available endpoints
- [Extension Development](./extensions.md) - Detailed guide for extension development 