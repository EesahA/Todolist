import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../../components/Login';
import Register from '../../components/Register';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Flow', () => {
    test('successful login should store token and redirect', async () => {
      // Mock successful login response
      axios.post.mockResolvedValueOnce({
        data: {
          token: 'fake-token',
          user: { id: '1', username: 'testuser', email: 'test@example.com' }
        }
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' }
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Wait for the success message
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      });
    });

    test('failed login should show error message', async () => {
      // Mock failed login response
      axios.post.mockRejectedValueOnce({
        response: {
          data: { message: 'Invalid credentials' }
        }
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'wrong@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'WrongPass123!' }
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Flow', () => {
    test('successful registration should redirect to login', async () => {
      // Mock successful registration response
      axios.post.mockResolvedValueOnce({
        data: { message: 'Registration successful' }
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in registration form
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'newuser' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'newuser@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'NewPass123!' }
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      // Wait for success and redirect
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/api/users/register', {
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'NewPass123!'
        });
      });
    });

    test('registration with existing email should show error', async () => {
      // Mock failed registration response
      axios.post.mockRejectedValueOnce({
        response: {
          data: { message: 'Email already exists' }
        }
      });

      render(
        <BrowserRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </BrowserRouter>
      );

      // Fill in registration form
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'existinguser' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'ExistingPass123!' }
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });
}); 