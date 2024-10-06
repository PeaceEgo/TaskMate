import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from './Context/taskContext';
import Button from './button';

// Utility function to generate a unique ID for each task
const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function CreateTask() {
  const navigate = useNavigate();
  const { setTasks } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Work');
  const [taskTime, setTaskTime] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [error, setError] = useState('');

  const handleCreateTask = () => {
    if (!taskTitle || !taskTime || !taskDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const taskDeadline = new Date(`${taskDate}T${taskTime}`);
    const now = new Date();
    if (taskDeadline <= now) {
      setError('Task deadline must be in the future.');
      return;
    }

    const reminderTimeInMs = reminderTime ? Math.max(0, Number(reminderTime) * 60 * 1000) : 0;

    // Create a new task object with a unique ID
    const newTask = {
      id: generateUniqueId(), // Unique ID for each task
      title: taskTitle,
      category: taskCategory,
      deadline: taskDeadline,
      reminderTime: reminderTimeInMs,
      isCompleted: false,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);

    // Reset form fields
    setTaskTitle('');
    setTaskCategory('Work');
    setTaskTime('');
    setTaskDate('');
    setReminderTime('');
    setError('');

    // Log current time when task is created
    console.log('Task created at:', getCurrentTime());

    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-6">Add Task</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="space-y-4">
        <li>
          <input
            type="text"
            placeholder="Add task name"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg p-2"
          />
        </li>

        <li className="flex space-x-2">
          {['Work', 'Personal', 'Family', 'Study'].map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${
                taskCategory === category
                  ? 'bg-pink-400 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
              onClick={() => setTaskCategory(category)}
            >
              {category}
            </button>
          ))}
        </li>

        <li>
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg p-2"
          />
        </li>

        <li>
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg p-2"
          />
        </li>

        <li>
          <input
            type="number"
            placeholder="Remind me (minutes before)"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg p-2"
          />
        </li>

        <li>
          <Button 
            onClick={handleCreateTask} 
            label="Create new task"
            className="w-full bg-pink-400 text-white py-3 rounded-lg text-lg"
          />
        </li>
      </ul>
    </div>
  );
}

export default CreateTask;
