import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

const useTask = () => {
  const context = useContext(TaskContext);
  
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }

  // Rename the functions to match what we're using in the TaskList component
  const { editTask: updateTask, removeTask: deleteTask, ...rest } = context;
  
  return {
    ...rest,
    updateTask,
    deleteTask
  };
};

export default useTask; 