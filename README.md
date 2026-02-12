# FitFlow 

An open-source fitness tracking platform where developers learn, build, and contribute together.

This is an **MVP-first project** — features are added incrementally and tested properly.

---
## 🎯 Why Contribute Here?

This isn't just a repo —it's a **real-world project designed for learning and collaboration**. Whether you're looking to: 

- ✅ Make your first open-source contribution
- ✅ Build experience with Java development (Spring-Boot)
- ✅ Work with modern web tech (React)
- ✅ Practice Git workflows, CI/CD, and testing
- ✅ Join a friendly community that helps each other learn.

**You're in the right place!** 🎉

> ⭐ **Like what you see?** Star the repo to help others discover it!

---

## 🧠 Tech Stack
- **Backend**: Spring Boot 4.x, JPA, PostgreSQL, Flyway
- **Frontend**: React 19, Tailwind CSS
- **Deployment**: Docker, Docker Compose
- **Auth**: JWT (planned)
- **Testing**: JUnit (planned)

---

## ✨ Features
- Create workouts
- Add exercises to workouts
- Track sets, reps, duration
- More coming soon...

---

## 🛣️ Roadmap
- [x] Workout & Exercise entities
- [x] Docker & Docker Compose setup
- [ ] REST APIs
- [ ] Authentication
- [ ] Frontend UI
- [ ] Testing

---

## 🤝 Contributing
We love contributions from beginners and experienced devs!

Please read:
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## 🧑‍💻 Getting Started

### Quick Deployment (Docker)

The fastest way to get FitFlow running is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/Karthik-Dsa/FitFlow.git
cd FitFlow

# Copy environment configuration
cp .env.example .env

# Start all services (backend, frontend, database)
docker-compose up -d

# Verify deployment
./verify-deployment.sh
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

To stop the application:
```bash
docker-compose down
```

For detailed deployment instructions, troubleshooting, and production setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Local Development

#### Backend (Spring Boot)
```bash
# Requires Java 21
./mvnw spring-boot:run
```

#### Frontend (React)
```bash
cd fitness-frontend
npm install
npm start
```

#### Database
Set up PostgreSQL locally or use Docker:
```bash
docker run -d \
  --name fitflow-postgres \
  -e POSTGRES_DB=fitflow \
  -e POSTGRES_USER=fitflow \
  -e POSTGRES_PASSWORD=fitflow123 \
  -p 5432:5432 \
  postgres:16-alpine
```