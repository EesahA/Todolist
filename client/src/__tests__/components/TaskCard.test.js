import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../../components/TaskCard';

// Mock the date-fns format function
jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Mar 15'),
  isAfter: jest.fn(() => true)  // Changed to true to avoid "Overdue" text
}));

describe('TaskCard Component', () => {
  const mockTask = {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'In Progress',
    deadline: '2024-03-15',
    createdBy: {
      username: 'testuser'
    }
  };

  test('renders task title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('renders task description', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });

  test('renders deadline', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  test('renders creator avatar', () => {
    render(<TaskCard task={mockTask} />);
    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('alt', 'testuser');
    expect(avatar).toHaveAttribute('src', expect.stringContaining('testuser'));
  });
}); 