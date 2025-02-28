# Time Agent

Time Agent is an intelligent assistant that simplifies time tracking for developers through passive monitoring, AI-powered categorization, and smart integrations.

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- PostgreSQL database
- GitHub and GitLab OAuth apps (for authentication)
- SMTP server (for email authentication)
- Vercel account (optional, for deployment)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/time-agent.git
   cd time-agent
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your database URL and authentication credentials:
     ```
     # Database
     DATABASE_URL=postgresql://username:password@localhost:5432/time-agent
     
     # NextAuth.js
     NEXTAUTH_SECRET=your-secret-key
     NEXTAUTH_URL=http://localhost:3000
     GITHUB_CLIENT_ID=your-github-client-id
     GITHUB_CLIENT_SECRET=your-github-client-secret
     GITLAB_CLIENT_ID=your-gitlab-client-id
     GITLAB_CLIENT_SECRET=your-gitlab-client-secret
     EMAIL_SERVER_HOST=smtp.example.com
     EMAIL_SERVER_PORT=587
     EMAIL_SERVER_USER=your-email-user
     EMAIL_SERVER_PASSWORD=your-email-password
     EMAIL_FROM=noreply@example.com
     ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** to see the application

## Docker Setup

For local development, you can use Docker to run the PostgreSQL database:

### Quick Setup

We've provided setup scripts to make it easy to get started:

**On Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

### Manual Setup

If you prefer to set up manually:

1. **Start the database**
   ```bash
   docker-compose up -d
   ```

2. **Push the database schema**
   ```bash
   pnpm db:push
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Stop the database when done**
   ```bash
   docker-compose down
   ```

If you want to reset the database, you can remove the volume:
```bash
docker-compose down -v
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Features

- **👻 Passive Tracking**: Background monitoring across development environments
- **🤖 AI-Powered Analysis**: Automatic task detection and smart categorization
- **📊 Developer Dashboard**: Clean, intuitive interface for time management
- **🔄 Smart Integrations**: Connections with developer tools (GitHub, GitLab)
- **📈 Time Insights**: Data-driven productivity patterns and recommendations

## Tech Stack

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/) with App Router
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **API Layer**: [tRPC](https://trpc.io/) for type-safe APIs
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
