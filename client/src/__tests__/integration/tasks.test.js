import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import TaskList from '../../components/TaskList';
import CreateTask from '../../components/CreateTask';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Task Management Flow', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Existing Task',
      description: 'This is an existing task',
      status: 'To Do',
      deadline: '2024-03-20',
      createdBy: { username: 'testuser' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Task Creation and Listing', () => {
    test('should create a new task and show it in the list', async () => {
      // Mock GET tasks response
      axios.get.mockResolvedValueOnce({ data: mockTasks });

      // Mock POST new task response
      const newTask = {
        _id: '2',
        title: 'New Task',
        description: 'This is a new task',
        status: 'To Do',
        deadline: '2024-03-25',
        createdBy: { username: 'testuser' }
      };
      axios.post.mockResolvedValueOnce({ data: newTask });

      render(
        <BrowserRouter>
          <AuthProvider>
            <CreateTask />
            <TaskList />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for existing tasks to load
      await waitFor(() => {
        expect(screen.getByText('Existing Task')).toBeInTheDocument();
      });

      // Fill in new task form
      fireEvent.change(screen.getByLabelText(/task title/i), {
        target: { value: 'New Task' }
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'This is a new task' }
      });
      fireEvent.change(screen.getByLabelText(/deadline/i), {
        target: { value: '2024-03-25' }
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /create task/i }));

      // Wait for new task to appear
      await waitFor(() => {
        expect(screen.getByText('New Task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Status Update', () => {
    test('should update task status', async () => {
      // Mock GET tasks response
      axios.get.mockResolvedValueOnce({ data: mockTasks });

      // Mock PUT task update response
      axios.put.mockResolvedValueOnce({
        data: {
          ...mockTasks[0],
          status: 'In Progress'
        }
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TaskList />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for tasks to load
      await waitFor(() => {
        expect(screen.getByText('Existing Task')).toBeInTheDocument();
      });

      // Find and click the status update button/dropdown
      const statusButton = screen.getByRole('button', { name: /to do/i });
      fireEvent.click(statusButton);

      // Select new status
      const inProgressOption = screen.getByText(/in progress/i);
      fireEvent.click(inProgressOption);

      // Verify status update request
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          '/api/tasks/1',
          expect.objectContaining({ status: 'In Progress' })
        );
      });
    });
  });

  describe('Task Deletion', () => {
    test('should delete a task', async () => {
      // Mock GET tasks response
      axios.get.mockResolvedValueOnce({ data: mockTasks });

      // Mock DELETE task response
      axios.delete.mockResolvedValueOnce({ data: { message: 'Task deleted' } });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TaskList />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for tasks to load
      await waitFor(() => {
        expect(screen.getByText('Existing Task')).toBeInTheDocument();
      });

      // Find and click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      // Verify deletion request
      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/api/tasks/1');
      });

      // Verify task is removed from display
      await waitFor(() => {
        expect(screen.queryByText('Existing Task')).not.toBeInTheDocument();
      });
    });
  });
}); 