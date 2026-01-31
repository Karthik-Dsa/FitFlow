#!/bin/bash

# FitFlow Deployment Verification Script
# This script checks if all services are running correctly

set -e

echo "======================================"
echo "FitFlow Deployment Verification"
echo "======================================"
echo

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Check if Docker is running
echo "Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗${NC} Docker is not installed"
    exit 1
fi
print_status 0 "Docker is installed"

if ! docker info &> /dev/null; then
    echo -e "${RED}✗${NC} Docker daemon is not running"
    exit 1
fi
print_status 0 "Docker daemon is running"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}✗${NC} Docker Compose is not installed"
    exit 1
fi
print_status 0 "Docker Compose is installed"
echo

# Check if docker-compose.yml exists
echo "Checking configuration..."
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}✗${NC} docker-compose.yml not found"
    echo "Please run this script from the project root directory"
    exit 1
fi
print_status 0 "docker-compose.yml found"

# Check if .env file exists, create from example if not
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file not found"
    if [ -f ".env.example" ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
        print_status 0 ".env created from example"
    else
        echo -e "${YELLOW}⚠${NC} .env.example not found, using default values"
    fi
else
    print_status 0 ".env file exists"
fi
echo

# Check if services are running
echo "Checking service status..."
COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

# Get running containers
RUNNING_CONTAINERS=$($COMPOSE_CMD ps -q 2>/dev/null | wc -l)

if [ "$RUNNING_CONTAINERS" -eq 0 ]; then
    echo -e "${YELLOW}⚠${NC} No services are currently running"
    echo "Would you like to start the services? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Starting services..."
        $COMPOSE_CMD up -d
        echo "Waiting for services to start (30 seconds)..."
        sleep 30
    else
        echo "Exiting..."
        exit 0
    fi
fi

# Check individual services
echo
echo "Verifying services..."

# Check database
if docker ps --format '{{.Names}}' | grep -q "fitflow-database"; then
    print_status 0 "Database container is running"
    
    # Check if database is healthy
    DB_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' fitflow-database 2>/dev/null || echo "unknown")
    if [ "$DB_HEALTH" = "healthy" ]; then
        print_status 0 "Database is healthy"
    elif [ "$DB_HEALTH" = "starting" ]; then
        echo -e "${YELLOW}⚠${NC} Database is starting..."
    else
        echo -e "${YELLOW}⚠${NC} Database health status: $DB_HEALTH"
    fi
else
    print_status 1 "Database container is not running"
fi

# Check backend
if docker ps --format '{{.Names}}' | grep -q "fitflow-backend"; then
    print_status 0 "Backend container is running"
    
    # Check if backend is responding
    if curl -sf http://localhost:8080/actuator/health > /dev/null 2>&1; then
        print_status 0 "Backend is responding to health checks"
    else
        echo -e "${YELLOW}⚠${NC} Backend is not responding (may still be starting)"
    fi
else
    print_status 1 "Backend container is not running"
fi

# Check frontend
if docker ps --format '{{.Names}}' | grep -q "fitflow-frontend"; then
    print_status 0 "Frontend container is running"
    
    # Check if frontend is responding
    if curl -sf http://localhost > /dev/null 2>&1; then
        print_status 0 "Frontend is responding"
    else
        echo -e "${YELLOW}⚠${NC} Frontend is not responding"
    fi
else
    print_status 1 "Frontend container is not running"
fi

echo
echo "======================================"
echo "Service URLs:"
echo "======================================"
echo "Frontend:  http://localhost"
echo "Backend:   http://localhost:8080"
echo "Database:  localhost:5432"
echo
echo "To view logs:"
echo "  All services:  $COMPOSE_CMD logs -f"
echo "  Backend only:  $COMPOSE_CMD logs -f backend"
echo "  Frontend only: $COMPOSE_CMD logs -f frontend"
echo "  Database only: $COMPOSE_CMD logs -f database"
echo
echo "To stop services:"
echo "  $COMPOSE_CMD down"
echo
echo "For more information, see DEPLOYMENT.md"
echo "======================================"
