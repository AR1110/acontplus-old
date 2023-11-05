import React, { ReactNode, createContext, useContext, useState } from 'react';

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: {children: ReactNode}) => {
  const [darkMode, setDarkMode] = useState(false); // Initial mode is dark

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const contextValue: DarkModeContextType = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};
