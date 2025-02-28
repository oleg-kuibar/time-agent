@echo off
echo 🚀 Setting up Time Agent development environment...

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not installed. Please install Docker and Docker Compose first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install

REM Start Docker containers
echo 🐳 Starting Docker containers...
docker-compose up -d

REM Wait for PostgreSQL to be ready
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

REM Push database schema
echo 🗃️ Setting up database schema...
call pnpm db:push

echo ✅ Setup complete! You can now run 'pnpm dev' to start the development server.
echo 🌐 The application will be available at http://localhost:3000 