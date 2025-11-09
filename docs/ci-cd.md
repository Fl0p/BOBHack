# continuous integration and deployment

## overview

BOBHack uses GitHub Actions for continuous integration and deployment automation.

## workflow configuration

### build workflow

Location: `.github/workflows/build.yml`

The build workflow is triggered on:
- Push to `main` branch
- Pull requests targeting `main` branch

### workflow steps

1. **checkout code**
   - Uses `actions/checkout@v3` to clone the repository

2. **setup node.js**
   - Configures Node.js environment (version from matrix/default)

3. **enable corepack**
   - Activates Yarn 4 via Corepack for workspace management

4. **install dependencies**
   - Runs `yarn install` to install all workspace dependencies

5. **build services**
   - Executes build commands for backend and frontend

6. **create client_secret.json**
   - Creates Google OAuth credentials file
   - Source: `GOOGLE_CLIENT_SECRET` GitHub secret
   - Command: `echo '${{ secrets.GOOGLE_CLIENT_SECRET }}' > client_secret.json`

7. **make scripts executable**
   - Sets executable permissions on deployment scripts
   - Command: `chmod +x scripts/rebuild-and-start.sh`

8. **run rebuild and start**
   - Executes the rebuild and start script
   - Validates Docker Compose configuration
   - Command: `./scripts/rebuild-and-start.sh`

8. **check running containers**
   - Verifies container status with `docker-compose ps`
   - Ensures all services are up and healthy

9. **show logs (on failure)**
   - Displays Docker Compose logs if previous steps fail
   - Conditional execution: `if: failure()`
   - Command: `docker-compose logs`

## recent enhancements

### commit 8514047 - oauth secret integration

Added Google OAuth credentials to CI/CD:
- Creates `client_secret.json` from GitHub secrets
- Enables authentication in deployed environment
- Securely manages OAuth credentials

### commit 85155bb - enhanced ci workflow

Added automation for:
- Script execution and validation
- Container health checks
- Automatic log collection on failures

These enhancements improve:
- Build observability
- Debugging capabilities
- Reliability of the CI pipeline

### commit e9895898 - ci status

The CI workflow can be temporarily disabled when needed for maintenance or infrastructure changes.

## github secrets configuration

The CI/CD pipeline requires several secrets to be configured in the GitHub repository.

### required secrets

Navigate to **Settings** → **Secrets and variables** → **Actions** and add:

1. **ENV_FILE**
   - Complete `.env` file contents for production
   - Must include all required environment variables
   - Example structure:
     ```env
     BACKEND_URL=https://api.aignite.pl
     FRONTEND_URL=https://bob.aignite.pl
     DIFY_URL=https://dify.aignite.pl
     SESSION_SECRET=<generated-secret>
     BACKEND_DB_PASSWORD=<secure-password>
     # ... all other variables from .env.example
     ```

2. **GOOGLE_CLIENT_SECRET**
   - Complete contents of `client_secret.json` file
   - Downloaded from Google Cloud Console
   - JSON format with OAuth credentials

3. **CLOUDFLARE_CREDENTIALS**
   - Cloudflare Tunnel credentials JSON file
   - Used in `.cloudflared/` directory
   - Format: tunnel credentials from Cloudflare dashboard

### secret management best practices

1. **Never commit secrets** to the repository
2. **Rotate secrets regularly** (every 90 days minimum)
3. **Use GitHub environment protection** for production deployments
4. **Audit secret access** in GitHub audit logs
5. **Store backups securely** in password manager or secure vault
6. **Use minimal permissions** for service accounts
7. **Monitor for leaked secrets** with GitHub secret scanning

## scripts

### rebuild-and-start.sh

Location: `scripts/rebuild-and-start.sh`

Purpose:
- Rebuilds Docker images
- Restarts services with updated code
- Validates deployment

Usage:
```bash
# manually run the script
chmod +x scripts/rebuild-and-start.sh
./scripts/rebuild-and-start.sh
```

## best practices

### pre-deployment validation

Before pushing to main:
1. Run tests locally: `yarn test` (if tests are configured)
2. Verify builds: `yarn build`
3. Test Docker Compose: `docker-compose up -d`
4. Check service health: `docker-compose ps`

### debugging ci failures

If the CI workflow fails:

1. Check the logs in GitHub Actions UI
2. Review the "Show logs" step output (automatically displayed on failure)
3. Run the same commands locally to reproduce
4. Verify Docker Compose configuration
5. Check environment variable configuration

### monitoring

Monitor CI/CD health by:
- Reviewing GitHub Actions workflow runs
- Checking build times for performance degradation
- Monitoring Docker image sizes
- Reviewing logs for warnings

## future improvements

Potential enhancements:
- Automated testing step
- Security scanning (container images, dependencies)
- Deployment to staging environment
- Performance testing
- Automatic rollback on failures
- Slack/Discord notifications
- Code coverage reporting

## troubleshooting

### common issues

**script permission errors**
```bash
# solution: ensure scripts are executable
chmod +x scripts/*.sh
git add scripts/
git commit -m "Fix script permissions"
```

**docker-compose failures**
```bash
# solution: validate docker-compose.yml locally
docker-compose config
docker-compose up -d
docker-compose ps
```

**node/yarn version mismatches**
```bash
# solution: use corepack to ensure correct yarn version
corepack enable
corepack prepare yarn@4.10.3 --activate
```

## related documentation

- [Docker Setup Guide](./docker-setup.md) - Docker deployment details
- [Backend Development](./backend/development.md) - Backend build process
- [Frontend Development](./frontend/development.md) - Frontend build process
