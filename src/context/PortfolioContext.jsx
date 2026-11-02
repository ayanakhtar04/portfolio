import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [state, setState] = useState({
    name: "Ayan Akhtar",
    email: "ayanakhtar37.35@gmail.com",
    github: "https://github.com/ayanakhtar04",
    linkedin: "https://www.linkedin.com/in/ayan-akhtar",
    resume: `${import.meta.env.BASE_URL}Ayan_Akhtar_Resume.pdf`,
    theme: "dark",
    accent: "cyan",
    skillsView: "iac",
    skillFilter: "all",
    activeStage: "learn",
    activePhaseTab: "phase1",
    activeView: "portfolio",
  });

  // Only display preferences are remembered between visits, and only known
  // values are accepted. Identity (name, email, links, resume) always comes
  // from the code above, so an old or tampered save can't show stale details
  // or turn a link into something else. Storage can be blocked or corrupt;
  // the site then simply starts with the defaults.
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('portfolioState') || '{}');
      const prefs = {};
      if (parsed.theme === 'dark' || parsed.theme === 'light') prefs.theme = parsed.theme;
      if (parsed.accent === 'cyan' || parsed.accent === 'green') prefs.accent = parsed.accent;
      setState(prev => ({ ...prev, ...prefs }));
    } catch { /* unreadable or blocked storage: keep the defaults */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('portfolioState', JSON.stringify({ theme: state.theme, accent: state.accent }));
    } catch { /* storage blocked: preferences just won't persist */ }
  }, [state.theme, state.accent]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const toggleAccent = () => {
    setState(prev => ({
      ...prev,
      accent: prev.accent === 'cyan' ? 'green' : 'cyan'
    }));
  };

  return (
    <PortfolioContext.Provider value={{ state, updateState, toggleTheme, toggleAccent }}>
      {children}
    </PortfolioContext.Provider>
  );
};
