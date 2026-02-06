import { useState } from 'react';
import { authService } from '../services/authService';
import StarBorder from './StarBorder';

function Register({ onSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (username.length < 5 || username.length > 25) {
      setError('Username must be between 5 and 25 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.register(username, email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Start your fitness journey today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username (5-25 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={{ marginTop: '32px' }}>
            <StarBorder
              as="button"
              type="submit"
              color="white"
              speed="4s"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </StarBorder>
          </div>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <span
            onClick={onSwitchToLogin}
            style={styles.switchLink}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '440px',
    padding: '20px',
  },

  formCard: {
    background: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '40px',
    backdropFilter: 'blur(10px)',
  },

  title: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '8px',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '32px',
    textAlign: 'center',
  },

  form: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: '20px',
  },

  input: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },

  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    marginTop: '12px',
    textAlign: 'center',
  },

  switchText: {
    marginTop: '24px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.95rem',
  },

  switchLink: {
    color: '#ffffff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 500,
  },
};

export default Register;
