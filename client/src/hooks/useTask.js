import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

const useTask = () => {
  const context = useContext(TaskContext);
  
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  
  return context;
};

export default useTask; 