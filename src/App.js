import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './home';
import WelcomePage from './welcome';
import CreateTask from './createTask';
import { ThemeProvider } from './Context/Theme';
import { TaskProvider } from './Context/taskContext';

const darkTheme = {
  // Add your dark theme styles
};

const lightTheme = {
  // Add your light theme styles
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage toggleTheme={toggleTheme} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/createTask" element={<CreateTask />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
