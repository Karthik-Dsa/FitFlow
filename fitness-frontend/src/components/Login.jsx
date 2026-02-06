import { useState } from 'react';
import { authService } from '../services/authService';
import StarBorder from './StarBorder';

function Login({ onSuccess, onSwitchToRegister }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(emailOrUsername, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to continue your fitness journey</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing in...' : 'Sign In'}
            </StarBorder>
          </div>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span
            onClick={onSwitchToRegister}
            style={styles.switchLink}
          >
            Sign Up
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

export default Login;
