/*
  SettingsPage
  - Small settings surface (appearance) with a dark mode toggle.
  - Uses `useAppContext` for theme state and toggle helper.
*/
import { useAppContext } from '../context/AppContext';

const SettingsPage = () => {
  // Get theme state and toggle helper from AppContext
  const { darkMode, toggleDarkMode } = useAppContext();

  return (
    <div className={`settings-page ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="toggle-group">
          <label>Dark Mode</label>
          <button 
            onClick={toggleDarkMode}
            className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
            aria-label="Toggle dark mode"
          >
            <div className="toggle-switch"></div>
            <span className="toggle-state">
              {darkMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;