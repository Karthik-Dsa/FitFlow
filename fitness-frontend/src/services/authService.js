const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const authService = {
  async register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Response body is not JSON, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        username: data.username,
        email: data.email,
      }));
    }
    return data;
  },

  async login(emailOrUsername, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Response body is not JSON, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        username: data.username,
        email: data.email,
      }));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      // Malformed data in localStorage, clear it
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
