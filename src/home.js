import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './button';
import { useTasks } from './Context/taskContext';
import reminder from './assets/pinky.jpg';

const categories = ["All", "Work", "Personal", "Family", "Study"];

function Home() {
  const { tasks, setTasks } = useTasks();
  const [activeCategory, setActiveCategory] = useState("All");
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState({ name: "Guest", profilePicture: null });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || { name: "Guest", profilePicture: null };
    setUser(savedUser);
  }, []);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, [setTasks]);

  useEffect(() => {
    if (tasks.length === 0) {
      setProgress(0);
    } else {
      const completedTasks = tasks.filter(task => task.isCompleted);
      setProgress((completedTasks.length / tasks.length) * 100);
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = () => {
    navigate('/createTask');
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index); // Remove the task at the given index
    setTasks(updatedTasks);
  };

  const handleReminderNotification = useCallback((task) => {
    if (notificationsEnabled && Notification.permission === "granted") {
      new Notification(`Task Reminder`, {
        body: `Reminder: The task "${task.title}" is due soon!`,
        icon: reminder
      });
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    const timers = tasks.map(task => {
      const currentTime = new Date();
      const taskDeadline = new Date(task.deadline); 
      const timeUntilReminder = taskDeadline.getTime() - currentTime.getTime() - task.reminderTime;

      if (timeUntilReminder > 0) {
        return setTimeout(() => {
          handleReminderNotification(task);
        }, timeUntilReminder);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [tasks, handleReminderNotification]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-4`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Good Morning, {user.name}!</h1>
        {user.profilePicture && (
          <img src={user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full" />
        )}
        <button onClick={toggleDarkMode} className="ml-4">
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      <div className="flex space-x-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              activeCategory === category
                ? 'bg-pink-400 text-white'
                : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <img src={reminder} alt="Reminder" className="rounded-lg shadow-md mb-4 w-1/2 mx-auto" />
        <h2 className="text-lg">Task Progress: {Math.round(progress)}%</h2>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-pink-300 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <label className="mr-2">Enable Notifications</label>
        <input 
          type="checkbox" 
          checked={notificationsEnabled} 
          onChange={toggleNotifications} 
        />
      </div>

      <div className="max-h-60 overflow-y-auto mb-16"> {/* Ensure scrollability of tasks list */}
        {tasks.length === 0 ? (
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No tasks for today. Create one!</p>
        ) : (
          tasks
            .filter(task => activeCategory === "All" || task.category === activeCategory)
            .sort((a, b) => (a.deadline && b.deadline ? new Date(a.deadline) - new Date(b.deadline) : 0))
            .map((task, index) => (
              <div key={index} className={`p-4 rounded-lg mb-4 flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Due: {new Date(task.deadline).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleTaskCompletion(index)}
                    className="w-6 h-6 text-pink-200"
                  />
                  <button
                    onClick={() => handleDeleteTask(index)}
                    className="text-red-500 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full flex justify-around bg-gray-800 p-4 z-50"> {/* Add Task button fixed at bottom */}
        <Button label="+ Add Task" onClick={handleCreateTask} className="bg-pink-400 text-white rounded-full p-3" />
      </div>
    </div>
  );
}

export default Home;
