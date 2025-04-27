// theme.jsx
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Create context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
  updateThemeColors: () => {},
});

// Default theme colors
const defaultThemeColors = {
  light: {
    background: {
      default: '#ffffff',
      default2: '#f4faff',
      paper: '#ffffff'
    },
    primary: {
      main: '#7cc3f5'
    },
    divider: '#7cc3f5',
    border: '#c9c9c9'
  },
  dark: {
    background: {
      default: '#242424',
      default2: '#333333',
      paper: '#4d93c4'
    },
    primary: {
      main: '#4d93c4'
    },
    divider: '#4d93c4',
    border: '#626262'
  }
};

export function ThemeContextProvider({ children }) {
  // State to hold the current theme mode
  const [mode, setMode] = useState('light');
  
  // State to hold customizable colors
  const [themeColors, setThemeColors] = useState(defaultThemeColors);

  // Load saved theme preference and colors from localStorage on initial render
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
    
    const savedColors = localStorage.getItem('themeColors');
    if (savedColors) {
      try {
        setThemeColors(JSON.parse(savedColors));
      } catch (e) {
        console.error('Error parsing saved theme colors:', e);
        // Fall back to defaults if parsing fails
        setThemeColors(defaultThemeColors);
      }
    }
  }, []);

  // Function to update theme colors
  const updateThemeColors = (mode, colorType, value) => {
    setThemeColors(prev => {
      // Create a deep copy of the previous state
      const newColors = JSON.parse(JSON.stringify(prev));
      
      // Update the specific color value
      // colorType can be 'background.default', 'background.paper', 'primary.main', 'divider'
      if (colorType === 'background.default') {
        newColors[mode].background.default = value;
      } else if (colorType === 'background.paper') {
        newColors[mode].background.paper = value;
      } else if (colorType === 'primary.main') {
        newColors[mode].primary.main = value;
      } else if (colorType === 'divider') {
        newColors[mode].divider = value;
      }
      
      // Save to localStorage
      localStorage.setItem('themeColors', JSON.stringify(newColors));
      
      return newColors;
    });
  };

  // Theme toggle function
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          // Save to localStorage
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
      updateThemeColors,
      themeColors,
    }),
    [mode, themeColors]
  );

  // Create theme based on current mode and colors
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...themeColors[mode],
        },
        typography: {
            fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
        },
      }),
    [mode, themeColors]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Custom hook to use the color mode context
export function useColorMode() {
  return React.useContext(ColorModeContext);
}

// Custom hook to get standardized box props
export function useCustomBoxProps() {
  return { className: 'customBox' };
}