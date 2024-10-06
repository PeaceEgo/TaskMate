import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './home';
import WelcomePage from './welcome';
import CreateTask from './createTask';
import { ThemeProvider } from './Context/Theme';
import { TaskProvider } from './Context/taskContext'; // Ensure you import TaskProvider

const darkTheme = {
  
};

const lightTheme = {
 
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
