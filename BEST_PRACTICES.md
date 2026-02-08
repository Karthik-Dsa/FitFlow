# FitFlow - Best Practices & Developer Guidelines

This document outlines the recommended best practices for developing and maintaining the FitFlow project.

---

## Table of Contents
1. [Project Setup](#project-setup)
2. [Code Style & Standards](#code-style--standards)
3. [Security Best Practices](#security-best-practices)
4. [Testing Guidelines](#testing-guidelines)
5. [Git Workflow](#git-workflow)
6. [Documentation Standards](#documentation-standards)
7. [Performance Guidelines](#performance-guidelines)
8. [What To Do](#what-to-do-)
9. [What NOT To Do](#what-not-to-do-)

---

## Project Setup

### Prerequisites
- **Java**: Version 21 (LTS)
- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 16 or higher
- **Maven**: Version 3.9 or higher
- **Git**: Latest stable version

### Initial Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Karthik-Dsa/FitFlow.git
   cd FitFlow
   ```

2. **Backend Setup**
   ```bash
   # Copy configuration template
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   
   # Edit application.properties and configure:
   # - Database connection
   # - JWT secret (minimum 32 characters)
   # - Other environment-specific settings
   
   # Build and run
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd fitness-frontend
   
   # Copy environment template
   cp .env.example .env
   
   # Edit .env if needed (default is http://localhost:8080)
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb fitflow
   
   # Flyway migrations will run automatically on application start
   ```

---

## Code Style & Standards

### Java/Spring Boot

#### ✅ DO:

**1. Use Constructor Injection**
```java
@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }
}
```

**2. Use Lombok Annotations**
```java
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    // ...
}
```

**3. Use Bean Validation**
```java
@NotBlank(message = "Email is required")
@Email(message = "Email must be valid")
private String email;
```

**4. Use Proper Logging**
```java
@Slf4j
@Service
public class MyService {
    public void doSomething() {
        log.info("Doing something");
        log.error("Error occurred", exception);
    }
}
```

**5. Follow REST API Conventions**
```java
@PostMapping          // Create - 201 Created
@GetMapping("/{id}")  // Read   - 200 OK
@PutMapping("/{id}")  // Update - 200 OK
@DeleteMapping("/{id}") // Delete - 204 No Content
```

**6. Use DTOs for API Boundaries**
```java
// Never expose entities directly
public ResponseEntity<UserResponseDto> getUser(@PathVariable Long id) {
    User user = userService.findById(id);
    return ResponseEntity.ok(UserMapper.toDto(user));
}
```

#### ❌ DON'T:

**1. Don't Use Field Injection**
```java
// BAD
@Autowired
private UserRepository userRepository;

// GOOD - Use constructor injection instead
```

**2. Don't Use Static Methods with Spring Beans**
```java
// BAD - Spring can't inject into static fields
@Value("${jwt.secret}")
private static String secret;

// GOOD - Use instance fields
@Value("${jwt.secret}")
private String secret;
```

**3. Don't Swallow Exceptions**
```java
// BAD
try {
    doSomething();
} catch (Exception e) {
    // Silent failure
}

// GOOD
try {
    doSomething();
} catch (Exception e) {
    log.error("Failed to do something", e);
    throw new CustomException("Operation failed", e);
}
```

**4. Don't Use System.out or printStackTrace()**
```java
// BAD
System.out.println("Debug message");
e.printStackTrace();

// GOOD
log.debug("Debug message");
log.error("Error occurred", e);
```

---

### React/JavaScript

#### ✅ DO:

**1. Use Functional Components with Hooks**
```javascript
function MyComponent() {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effects here
  }, [dependencies]);
  
  return <div>{state}</div>;
}
```

**2. Use Environment Variables**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

fetch(`${API_URL}/api/endpoint`, {
  // ...
});
```

**3. Handle Errors Properly**
```javascript
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

async function fetchData() {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setData(data);
  } catch (err) {
    setError(err.message);
    console.error('Fetch failed:', err);
  } finally {
    setLoading(false);
  }
}
```

**4. Include Auth Tokens in Requests**
```javascript
const token = localStorage.getItem('authToken');

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

**5. Use PropTypes for Type Checking**
```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onAction: PropTypes.func.isRequired
};
```

#### ❌ DON'T:

**1. Don't Hardcode API URLs**
```javascript
// BAD
fetch('http://localhost:8080/api/workout', { ... });

// GOOD
const API_URL = process.env.REACT_APP_API_URL;
fetch(`${API_URL}/api/workout`, { ... });
```

**2. Don't Ignore Loading and Error States**
```javascript
// BAD - No loading or error handling
function MyComponent() {
  const [data, setData] = useState(null);
  // ...
  return <div>{data.map(...)}</div>; // Crashes if data is null
}

// GOOD
function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;
  
  return <div>{data.map(...)}</div>;
}
```

**3. Don't Store Sensitive Data in State/LocalStorage Without Encryption**
```javascript
// Be careful with tokens
localStorage.setItem('authToken', token); // OK for JWT tokens
// But never store passwords or sensitive PII
```

---

## Security Best Practices

### Authentication & Authorization

#### ✅ DO:

1. **Use Strong JWT Secrets**
   - Minimum 32 characters
   - Use random generation: `openssl rand -base64 32`
   - Store in environment variables

2. **Validate JWT Tokens Properly**
   ```java
   public boolean validateToken(String token, String username) {
       return (extractUsername(token).equals(username) && !isTokenExpired(token));
   }
   ```

3. **Use BCrypt for Password Hashing**
   ```java
   @Bean
   public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
   }
   ```

4. **Implement Proper CORS Configuration**
   ```java
   @CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
   ```

5. **Validate All Inputs**
   ```java
   @NotBlank(message = "Email is required")
   @Email(message = "Email must be valid")
   private String email;
   ```

#### ❌ DON'T:

1. **Don't Commit Secrets**
   - Never commit `application.properties` with real secrets
   - Use `.example` templates instead

2. **Don't Log Sensitive Information**
   ```java
   // BAD
   log.info("User password: {}", password);
   
   // GOOD
   log.info("User {} logged in", username);
   ```

3. **Don't Expose Stack Traces to Clients**
   ```java
   @ExceptionHandler(Exception.class)
   public ResponseEntity<ErrorResponse> handleException(Exception ex) {
       log.error("Error occurred", ex); // Log full trace
       return ResponseEntity.status(500)
           .body(new ErrorResponse("An error occurred")); // Generic message to client
   }
   ```

4. **Don't Disable CSRF Without Good Reason**
   ```java
   // Only disable for stateless REST APIs with JWT
   http.csrf(csrf -> csrf.disable())
   ```

---

### Input Validation

#### ✅ DO:

1. **Validate on Both Frontend and Backend**
2. **Use Bean Validation Annotations**
3. **Validate File Uploads**
4. **Sanitize User Inputs**
5. **Use Parameterized Queries** (JPA does this automatically)

---

## Testing Guidelines

### Backend Testing

#### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @InjectMocks
    private AuthServiceImpl authService;
    
    @Test
    void register_Success() {
        // Arrange
        RegisterRequestDto request = new RegisterRequestDto("user", "email@test.com", "pass123");
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        // ...
        
        // Act
        AuthResponseDto response = authService.register(request);
        
        // Assert
        assertNotNull(response);
        verify(userRepository).save(any(User.class));
    }
}
```

#### Integration Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void login_Success() throws Exception {
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"emailOrUsername\":\"test@example.com\",\"password\":\"pass123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}
```

### Frontend Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutBuilder from './WorkoutBuilder';

test('renders workout builder', () => {
  render(<WorkoutBuilder />);
  expect(screen.getByText(/Create Workout/i)).toBeInTheDocument();
});

test('saves workout on button click', async () => {
  render(<WorkoutBuilder />);
  const input = screen.getByPlaceholderText(/Workout name/i);
  const button = screen.getByText(/Save Workout/i);
  
  fireEvent.change(input, { target: { value: 'My Workout' } });
  fireEvent.click(button);
  
  // Assert expected behavior
});
```

### Testing Standards

#### ✅ DO:
- Write tests for all new features
- Aim for 70%+ code coverage
- Test happy paths and error cases
- Use meaningful test names
- Keep tests isolated and independent
- Mock external dependencies

#### ❌ DON'T:
- Don't skip writing tests
- Don't test implementation details
- Don't create interdependent tests
- Don't commit commented-out tests
- Don't ignore failing tests

---

## Git Workflow

### Branch Naming Convention
```
feature/add-user-profile
bugfix/fix-login-error
hotfix/security-patch
refactor/improve-jwt-validation
docs/update-readme
```

### Commit Message Format
```
feat: add user profile endpoint
fix: resolve JWT token validation bug
docs: update API documentation
refactor: improve error handling in auth service
test: add unit tests for workout service
chore: update dependencies
```

### Pull Request Guidelines

#### ✅ DO:
1. Write descriptive PR titles and descriptions
2. Reference related issues
3. Keep PRs focused and small
4. Request reviews from maintainers
5. Resolve all comments before merging
6. Ensure CI passes

#### PR Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings generated
```

---

## Documentation Standards

### Code Documentation

#### ✅ DO:

**1. Document Public APIs**
```java
/**
 * Registers a new user in the system.
 * 
 * @param request the registration details including username, email, and password
 * @return AuthResponseDto containing JWT token and user information
 * @throws IllegalArgumentException if email or username already exists
 */
@Override
public AuthResponseDto register(RegisterRequestDto request) {
    // ...
}
```

**2. Add Inline Comments for Complex Logic**
```java
// Calculate token expiration: current time + 24 hours in milliseconds
.setExpiration(new Date(System.currentTimeMillis() + expiration))
```

**3. Keep README Updated**
- Setup instructions
- Prerequisites
- Environment variables
- Running tests
- Deployment steps

#### ❌ DON'T:
- Don't over-comment obvious code
- Don't leave commented-out code
- Don't write misleading comments
- Don't forget to update docs when changing code

---

## Performance Guidelines

### Backend Performance

#### ✅ DO:

1. **Use Pagination for List Endpoints**
   ```java
   @GetMapping
   public Page<WorkoutDto> getWorkouts(
       @RequestParam(defaultValue = "0") int page,
       @RequestParam(defaultValue = "20") int size) {
       Pageable pageable = PageRequest.of(page, size);
       return workoutService.findAll(pageable);
   }
   ```

2. **Use @EntityGraph to Prevent N+1 Queries**
   ```java
   @EntityGraph(attributePaths = {"exercises"})
   Workout findByIdWithExercises(Long id);
   ```

3. **Add Database Indexes**
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_workouts_user_id ON workouts(user_id);
   ```

4. **Use Lazy Loading for Associations**
   ```java
   @ManyToOne(fetch = FetchType.LAZY)
   private User user;
   ```

5. **Implement Caching When Appropriate**
   ```java
   @Cacheable("users")
   public User findById(Long id) {
       return userRepository.findById(id).orElseThrow();
   }
   ```

#### ❌ DON'T:
- Don't return entire collections without pagination
- Don't use EAGER fetching unless necessary
- Don't forget to add database indexes
- Don't ignore N+1 query problems

### Frontend Performance

#### ✅ DO:
1. Use React.memo for expensive components
2. Implement virtual scrolling for long lists
3. Lazy load routes and components
4. Optimize images and assets
5. Use production builds for deployment

---

## What TO DO ✅

### General Development
1. ✅ **Follow the coding standards** outlined in this document
2. ✅ **Write tests** for all new features and bug fixes
3. ✅ **Review your own code** before creating a PR
4. ✅ **Run linters and formatters** before committing
5. ✅ **Keep commits atomic** and focused
6. ✅ **Write meaningful commit messages**
7. ✅ **Update documentation** when changing functionality
8. ✅ **Handle errors gracefully** with user-friendly messages
9. ✅ **Validate all inputs** on both frontend and backend
10. ✅ **Log important events** for debugging and monitoring

### Security
1. ✅ **Use environment variables** for secrets
2. ✅ **Validate and sanitize** all user inputs
3. ✅ **Implement proper authentication** and authorization
4. ✅ **Use HTTPS** in production
5. ✅ **Keep dependencies updated** to patch vulnerabilities
6. ✅ **Review security implications** of your changes
7. ✅ **Follow OWASP** best practices

### Code Quality
1. ✅ **Keep functions small** and focused (single responsibility)
2. ✅ **Use meaningful variable** and function names
3. ✅ **Avoid code duplication** (DRY principle)
4. ✅ **Comment complex logic** but keep code self-documenting
5. ✅ **Refactor when needed** to improve code quality
6. ✅ **Use design patterns** appropriately
7. ✅ **Maintain consistent formatting** throughout the codebase

---

## What NOT To DO ❌

### Critical Don'ts
1. ❌ **NEVER commit secrets** (passwords, API keys, JWT secrets)
2. ❌ **NEVER disable security features** without understanding implications
3. ❌ **NEVER expose sensitive data** in logs or error messages
4. ❌ **NEVER trust client-side validation alone**
5. ❌ **NEVER store passwords in plain text**
6. ❌ **NEVER ignore security warnings**
7. ❌ **NEVER skip code reviews**

### Code Quality Don'ts
1. ❌ **DON'T use `System.out.println()`** - use proper logging
2. ❌ **DON'T use `printStackTrace()`** - use logger.error()
3. ❌ **DON'T swallow exceptions** silently
4. ❌ **DON'T hardcode configuration values**
5. ❌ **DON'T copy-paste code** - extract common functionality
6. ❌ **DON'T leave commented-out code**
7. ❌ **DON'T write God classes** - keep classes focused
8. ❌ **DON'T mix concerns** - separate business logic from presentation

### Testing Don'ts
1. ❌ **DON'T skip writing tests**
2. ❌ **DON'T commit failing tests**
3. ❌ **DON'T test implementation details**
4. ❌ **DON'T make tests depend on each other**
5. ❌ **DON'T use real external services** in tests - use mocks

### Git Don'ts
1. ❌ **DON'T commit to main branch directly**
2. ❌ **DON'T create huge commits** - keep them small and focused
3. ❌ **DON'T force push** to shared branches
4. ❌ **DON'T merge without review**
5. ❌ **DON'T commit generated files** (build artifacts, node_modules)

---

## Recommended Tools & Extensions

### IDE
- **IntelliJ IDEA** (Java development)
- **VS Code** (React/JavaScript development)

### IntelliJ IDEA Plugins
- Lombok
- SonarLint
- CheckStyle-IDEA
- Rainbow Brackets

### VS Code Extensions
- ESLint
- Prettier
- React Developer Tools
- GitLens

### Command Line Tools
- Maven Wrapper (`./mvnw`)
- npm/yarn
- Git
- Docker
- PostgreSQL client

---

## Resources

### Official Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

### Security Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

### Code Quality
- [Clean Code Principles](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## Getting Help

If you need help or have questions:

1. Check this document and the main README
2. Review the [CODE_QUALITY_REPORT.md](./CODE_QUALITY_REPORT.md)
3. Search existing GitHub Issues
4. Ask in project discussions
5. Create a new issue with detailed information

---

## Continuous Improvement

This document is a living guide. If you identify:
- Missing best practices
- Outdated recommendations
- Better approaches

Please submit a PR to update this document!

---

**Remember:** The goal is to write clean, secure, maintainable code that provides value to users. When in doubt, prioritize:
1. **Security** - Protect user data
2. **Reliability** - Code should work correctly
3. **Maintainability** - Code should be easy to understand and modify
4. **Performance** - Code should be reasonably efficient

Happy coding! 🚀
