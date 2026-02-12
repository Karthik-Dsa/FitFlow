# FitFlow Deployment Guide

This guide covers deploying the FitFlow application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 2GB of available RAM
- Ports 80, 8080, and 5432 available

## Quick Start (Local Deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/Karthik-Dsa/FitFlow.git
cd FitFlow
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your preferred values (optional)
nano .env
```

### 3. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

### 5. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

## Service Architecture

The deployment consists of three services:

1. **Database (PostgreSQL)**: Stores application data
2. **Backend (Spring Boot)**: REST API server
3. **Frontend (React + Nginx)**: User interface

All services communicate through a private Docker network.

## Configuration

### Environment Variables

Edit the `.env` file to customize:

```env
# Database credentials
DB_USERNAME=fitflow
DB_PASSWORD=your_secure_password

# Backend profile
SPRING_PROFILES_ACTIVE=prod

# Frontend API URL
REACT_APP_API_URL=http://localhost:8080/api
```

### Database Configuration

The PostgreSQL database is configured with:
- Database name: `fitflow`
- Default user: `fitflow`
- Default password: `fitflow123` (change in production!)
- Port: 5432
- Data persistence via Docker volume

### Backend Configuration

The Spring Boot backend:
- Runs on port 8080
- Uses production profile (`application-prod.properties`)
- Connects to PostgreSQL database
- Includes Flyway for database migrations
- Health check endpoint: http://localhost:8080/actuator/health

### Frontend Configuration

The React frontend:
- Served by Nginx on port 80
- Proxies API requests to backend
- Single Page Application with client-side routing
- Static asset caching enabled

## Advanced Deployment

### Building Individual Services

#### Build Backend Only
```bash
docker build -t fitflow-backend .
```

#### Build Frontend Only
```bash
cd fitness-frontend
docker build -t fitflow-frontend .
```

### Running Individual Services

#### Backend
```bash
docker run -d \
  --name fitflow-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://your-db-host:5432/fitflow \
  -e DB_USERNAME=fitflow \
  -e DB_PASSWORD=fitflow123 \
  fitflow-backend
```

#### Frontend
```bash
docker run -d \
  --name fitflow-frontend \
  -p 80:80 \
  fitflow-frontend
```

### Custom Docker Compose Configuration

For production deployments, create a `docker-compose.prod.yml`:

```yaml
services:
  backend:
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:postgresql://your-production-db:5432/fitflow
    restart: always

  frontend:
    restart: always
```

Deploy with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Production Deployment

### Security Recommendations

1. **Change Default Passwords**: Update `DB_PASSWORD` in `.env`
2. **Use Secrets**: For production, use Docker secrets or environment-specific configs
3. **Enable HTTPS**: Add a reverse proxy (Nginx/Traefik) with SSL certificates
4. **Network Security**: Restrict database port exposure
5. **Regular Updates**: Keep Docker images and dependencies updated

### Cloud Deployment Options

#### Docker Compose on VPS (DigitalOcean, AWS EC2, etc.)

1. Provision a VPS with Docker installed
2. Clone repository and configure `.env`
3. Run `docker-compose up -d`
4. Configure firewall rules
5. Set up domain and SSL certificate

#### Kubernetes

For Kubernetes deployment, convert Docker Compose to K8s manifests:
```bash
kompose convert -f docker-compose.yml
```

#### Cloud Platform Services

- **AWS**: Use ECS/Fargate with RDS for database
- **Google Cloud**: Use Cloud Run with Cloud SQL
- **Azure**: Use Container Instances with Azure Database for PostgreSQL
- **Heroku**: Deploy as container-based apps

## Monitoring and Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Service Health Checks
```bash
# Check backend health
curl http://localhost:8080/actuator/health

# Check frontend
curl http://localhost

# Check database connection
docker-compose exec database pg_isready -U fitflow
```

### Container Stats
```bash
# View resource usage
docker stats
```

## Troubleshooting

### Backend Won't Start

**Issue**: Backend fails to connect to database

**Solution**:
```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Verify environment variables
docker-compose config
```

### Frontend Not Loading

**Issue**: Frontend shows blank page or 502 error

**Solution**:
```bash
# Check backend is running
docker-compose ps backend

# Check nginx logs
docker-compose logs frontend

# Verify API proxy configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

### Database Connection Issues

**Issue**: Backend can't connect to database

**Solution**:
```bash
# Check database is healthy
docker-compose ps

# Test connection manually
docker-compose exec backend wget --spider http://database:5432

# Recreate services
docker-compose down
docker-compose up -d
```

### Port Already in Use

**Issue**: "Port is already allocated" error

**Solution**:
```bash
# Find process using the port
lsof -i :8080  # or :80 or :5432

# Kill the process or change port in docker-compose.yml
```

## Database Management

### Backup Database
```bash
# Create backup
docker-compose exec database pg_dump -U fitflow fitflow > backup.sql

# Or using docker exec
docker exec fitflow-database pg_dump -U fitflow fitflow > backup.sql
```

### Restore Database
```bash
# Restore from backup
docker-compose exec -T database psql -U fitflow fitflow < backup.sql
```

### Access Database CLI
```bash
docker-compose exec database psql -U fitflow -d fitflow
```

## Updating the Application

### Update Services
```bash
# Pull latest code
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Update Individual Service
```bash
# Update backend only
docker-compose up -d --build backend

# Update frontend only
docker-compose up -d --build frontend
```

## Scaling

### Horizontal Scaling
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Note: Requires load balancer configuration
```

## Development vs Production

### Development
```bash
# Use development profile
SPRING_PROFILES_ACTIVE=dev docker-compose up
```

### Production
```bash
# Use production profile (default)
docker-compose up -d
```

## Support

For issues or questions:
- Check [GitHub Issues](https://github.com/Karthik-Dsa/FitFlow/issues)
- Review [Contributing Guidelines](CONTRIBUTING.md)
- Join the community discussions

## License

This project is open-source under the terms specified in the LICENSE file.
