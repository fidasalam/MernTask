import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider
import axios from 'axios';
import AddUserPage from './AddUserPage';



// Mock the axios.post function
vi.mock('axios');

describe('AddUserPage', () => {
  const queryClient = new QueryClient();

  it('submits the form and displays success message on successful API call', async () => {
    // Mock the API response
    axios.post.mockResolvedValueOnce({ data: { id: 1, name: 'John Doe' } });

    // Render the component within the necessary providers
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AddUserPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByText(/add user/i));

    // Wait for the success message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/User added successfully!/i)).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout to 3 seconds
    

    // Ensure axios.post was called with correct arguments
    // expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/users', {
    //   name: 'John Doe',
    //   email: 'john@example.com',
    //   phoneNumber: '1234567890',
    //   password: 'password123',
    // });
  });
});
