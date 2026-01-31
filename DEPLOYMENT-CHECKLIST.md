# Deployment Checklist

Use this checklist to ensure a successful deployment of FitFlow.

## Pre-Deployment

### System Requirements
- [ ] Docker installed (version 20.10+)
- [ ] Docker Compose installed (version 2.0+)
- [ ] Git installed
- [ ] At least 2GB RAM available
- [ ] Ports available: 80, 8080, 5432
- [ ] Internet connection for downloading images

### Documentation Review
- [ ] Read [QUICKSTART.md](QUICKSTART.md)
- [ ] Review [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Check [DEPLOYMENT-OVERVIEW.md](DEPLOYMENT-OVERVIEW.md) for architecture
- [ ] If deploying to production, read [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)

## Initial Setup

### Repository
- [ ] Clone repository: `git clone https://github.com/Karthik-Dsa/FitFlow.git`
- [ ] Navigate to directory: `cd FitFlow`
- [ ] Check current branch: `git branch`
- [ ] Pull latest changes: `git pull origin main`

### Configuration
- [ ] Copy environment template: `cp .env.example .env`
- [ ] Review `.env` file contents
- [ ] Update `DB_PASSWORD` (especially for production)
- [ ] Update `REACT_APP_API_URL` if needed
- [ ] Verify port configurations

### Pre-Flight Checks
- [ ] Docker daemon is running: `docker info`
- [ ] Docker Compose is available: `docker compose version`
- [ ] Ports are not in use: `lsof -i :80 && lsof -i :8080 && lsof -i :5432`
- [ ] Check available disk space: `df -h`
- [ ] Verify network connectivity: `ping -c 3 google.com`

## Deployment

### Build and Start
- [ ] Start services: `docker-compose up -d`
- [ ] Wait for services to initialize (30-60 seconds)
- [ ] Check service status: `docker-compose ps`
- [ ] Verify all services are running
- [ ] Check no services are in "restarting" state

### Verification
- [ ] Run verification script: `./verify-deployment.sh`
- [ ] Check database health: `docker-compose exec database pg_isready -U fitflow`
- [ ] Check backend health: `curl http://localhost:8080/actuator/health`
- [ ] Check frontend: `curl http://localhost`
- [ ] Open browser and visit: http://localhost
- [ ] Check browser console for errors
- [ ] Test basic navigation

### Logs Review
- [ ] Check all logs: `docker-compose logs`
- [ ] Check backend logs: `docker-compose logs backend`
- [ ] Check frontend logs: `docker-compose logs frontend`
- [ ] Check database logs: `docker-compose logs database`
- [ ] Verify no critical errors in logs
- [ ] Check for any warning messages

## Post-Deployment

### Testing
- [ ] Test frontend loads correctly
- [ ] Test API endpoints are accessible
- [ ] Verify database connection is working
- [ ] Test basic functionality
- [ ] Check responsive design on mobile
- [ ] Verify API proxy is working (frontend to backend)

### Security (Production Only)
- [ ] Change default database password
- [ ] Use strong, unique passwords
- [ ] Review `.env` for sensitive data
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Restrict database port exposure
- [ ] Enable fail2ban (if VPS)
- [ ] Set up security headers in Nginx
- [ ] Review CORS configuration

### Monitoring Setup
- [ ] Configure health check monitoring
- [ ] Set up log aggregation (optional)
- [ ] Configure alerts for service failures
- [ ] Set up uptime monitoring
- [ ] Configure resource usage alerts
- [ ] Set up error tracking (e.g., Sentry)

### Backup Configuration
- [ ] Set up automated database backups
- [ ] Test backup restore process
- [ ] Document backup location
- [ ] Set up backup retention policy
- [ ] Configure off-site backup storage
- [ ] Document recovery procedures

### Documentation
- [ ] Document deployment date and version
- [ ] Record configuration settings
- [ ] Save credentials securely
- [ ] Document any custom changes
- [ ] Create runbook for common operations
- [ ] Document troubleshooting steps

## Production Additional Steps

### Domain & DNS
- [ ] Configure DNS A record
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure domain in `.env`
- [ ] Update CORS settings for domain
- [ ] Test HTTPS redirect
- [ ] Verify SSL certificate validity

### Performance
- [ ] Configure CDN (optional)
- [ ] Set up caching headers
- [ ] Enable gzip compression
- [ ] Optimize database queries
- [ ] Set up connection pooling
- [ ] Configure rate limiting

### High Availability (Optional)
- [ ] Set up load balancer
- [ ] Configure multiple backend instances
- [ ] Set up database replication
- [ ] Configure health checks in load balancer
- [ ] Test failover scenarios
- [ ] Document disaster recovery plan

### Compliance
- [ ] Review data privacy requirements
- [ ] Configure data retention policies
- [ ] Set up audit logging
- [ ] Review security compliance
- [ ] Document compliance procedures
- [ ] Set up regular security scans

## Maintenance Schedule

### Daily
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor resource usage
- [ ] Check backup completion

### Weekly
- [ ] Review security logs
- [ ] Update dependencies (if needed)
- [ ] Test backup restore
- [ ] Check disk space
- [ ] Review performance metrics

### Monthly
- [ ] Update Docker images
- [ ] Review and rotate logs
- [ ] Security audit
- [ ] Test disaster recovery
- [ ] Review documentation
- [ ] Update dependencies

### Quarterly
- [ ] Full security audit
- [ ] Performance review
- [ ] Capacity planning
- [ ] Update documentation
- [ ] Team training/review

## Troubleshooting Checklist

### Service Won't Start
- [ ] Check Docker daemon is running
- [ ] Verify port availability
- [ ] Check disk space
- [ ] Review error logs
- [ ] Verify configuration files
- [ ] Check file permissions

### Connection Issues
- [ ] Verify network connectivity
- [ ] Check firewall rules
- [ ] Verify service is running
- [ ] Test from different network
- [ ] Check DNS resolution
- [ ] Verify SSL certificate (if HTTPS)

### Performance Issues
- [ ] Check resource usage (CPU, RAM)
- [ ] Review database queries
- [ ] Check network latency
- [ ] Review application logs
- [ ] Monitor disk I/O
- [ ] Check for memory leaks

### Data Issues
- [ ] Verify database connection
- [ ] Check database migrations
- [ ] Review data integrity
- [ ] Test backup restore
- [ ] Check database logs
- [ ] Verify data permissions

## Rollback Plan

### If Deployment Fails
- [ ] Document the issue
- [ ] Stop services: `docker-compose down`
- [ ] Revert to previous version: `git checkout [previous-version]`
- [ ] Restore database backup (if needed)
- [ ] Restart services: `docker-compose up -d`
- [ ] Verify rollback successful
- [ ] Document lessons learned

## Sign-Off

### Deployment Lead
- Name: ________________
- Date: ________________
- Signature: ________________

### Verification
- [ ] All checklist items completed
- [ ] Services running successfully
- [ ] No critical errors in logs
- [ ] Basic functionality tested
- [ ] Documentation updated
- [ ] Team notified of deployment

---

## Quick Reference

### Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart service
docker-compose restart [service-name]

# Verify deployment
./verify-deployment.sh

# Backup database
docker-compose exec database pg_dump -U fitflow fitflow > backup.sql

# Restore database
docker-compose exec -T database psql -U fitflow fitflow < backup.sql
```

### Support Contacts

- GitHub Issues: https://github.com/Karthik-Dsa/FitFlow/issues
- Documentation: [DEPLOYMENT.md](DEPLOYMENT.md)
- Quick Start: [QUICKSTART.md](QUICKSTART.md)

---

**Version**: 1.0  
**Last Updated**: 2026-01-31  
**Document Owner**: FitFlow Team
