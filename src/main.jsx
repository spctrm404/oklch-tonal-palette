import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ThemeProvider from './context/ThemeContext.jsx';
import './_index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
