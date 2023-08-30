import React from 'react';
import { Button, IconButton } from '@mui/material';
 
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDarkMode } from '@/context/DarkModeContext';

const ModeToggleButton: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <IconButton onClick={toggleDarkMode} color="inherit">
    {darkMode ? <Brightness7 /> : <Brightness4 />}
  </IconButton>
  );
};

export default ModeToggleButton;
