# Time Agent

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac)](https://tailwindcss.com/)
[![tRPC](https://img.shields.io/badge/tRPC-10.0-2596be)](https://trpc.io/)

Time Agent is an intelligent assistant that simplifies time tracking for developers through passive monitoring, AI-powered categorization, and smart integrations.

## 🌟 Features

- **👻 Passive Tracking**: Background monitoring across development environments without disruption
- **🤖 AI-Powered Analysis**: Automatic task detection and smart categorization of activities
- **📊 Developer Dashboard**: Clean, intuitive interface for reviewing and managing time
- **🔄 Smart Integrations**: Seamless connections with developer tools (GitHub, Jira, VSCode)
- **📈 Time Insights**: Data-driven productivity patterns and work-life balance recommendations
- **🔒 Type-Safe APIs**: End-to-end type safety between server and all clients

## 🧰 Tech Stack

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Framework**: [React 19](https://react.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **API Layer**: [tRPC](https://trpc.io/) for type-safe APIs
- **AI**: [OpenAI API](https://openai.com/) (GPT-4o)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Extensions**:
  - VSCode Extension
  - Browser Extension (Chrome/Firefox)
  - Desktop Agent (Electron)

## 🏗️ Project Structure

```
time-agent/
├── app/                 # Next.js app directory
│   ├── api/             # API endpoints
│   │   └── trpc/        # tRPC API routes
│   ├── dashboard/       # Main dashboard UI
│   ├── reports/         # Time reports
│   └── settings/        # User configuration
├── components/          # Reusable UI components
├── lib/                 # Core functionality
│   ├── ai/              # AI processing modules
│   │   ├── classifier.ts      # Activity classification
│   │   ├── predictor.ts       # Time estimation
│   │   └── summarizer.ts      # Work summaries
│   ├── tracking/        # Activity tracking
│   │   ├── activity.ts        # Activity detection
│   │   ├── idle.ts            # Idle detection
│   │   └── timeline.ts        # Timeline generation
│   ├── trpc/            # tRPC implementation
│   │   ├── server/            # Server-side tRPC
│   │   │   ├── routers/       # API route definitions
│   │   │   └── trpc.ts        # tRPC initialization
│   │   └── client/            # Client-side tRPC
│   └── integrations/    # External services
│       ├── github.ts          # GitHub integration
│       ├── jira.ts            # Jira integration
│       └── calendar.ts        # Calendar integration
├── public/              # Static assets
└── extensions/          # Client extensions
    ├── shared/          # Shared code between extensions
    │   └── trpc-client.ts     # tRPC client for extensions
    ├── vscode/          # VSCode extension
    ├── browser/         # Chrome/Firefox extension
    └── desktop/         # Desktop agent (Electron)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm/pnpm
- Supabase account
- OpenAI API key
- GitHub account (for integrations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/time-agent.git
   cd time-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables in `.env.local`.

4. **Run database migrations**
   ```bash
   npx supabase migration up
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

Visit `http://localhost:3000` to see the application.

## ⚙️ Core Components

### 1. Time Tracking Engine

The heart of Time Agent is a sophisticated tracking engine that:
- Collects activity data from multiple sources
- Uses heuristics to detect active vs. idle time
- Correlates activities with tasks and projects
- Provides a unified timeline of developer activities

### 2. API Layer

Time Agent uses tRPC to provide end-to-end type safety:
- Automatic type inference between server and clients
- Strongly-typed procedures for all operations
- Seamless integration with React and extensions
- Secure authentication and authorization

### 3. AI Processing Pipeline

Time Agent leverages OpenAI's models to:
- Classify activities into meaningful categories
- Predict time requirements for similar tasks
- Generate natural language summaries of work
- Identify productivity patterns and suggestions

### 4. Integration Hub

Time Agent connects with common developer tools:
- **GitHub**: Track commit activity, PR reviews, and code changes
- **Jira/Linear**: Link time entries to specific tickets
- **VSCode**: Monitor file editing patterns and coding activity
- **Google Calendar**: Incorporate meeting time and context switching

## 🛠️ Extension Development

### VSCode Extension

```bash
cd extensions/vscode
npm install
npm run build
```

### Browser Extension

```bash
cd extensions/browser
npm install
npm run build
```

### Desktop Agent

```bash
cd extensions/desktop
npm install
npm run build
```

## 📚 Documentation

- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Architecture Overview](docs/architecture.md)
- [Extension Development](docs/extensions.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🗺️ Roadmap

- [ ] **Phase 1**: Foundation (dashboard, auth, manual tracking)
- [ ] **Phase 2**: Basic tracking (VSCode, GitHub)
- [ ] **Phase 3**: AI intelligence (categorization, prediction)
- [ ] **Phase 4**: Advanced features (browser extension, integrations)
- [ ] **Phase 5**: Mobile app and team features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- OpenAI for the AI capabilities
- Next.js team for the amazing framework
- Supabase for the database infrastructure
- tRPC team for the type-safe API framework
- All open-source libraries used in this project 