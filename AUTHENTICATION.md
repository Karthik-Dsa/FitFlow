# FitFlow Authentication

This document describes the JWT-based authentication implementation for the FitFlow fitness tracker application.

## Features

- User registration with email and username
- User login with email or username
- JWT-based stateless authentication
- BCrypt password hashing
- Secure API endpoints

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Register a New User
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "emailOrUsername": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

### Protected Endpoints (Authentication Required)

All other API endpoints require a valid JWT token in the Authorization header:

```bash
GET /api/workout/1
Authorization: Bearer <your-jwt-token>
```

## Configuration

### Required Environment Variables

```properties
# JWT Secret Key (MUST be changed in production)
jwt.secret=your-secret-key-at-least-256-bits

# JWT Token Expiration (in milliseconds)
jwt.expiration=86400000

# CORS Allowed Origins
cors.allowed-origins=http://localhost:3000
```

### Database Configuration

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fitness_tracker
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Security Features

### Password Security
- Passwords are hashed using BCrypt with automatic salt generation
- Plain text passwords are never stored

### JWT Security
- Tokens include userId, username, and email claims
- Tokens are signed using HS256 algorithm
- Tokens expire after 24 hours by default
- Invalid or expired tokens are rejected

### Session Management
- Stateless session management (no server-side sessions)
- Each request is authenticated independently via JWT token

### CSRF Protection
CSRF protection is intentionally disabled because:
- This is a stateless JWT-based API
- JWT tokens are not stored in cookies
- The browser doesn't automatically send JWT tokens
- CSRF attacks target session-based authentication, not token-based

## Utility Classes

### SecurityUtil

Utility class to get the currently authenticated user:

```java
@Autowired
private SecurityUtil securityUtil;

// Get current user
User currentUser = securityUtil.getCurrentUser();

// Get current user ID
Long userId = securityUtil.getCurrentUserId();
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

### Common Error Responses

- `400 Bad Request` - Validation errors or duplicate username/email
- `401 Unauthorized` - Invalid credentials during login
- `403 Forbidden` - Missing or invalid JWT token
- `500 Internal Server Error` - Unexpected server error

## Production Deployment Checklist

- [ ] Change the JWT secret to a strong, randomly generated key
- [ ] Store JWT secret in environment variables or secure vault
- [ ] Configure CORS allowed origins for your production domain
- [ ] Use HTTPS in production
- [ ] Set appropriate JWT expiration time
- [ ] Enable database connection pooling
- [ ] Configure proper logging
- [ ] Set up monitoring and alerting
