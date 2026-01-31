# FitFlow Quick Start Guide

Get FitFlow up and running in 5 minutes!

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- 2GB+ of available RAM
- Ports 80, 8080, and 5432 available

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Karthik-Dsa/FitFlow.git
cd FitFlow
```

### 2. Configure Environment (Optional)

The application comes with sensible defaults. To customize:

```bash
cp .env.example .env
nano .env  # Edit if needed
```

Default configuration:
- Database User: `fitflow`
- Database Password: `fitflow123` (⚠️ Change for production!)
- Backend Port: `8080`
- Frontend Port: `80`

### 3. Start the Application

```bash
docker-compose up -d
```

This command will:
- Download required Docker images
- Build the backend (Spring Boot)
- Build the frontend (React)
- Start PostgreSQL database
- Connect everything together

First-time setup takes 5-10 minutes to download and build everything.

### 4. Verify Installation

```bash
./verify-deployment.sh
```

Or manually check:

```bash
# Check all services are running
docker-compose ps

# Should show 3 containers running:
# - fitflow-database
# - fitflow-backend
# - fitflow-frontend
```

### 5. Access the Application

Open your browser and visit:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Stop the Application

```bash
docker-compose down
```

### Stop and Remove Data

⚠️ **Warning**: This deletes all database data!

```bash
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart
```

### Update to Latest Version

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Services Won't Start

**Issue**: Ports already in use

```bash
# Check what's using the ports
lsof -i :80
lsof -i :8080
lsof -i :5432

# Stop conflicting services or change ports in docker-compose.yml
```

**Issue**: Docker daemon not running

```bash
# Start Docker
sudo systemctl start docker

# Or on Mac/Windows, start Docker Desktop
```

### Backend Not Responding

```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# - Database not ready yet (wait 30 seconds)
# - Build errors (check logs for stack traces)
# - Port conflicts
```

### Frontend Shows Blank Page

```bash
# Check frontend logs
docker-compose logs frontend

# Check backend is running
curl http://localhost:8080/actuator/health

# Rebuild frontend if needed
docker-compose up -d --build frontend
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Test connection
docker-compose exec database psql -U fitflow -d fitflow -c "SELECT 1"
```

### Permission Denied Errors

```bash
# Make sure you're in the docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended)
sudo docker-compose up -d
```

## Next Steps

1. **Explore the API**: Visit http://localhost:8080
2. **Read Full Documentation**: See [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Production Setup**: See [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)
4. **Contribute**: Check out [CONTRIBUTING.md](CONTRIBUTING.md)

## Getting Help

- 📖 Documentation: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Report Issues: [GitHub Issues](https://github.com/Karthik-Dsa/FitFlow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Karthik-Dsa/FitFlow/discussions)

## Development Setup

Want to develop locally without Docker?

### Backend
```bash
# Requires Java 21
./mvnw spring-boot:run
```

### Frontend
```bash
cd fitness-frontend
npm install
npm start
```

### Database
```bash
docker run -d \
  --name fitflow-postgres \
  -e POSTGRES_DB=fitflow \
  -e POSTGRES_USER=fitflow \
  -e POSTGRES_PASSWORD=fitflow123 \
  -p 5432:5432 \
  postgres:16-alpine
```

---

**That's it!** You now have a fully functional FitFlow instance running. 🎉

For more advanced configurations and production deployment, check out our comprehensive guides:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md) - Production deployment options
