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

6. **make scripts executable**
   - Sets executable permissions on deployment scripts
   - Command: `chmod +x scripts/rebuild-and-start.sh`

7. **run rebuild and start**
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
