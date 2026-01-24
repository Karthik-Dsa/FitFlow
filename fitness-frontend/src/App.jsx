import StarBorder from './components/StarBorder';
import Dock from './components/Dock';

import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear
} from 'react-icons/vsc';

function App() {

  const items = [
    {
      icon: <VscHome size={18} />,
      label: 'Home',
      onClick: () => alert('Home!')
    },
    {
      icon: <VscArchive size={18} />,
      label: 'Archive',
      onClick: () => alert('Archive!')
    },
    {
      icon: <VscAccount size={18} />,
      label: 'Profile',
      onClick: () => alert('Profile!')
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: 'Settings',
      onClick: () => alert('Settings!')
    }
  ];

  return (
    <div style={styles.app}>

      {/* Quote + Button */}
      <div style={styles.quoteContainer}>
        <h1 style={styles.quote}>
          Your journey to fitness starts here.
        </h1>

        {/* Star Border Button ONLY */}
        <div style={{ marginTop: '28px' }}>
          <StarBorder
            as="button"
            color="white"
            speed="4s"
            onClick={() => alert('Get Started')}
          >
            Get Started
          </StarBorder>
        </div>
      </div>

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

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#000',
    position: 'relative',
    paddingBottom: '80px',
  },

  quoteContainer: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    textAlign: 'center',
    transform: 'translateY(-50%)',
  },

  quote: {
    fontSize: '2.5rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: '#ffffff',
    opacity: 0.6,
    textShadow: `
      0 0 10px rgba(255,255,255,0.25),
      0 0 30px rgba(255,255,255,0.15)
    `,
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
