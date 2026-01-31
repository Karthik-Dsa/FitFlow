# Production Deployment Guide

This guide covers deploying FitFlow to various production environments.

## Prerequisites

- A server or cloud VM with Docker installed
- Domain name (optional, but recommended)
- SSL certificate (Let's Encrypt recommended)

## Option 1: Deploy to VPS (DigitalOcean, Linode, AWS EC2, etc.)

### Step 1: Provision a Server

1. Create a VPS with at least 2GB RAM
2. Choose Ubuntu 22.04 LTS or similar
3. SSH into your server

### Step 2: Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### Step 3: Clone and Configure

```bash
# Clone repository
git clone https://github.com/Karthik-Dsa/FitFlow.git
cd FitFlow

# Create .env file with secure credentials
cat > .env << EOF
DB_USERNAME=fitflow
DB_PASSWORD=$(openssl rand -base64 32)
SPRING_PROFILES_ACTIVE=prod
REACT_APP_API_URL=https://your-domain.com/api
EOF

# Set proper permissions
chmod 600 .env
```

### Step 4: Deploy with Docker Compose

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Configure Firewall

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### Step 6: Set Up Reverse Proxy with SSL (Optional but Recommended)

Create `nginx-proxy.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Option 2: Deploy to Cloud Platform Services

### AWS (Elastic Container Service)

1. **Build and push images to ECR**:
```bash
# Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t fitflow-backend .
docker tag fitflow-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/fitflow-backend:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/fitflow-backend:latest
```

2. **Create RDS PostgreSQL instance**
3. **Create ECS Task Definition** with your images
4. **Create ECS Service** with Application Load Balancer
5. **Configure environment variables** in Task Definition

### Google Cloud (Cloud Run)

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/[PROJECT-ID]/fitflow-backend
gcloud builds submit --tag gcr.io/[PROJECT-ID]/fitflow-frontend ./fitness-frontend

# Deploy backend
gcloud run deploy fitflow-backend \
  --image gcr.io/[PROJECT-ID]/fitflow-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DB_URL=[CONNECTION_STRING],DB_USERNAME=[USER],DB_PASSWORD=[PASSWORD]

# Deploy frontend
gcloud run deploy fitflow-frontend \
  --image gcr.io/[PROJECT-ID]/fitflow-frontend \
  --platform managed \
  --region us-central1
```

### Azure (Container Instances)

```bash
# Login to Azure
az login

# Create resource group
az group create --name fitflow-rg --location eastus

# Create Azure Container Registry
az acr create --resource-group fitflow-rg --name fitflowacr --sku Basic

# Build and push images
az acr build --registry fitflowacr --image fitflow-backend .
az acr build --registry fitflowacr --image fitflow-frontend ./fitness-frontend

# Create PostgreSQL database
az postgres flexible-server create \
  --resource-group fitflow-rg \
  --name fitflow-db \
  --admin-user fitflow \
  --admin-password [PASSWORD]

# Deploy containers
az container create \
  --resource-group fitflow-rg \
  --name fitflow-backend \
  --image fitflowacr.azurecr.io/fitflow-backend \
  --dns-name-label fitflow-backend \
  --ports 8080 \
  --environment-variables \
    DB_URL=[CONNECTION_STRING] \
    DB_USERNAME=fitflow \
    DB_PASSWORD=[PASSWORD]
```

## Option 3: Deploy to Kubernetes

### Using Kompose (Convert Docker Compose to Kubernetes)

```bash
# Install kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.31.2/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv kompose /usr/local/bin/kompose

# Convert docker-compose.yml to Kubernetes manifests
kompose convert

# Apply to Kubernetes cluster
kubectl apply -f .
```

### Manual Kubernetes Deployment

Create `k8s-deployment.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fitflow

---
apiVersion: v1
kind: Secret
metadata:
  name: fitflow-secrets
  namespace: fitflow
type: Opaque
stringData:
  db-username: fitflow
  db-password: your-secure-password

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: fitflow
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: fitflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        env:
        - name: POSTGRES_DB
          value: fitflow
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: fitflow-secrets
              key: db-username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: fitflow-secrets
              key: db-password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: fitflow
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: fitflow
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/fitflow-backend:latest
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: prod
        - name: DB_URL
          value: jdbc:postgresql://postgres:5432/fitflow
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: fitflow-secrets
              key: db-username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: fitflow-secrets
              key: db-password
        ports:
        - containerPort: 8080

---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: fitflow
spec:
  selector:
    app: backend
  ports:
  - port: 8080
    targetPort: 8080

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: fitflow
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/fitflow-frontend:latest
        ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: fitflow
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fitflow-ingress
  namespace: fitflow
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: fitflow-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yaml
```

## Post-Deployment Checklist

- [ ] Change default database password
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup strategy for database
- [ ] Configure monitoring and logging
- [ ] Set up health check endpoints
- [ ] Configure CDN for static assets (optional)
- [ ] Set up CI/CD pipeline
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up log aggregation (e.g., ELK stack)
- [ ] Configure rate limiting
- [ ] Set up automated backups
- [ ] Document recovery procedures

## Monitoring

### Health Checks

```bash
# Backend health
curl https://your-domain.com/actuator/health

# Frontend
curl https://your-domain.com

# Database (from backend container)
docker-compose exec backend psql -h database -U fitflow -d fitflow -c "SELECT 1"
```

### View Logs

```bash
# Docker Compose
docker-compose logs -f

# Kubernetes
kubectl logs -f -n fitflow deployment/backend
kubectl logs -f -n fitflow deployment/frontend
```

## Backup Strategy

### Automated Database Backups

Create `backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="fitflow_backup_${DATE}.sql"

docker-compose exec -T database pg_dump -U fitflow fitflow > "${BACKUP_DIR}/${FILENAME}"
gzip "${BACKUP_DIR}/${FILENAME}"

# Keep only last 30 days of backups
find ${BACKUP_DIR} -name "fitflow_backup_*.sql.gz" -mtime +30 -delete
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

## Scaling

### Horizontal Scaling

```bash
# Docker Compose (requires load balancer)
docker-compose up -d --scale backend=3

# Kubernetes
kubectl scale deployment backend --replicas=5 -n fitflow
```

## Rollback

### Docker Compose
```bash
# Pull previous version
git checkout [previous-commit]
docker-compose pull
docker-compose up -d
```

### Kubernetes
```bash
# Rollback to previous revision
kubectl rollout undo deployment/backend -n fitflow
kubectl rollout status deployment/backend -n fitflow
```

## Security Best Practices

1. **Use secrets management**: Never commit passwords to git
2. **Enable SSL/TLS**: Always use HTTPS in production
3. **Regular updates**: Keep Docker images and dependencies updated
4. **Limit database access**: Don't expose PostgreSQL port publicly
5. **Use non-root users**: Run containers as non-root
6. **Enable firewall**: Restrict incoming connections
7. **Monitor logs**: Set up log monitoring and alerts
8. **Backup regularly**: Automate database backups
9. **Use strong passwords**: Generate random passwords
10. **Rate limiting**: Implement rate limiting on APIs

## Support

For deployment issues:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting
- Review [GitHub Issues](https://github.com/Karthik-Dsa/FitFlow/issues)
- Ask in GitHub Discussions
