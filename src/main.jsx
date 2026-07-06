import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './vendor/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';

/**
 * Mantine theme configuration shared by every component in the React tree.
 *
 * @type {import('@mantine/core').MantineThemeOverride}
 */
const theme = createTheme({
  primaryColor: 'cyan',
  defaultRadius: 'sm',
  fontFamily: 'Inter, Arial, Helvetica, sans-serif'
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
