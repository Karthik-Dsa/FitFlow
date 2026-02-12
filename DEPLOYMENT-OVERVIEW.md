# FitFlow Deployment Overview

This document provides an overview of the FitFlow deployment setup and available documentation.

## 📚 Documentation Structure

FitFlow has comprehensive deployment documentation to help you get started quickly:

### For Quick Start
- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes with Docker
  - Simple installation steps
  - Common commands
  - Basic troubleshooting
  - Perfect for local development and testing

### For Detailed Setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
  - Architecture overview
  - Configuration options
  - Advanced deployment scenarios
  - Troubleshooting
  - Database management
  - Monitoring and scaling

### For Production
- **[PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)** - Production deployment options
  - VPS deployment (DigitalOcean, AWS EC2, etc.)
  - Cloud platforms (AWS, GCP, Azure)
  - Kubernetes deployment
  - Security best practices
  - Backup strategies
  - SSL/TLS setup

## 🏗️ Architecture

FitFlow uses a three-tier architecture:

```
┌─────────────────────────────────────────────────────┐
│                    Internet                         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │   Nginx (Frontend)    │
          │   React Application   │
          │   Port: 80            │
          └───────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │   Spring Boot         │
          │   (Backend API)       │
          │   Port: 8080          │
          └───────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │   PostgreSQL          │
          │   (Database)          │
          │   Port: 5432          │
          └───────────────────────┘
```

### Components

1. **Frontend (React + Nginx)**
   - Modern React 19 application
   - Tailwind CSS for styling
   - Served by Nginx for production
   - API requests proxied to backend
   - Port: 80

2. **Backend (Spring Boot)**
   - Java 21 / Spring Boot 4.x
   - RESTful API
   - JPA/Hibernate for ORM
   - Flyway for database migrations
   - Health check endpoint
   - Port: 8080

3. **Database (PostgreSQL)**
   - PostgreSQL 16
   - Persistent data storage
   - Flyway-managed schema
   - Automated backups supported
   - Port: 5432

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Most)
**Best for**: Local development, small deployments, testing

```bash
docker-compose up -d
```

**Pros**:
- Easy to set up
- All-in-one solution
- Great for development
- Works on any OS with Docker

**Cons**:
- Single server only
- No built-in high availability
- Scaling requires manual configuration

### Option 2: Cloud Platform Services
**Best for**: Production deployments, auto-scaling needs

Available platforms:
- AWS (ECS, Fargate, App Runner)
- Google Cloud (Cloud Run, GKE)
- Azure (Container Instances, AKS)
- DigitalOcean (App Platform)
- Heroku (Container Registry)

**Pros**:
- Managed infrastructure
- Auto-scaling
- High availability
- Built-in monitoring

**Cons**:
- Vendor lock-in
- Can be more expensive
- Requires platform knowledge

### Option 3: Kubernetes
**Best for**: Large deployments, multi-region, enterprise

```bash
kubectl apply -f k8s-deployment.yaml
```

**Pros**:
- Highly scalable
- Self-healing
- Platform agnostic
- Advanced orchestration

**Cons**:
- Complex setup
- Steeper learning curve
- Requires K8s knowledge
- Higher operational overhead

### Option 4: Traditional VPS
**Best for**: Full control, custom requirements

Deploy to:
- DigitalOcean Droplets
- AWS EC2
- Linode
- Vultr
- Any VPS provider

**Pros**:
- Full control
- Predictable costs
- Simple pricing
- Direct server access

**Cons**:
- Manual maintenance
- Requires server management skills
- No auto-scaling
- You manage security updates

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Review architecture and requirements
- [ ] Choose deployment option
- [ ] Set up domain (if applicable)
- [ ] Provision servers/cloud resources
- [ ] Install Docker and Docker Compose

### Initial Deployment
- [ ] Clone repository
- [ ] Configure `.env` file
- [ ] Update passwords and secrets
- [ ] Run `docker-compose up -d`
- [ ] Verify with `./verify-deployment.sh`
- [ ] Check health endpoints

### Post-Deployment
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring
- [ ] Configure automated backups
- [ ] Document credentials (securely)
- [ ] Set up log aggregation
- [ ] Configure alerts
- [ ] Test disaster recovery

### Security
- [ ] Change default database password
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Restrict database port
- [ ] Set up fail2ban (VPS)
- [ ] Enable firewall
- [ ] Regular security updates
- [ ] Implement rate limiting

## 🔧 Configuration

### Environment Variables

Key configuration in `.env`:

```env
# Database
DB_USERNAME=fitflow
DB_PASSWORD=<secure-password>

# Backend
SPRING_PROFILES_ACTIVE=prod

# Frontend
REACT_APP_API_URL=http://localhost:8080/api
```

### Ports

Default ports:
- Frontend: `80` (HTTP)
- Backend: `8080` (HTTP)
- Database: `5432` (PostgreSQL)

Change ports in `docker-compose.yml` if needed.

### Database

Default configuration:
- Database: `fitflow`
- User: `fitflow`
- Password: `fitflow123` (⚠️ Change for production!)

## 🔍 Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost

# Database
docker-compose exec database pg_isready -U fitflow
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🛠️ Maintenance

### Updating

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backups

```bash
# Backup database
docker-compose exec database pg_dump -U fitflow fitflow > backup.sql

# Restore database
docker-compose exec -T database psql -U fitflow fitflow < backup.sql
```

### Scaling

```bash
# Scale backend (requires load balancer)
docker-compose up -d --scale backend=3
```

## 📞 Support & Resources

### Documentation
- [README.md](README.md) - Project overview
- [QUICKSTART.md](QUICKSTART.md) - Quick installation guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md) - Production setup

### Tools
- [verify-deployment.sh](verify-deployment.sh) - Deployment verification script
- [docker-compose.yml](docker-compose.yml) - Docker Compose configuration
- [.env.example](.env.example) - Environment template

### Community
- GitHub Issues: Report bugs and issues
- GitHub Discussions: Ask questions and share ideas
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)

## 🎯 Quick Links

| Task | Command |
|------|---------|
| **Start** | `docker-compose up -d` |
| **Stop** | `docker-compose down` |
| **Logs** | `docker-compose logs -f` |
| **Status** | `docker-compose ps` |
| **Verify** | `./verify-deployment.sh` |
| **Update** | `git pull && docker-compose up -d --build` |
| **Backup** | `docker-compose exec database pg_dump -U fitflow fitflow > backup.sql` |

## 🌟 Next Steps

1. Choose your deployment option from above
2. Follow the corresponding guide
3. Deploy FitFlow
4. Verify the deployment
5. Set up monitoring and backups
6. Enjoy your fitness tracking platform!

## 🤝 Contributing

Want to improve the deployment setup? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

**Ready to deploy?** Start with [QUICKSTART.md](QUICKSTART.md) for the fastest path to a running application!
