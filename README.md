# BOOB - Back Office Operations Bots Solution

> Automate routine back-office operations with intelligent bots

This is a submodule of the main repository: [BOBHack](git@github.com:Fl0p/BOBHack.git)

## About

Created during **synder-hackathon-wroclaw-2025** hackathon, this project provides a comprehensive platform for creating and managing intelligent bots to automate back-office operations.

## Team

- [Fl0p](https://github.com/Fl0p)
- [itbeard](https://github.com/itbeard)
- [gamezovladislav](https://github.com/gamezovladislav)

## Demo

Check out the live demo: [https://bob.aignite.pl/](https://bob.aignite.pl/)

## Features

- Intelligent bot creation and management
- Automated back-office operations
- Auto-fill forms functionality
- AI-powered workflow automation
- Plug-and-play support for any LLM
- Integration with multiple systems
- Google OAuth2 authentication
- Easy-to-use interface

## Technology Stack

**AI Engine:** [Dify.ai](https://dify.ai/) - Production-ready AI Agent platform for building agentic workflows, RAG pipelines, and intelligent automation.

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React + Vite + TypeScript
- **Browser Extension:** JavaScript
- **Database:** PostgreSQL
- **Package Manager:** Yarn 4.10.3 with workspaces
- **Networking:** Cloudflare Tunnel
- **Containerization:** Docker (all services in a single YAML)
- **CI/CD:** Automated deployment pipeline

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone git@github.com:Fl0p/BOBHack.git
cd BOBHack

# Configure environment
cp .env.example .env
nano .env  # Add your configuration

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

All services will be available:
- Frontend: `https://bob.aignite.pl`
- Backend: `https://api.aignite.pl`
- Dify Platform: `https://dify.aignite.pl`

### Local Development

```bash
# Install Yarn 4.10.3
corepack enable
corepack prepare yarn@4.10.3 --activate

# Install dependencies
yarn install

# Run both backend and frontend
yarn dev

# Or run separately
yarn dev:backend  # Backend on http://localhost:3001
yarn dev:frontend # Frontend on http://localhost:3000
```

## Documentation

📚 Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- [Setup Guide](./docs/setup.md) - Initial setup and configuration
- [Docker Setup](./docs/docker-setup.md) - Docker deployment guide
- [Architecture Overview](./docs/architecture/overview.md) - System architecture
- [Backend Documentation](./docs/backend/README.md) - Backend API and development
- [Frontend Documentation](./docs/frontend/README.md) - Frontend development guide
- [Browser Extension](./docs/extension/README.md) - Extension development
- [OAuth Setup](./docs/oauth_setup.md) - Google OAuth2 configuration
- [Database Access](./docs/database-access.md) - Database management
- [CI/CD Pipeline](./docs/ci-cd.md) - Deployment automation

---

*Built with ❤️💀🤖 during synder-hackathon-wroclaw-2025*
