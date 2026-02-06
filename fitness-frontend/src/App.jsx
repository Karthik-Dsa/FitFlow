import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dock from './components/Dock';

import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear
} from 'react-icons/vsc';

function AppContent() {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const items = [
    {
      icon: <VscHome size={18} />,
      label: 'Home',
      action: 'home'
    },
    {
      icon: <VscArchive size={18} />,
      label: 'Archive',
      action: 'archive'
    },
    {
      icon: <VscAccount size={18} />,
      label: 'Profile',
      action: 'profile'
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: 'Settings',
      action: 'settings'
    }
  ];

  return (
    <div style={styles.app}>
      <Routes>
        <Route 
          path="/" 
          element={<Landing onSignUp={handleSignUp} />} 
        />
        <Route 
          path="/login" 
          element={
            <Login 
              onSuccess={handleAuthSuccess} 
              onSwitchToRegister={() => navigate('/register')}
            />
          } 
        />
        <Route 
          path="/register" 
          element={
            <Register 
              onSuccess={handleAuthSuccess} 
              onSwitchToLogin={() => navigate('/login')}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Dock */}
      <div style={styles.dockWrapper}>
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#000',
    position: 'relative',
    paddingBottom: '80px',
  },

  dockWrapper: {
    position: 'absolute',
    bottom: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  }
};

export default App;
