import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './button';
import { useTasks } from './Context/taskContext';
import reminder from './assets/pinky.jpg';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const categories = ["All", "Work", "Personal", "Family", "Study"];

function Home() {
  const { tasks, setTasks } = useTasks();
  const [activeCategory, setActiveCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState({ name: "Guest", profilePicture: null });
  const navigate = useNavigate();

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyAOfyHju6XWLadh2nBBj5RW8kiUaav_hD4",
    authDomain: "taskmate-9e5e5.firebaseapp.com",
    projectId: "taskmate-9e5e5",
    storageBucket: "taskmate-9e5e5.appspot.com",
    messagingSenderId: "12561191437",
    appId: "1:12561191437:web:0811d37ded223489213b44",
    measurementId: "G-T5PQCCC954"
  };

  const messaging = getMessaging(initializeApp(firebaseConfig)); // Initialize messaging

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: 'BDlf29cjROeVA6YrT1-Me0XfXjYdBbyewBLOjLfVEzf5fAMFNwF6LKNeoUX3yPKuaA9fdkWgfeGckswljzf0cek' });
          if (token) {
            console.log('FCM token retrieved:', token);
            localStorage.setItem('fcmToken', token);
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.error('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error retrieving notification token:', error);
      }
    };

    requestNotificationPermission();

    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      const { title, body } = payload.notification;
      new Notification(title, { body });
    });
  }, [messaging]); // Messaging as a dependency, optional

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || { name: "Guest", profilePicture: null };
    setUser(savedUser);
  }, []);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, [setTasks]);

  const handleCreateTask = () => {
    navigate('/createTask');
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleSubtaskCompletion = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === taskIndex) {
        const updatedSubtasks = task.subtasks.map((subtask, j) =>
          j === subtaskIndex ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const calculateProgress = (subtasks) => {
    if (subtasks.length === 0) return 0;
    const completedSubtasks = subtasks.filter(subtask => subtask.isCompleted).length;
    return (completedSubtasks / subtasks.length) * 100;
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

      <div className="flex items-center mb-4">
        <label className="mr-2">Enable Notifications</label>
        <input 
          type="checkbox" 
          checked={notificationsEnabled} 
          onChange={toggleNotifications} 
        />
         
      </div>
     <div> <img src={reminder} alt="Reminder Icon" className="w-full  mr-2" /></div>
      <div className="max-h-60 overflow-y-auto mb-16">
        <h1 className='text-center  text-lg font-bold bg-gray-100'>My Tasks</h1>
        {tasks.length === 0 ? (
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No tasks for today. Create one!</p>
        ) : (
          tasks
            .filter(task => activeCategory === "All" || task.category === activeCategory)
            .sort((a, b) => (a.deadline && b.deadline ? new Date(a.deadline) - new Date(b.deadline) : 0))
            .map((task, index) => {
              return (
                <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <h2 className={`text-lg font-bold ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</h2>
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleTaskCompletion(index)}
                    />
                  </div>

                  <p className={`text-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress: {calculateProgress(task.subtasks)}%</p>
                  <div className="mt-2">
                    {task.subtasks.length === 0 ? (
                      <p>No subtasks.</p>
                    ) : (
                      task.subtasks.map((subtask, subtaskIndex) => (
                        <div key={subtaskIndex} className="flex justify-between items-center">
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{subtask.title}</p>
                          <input
                            type="checkbox"
                            checked={subtask.isCompleted}
                            onChange={() => handleSubtaskCompletion(index, subtaskIndex)}
                          />
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() => handleDeleteTask(index)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>

      <div className="fixed bottom-4  inset-x-3 flex justify-center">
      <Button 
            onClick={handleCreateTask} 
            label="Create new task"
            className="w-full bg-pink-400 text-white py-3 rounded-lg text-lg"
          />
      </div>
    </div>
  );
}

export default Home;
