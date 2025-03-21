import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addCommentToTask,
  getTaskById as getTaskByIdApi
} from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState('team');

  // Fetch all tasks
  const fetchTasks = useCallback(async (mode = viewMode) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTasks(mode);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      setLoading(false);
    }
  }, [isAuthenticated, viewMode]);

  // Update view mode
  const updateViewMode = useCallback((mode) => {
    setViewMode(mode);
    fetchTasks(mode);
  }, [fetchTasks]);

  // Get task by ID
  const getTaskById = async (id) => {
    try {
      setError(null);
      return await getTaskByIdApi(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task');
      throw err;
    }
  };

  // Initial fetch of tasks
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(viewMode);
    }
  }, [isAuthenticated, fetchTasks, viewMode]);

  // Add a new task
  const addTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createTask(taskData);
      await fetchTasks(viewMode); // Refresh the list with current view mode
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      setLoading(false);
      throw err;
    }
  };

  // Update an existing task
  const editTask = async (id, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateTask(id, taskData);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      setLoading(false);
      throw err;
    }
  };

  // Change task status
  const changeTaskStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateTaskStatus(id, status);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      setLoading(false);
      throw err;
    }
  };

  // Delete a task
  const removeTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      setLoading(false);
      throw err;
    }
  };

  // Add a comment to a task
  const addComment = async (id, content) => {
    try {
      setLoading(true);
      setError(null);
      const response = await addCommentToTask(id, content);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
      setLoading(false);
      throw err;
    }
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
        changeTaskStatus,
        addComment,
        getTasksByStatus,
        getTaskById,
        viewMode,
        updateViewMode
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider; 