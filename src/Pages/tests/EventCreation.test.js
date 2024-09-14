import React from 'react';
import { render, screen, fireEvent, waitFor, userEvent } from '@testing-library/react';
import EventCreation from '../EventCreation/EventCreation';
import randomColor from '../EventCreation/EventCreation';

// Mock firebase and other dependencies
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('mockImageURL')),
}));

describe('EventCreation Component', () => {
  test('renders the EventCreation component', () => {
    render(<EventCreation />);
    expect(screen.getByPlaceholderText('Event Name')).toBeInTheDocument();
  });

  test('allows user to input event name', () => {
    render(<EventCreation />);
    const eventNameInput = screen.getByPlaceholderText('Event Name');
    fireEvent.change(eventNameInput, { target: { value: 'Sample Event' } });
    expect(eventNameInput.value).toBe('Sample Event');
  });

  test('allows user to input event description', () => {
    render(<EventCreation />);
    const eventDescriptionInput = screen.getByLabelText('Description');
    fireEvent.change(eventDescriptionInput, { target: { value: 'Sample Description' } });
    expect(eventDescriptionInput.value).toBe('Sample Description');
  });

  test('allows user to select a date', () => {
    render(<EventCreation />);
    const eventDateInput = screen.getByLabelText('Date');
    fireEvent.change(eventDateInput, { target: { value: '2023-09-15' } });
    expect(eventDateInput.value).toBe('2023-09-15');
  });

  test('allows user to select a time', () => {
    render(<EventCreation />);
    const eventTimeInput = screen.getByLabelText('Time');
    fireEvent.change(eventTimeInput, { target: { value: '14:30' } });
    expect(eventTimeInput.value).toBe('14:30');
  });

  test('opens tag selection popup', () => {
    render(<EventCreation />);
    const addButton = screen.getByText(/Add tag/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/Select Tags/i)).toBeInTheDocument();
  });

  test('opens location selection popup', () => {
    render(<EventCreation />);
    const locationButton = screen.getByText(/Available Venues/i);
    fireEvent.click(locationButton);
    expect(screen.getByText(/Available Venues/i)).toBeInTheDocument();
  });

  test('submits event form with correct data', async () => {
    render(<EventCreation />);
    fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Sample Event' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Sample Description' } });
    fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: 50 } });
    fireEvent.change(screen.getByLabelText('Capacity'), { target: { value: 100 } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-09-15' } });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '14:30' } });

    const createButton = screen.getByText('Create Event');
    fireEvent.click(createButton);

    // Add your assertions or mock API call checks here
  });
});

// Mock firebase and other dependencies
jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(() => Promise.resolve('mockImageURL')),
  }));

// Mock dependencies as before

describe('EventCreation Component - Additional Edge Cases', () => {
  
    test('handles multiple rapid submissions gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: 'success' }),
        })
      );
  
      render(<EventCreation />);
      fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Rapid Click Event' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Testing rapid clicks' } });
  
      const createButton = screen.getByText('Create Event');
      
      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(createButton);
      }
  
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
  
    test('form is reset after an error and retry', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 500,
          json: () => Promise.resolve({ error: 'Internal Server Error' }),
        })
      );
  
      render(<EventCreation />);
      fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Retry Event' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Testing form reset after error' } });
  
      const createButton = screen.getByText('Create Event');
      fireEvent.click(createButton);
  
      await waitFor(() => {
        expect(screen.getByText('Failed to create event, please try again later.')).toBeInTheDocument();
      });
  
      // Simulate retry after form reset
      fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Retry Event Again' } });
      fireEvent.click(createButton);
  
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  
    test('keyboard navigation and focus management', () => {
      render(<EventCreation />);
      
      // Test focus on event name input
      userEvent.tab();
      expect(screen.getByPlaceholderText('Event Name')).toHaveFocus();
      
      // Navigate to description input
      userEvent.tab();
      expect(screen.getByLabelText('Description')).toHaveFocus();
  
      // Navigate to ticket price input
      userEvent.tab();
      expect(screen.getByLabelText('Ticket Price')).toHaveFocus();
      
      // Navigate to capacity input
      userEvent.tab();
      expect(screen.getByLabelText('Capacity')).toHaveFocus();
      
      // Navigate to date input
      userEvent.tab();
      expect(screen.getByLabelText('Date')).toHaveFocus();
      
      // Navigate to time input
      userEvent.tab();
      expect(screen.getByLabelText('Time')).toHaveFocus();
  
      // Navigate to create event button
      userEvent.tab();
      expect(screen.getByText('Create Event')).toHaveFocus();
    });  
    test('screen reader accessibility', () => {
      render(<EventCreation />);
  
      const eventNameInput = screen.getByPlaceholderText('Event Name');
      const descriptionInput = screen.getByLabelText('Description');
      const ticketPriceInput = screen.getByLabelText('Ticket Price');
      const capacityInput = screen.getByLabelText('Capacity');
  
      expect(eventNameInput).toHaveAccessibleName('Event Name');
      expect(descriptionInput).toHaveAccessibleName('Description');
      expect(ticketPriceInput).toHaveAccessibleName('Ticket Price');
      expect(capacityInput).toHaveAccessibleName('Capacity');
    });
  
    test('responsive behavior on window resize', () => {
      render(<EventCreation />);
  
      const resizeWindow = (x, y) => {
        window.innerWidth = x;
        window.innerHeight = y;
        window.dispatchEvent(new Event('resize'));
      };
  
      // Test on a wide screen
      resizeWindow(1200, 800);
      expect(screen.getByText('Create Event')).toBeInTheDocument();
  
      // Test on a tablet screen
      resizeWindow(768, 1024);
      expect(screen.getByText('Create Event')).toBeInTheDocument();
  
      // Test on a mobile screen
      resizeWindow(375, 667);
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });
  
    test('handles partial data save gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ status: 'partial success' }),
        })
      );
  
      render(<EventCreation />);
      fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Partial Save Event' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Testing partial data save' } });
  
      const createButton = screen.getByText('Create Event');
      fireEvent.click(createButton);
  
      await waitFor(() => {
        expect(screen.getByText('Event saved with warnings')).toBeInTheDocument();
      });
    });
  
    test('handles simultaneous edits by multiple users', async () => {
      // Simulating a scenario where another user has already edited the event data
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 409,
          json: () => Promise.resolve({ error: 'Event data has been modified by another user' }),
        })
      );
  
      render(<EventCreation />);
      fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Simultaneous Edit Event' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Testing simultaneous edits' } });
  
      const createButton = screen.getByText('Create Event');
      fireEvent.click(createButton);
  
      await waitFor(() => {
        expect(screen.getByText('Event data has been modified by another user')).toBeInTheDocument();
      });
    });
  
  });


  test('validates form fields before submission', async () => {
    render(<EventCreation />);
    const createButton = screen.getByText('Create Event');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
    });
  });

  test('displays selected tags correctly', () => {
    render(<EventCreation />);
    const addTagButton = screen.getByText('Add tag');
    fireEvent.click(addTagButton);

    const tagOption = screen.getByText('Music');
    fireEvent.click(tagOption);

    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Music')).toHaveStyle(`background-color: ${randomColor('Music')}`);
  });

  test('allows removing selected tags', () => {
    render(<EventCreation />);
    const addTagButton = screen.getByText('Add tag');
    fireEvent.click(addTagButton);

    const tagOption = screen.getByText('Art');
    fireEvent.click(tagOption);

    const removeTagButton = screen.getByLabelText('Remove Art tag');
    fireEvent.click(removeTagButton);

    expect(screen.queryByText('Art')).not.toBeInTheDocument();
  });

  test('updates venue selection correctly', () => {
    render(<EventCreation />);
    const venueButton = screen.getByText('Available Venues');
    fireEvent.click(venueButton);

    const venueOption = screen.getByText('Central Park');
    fireEvent.click(venueOption);

    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.getByText('Change Venue')).toBeInTheDocument();
  });

  test('handles form submission with all fields filled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ status: 'success' }),
      })
    );

    render(<EventCreation />);
    fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Capacity'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '20:00' } });

    const createButton = screen.getByText('Create Event');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'POST',
        body: expect.any(String),
      }));
    });
  });

  test('displays error message on network failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(<EventCreation />);
    fireEvent.change(screen.getByPlaceholderText('Event Name'), { target: { value: 'Network Test Event' } });
    
    const createButton = screen.getByText('Create Event');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create event. Please try again.')).toBeInTheDocument();
    });
  });

  test('prevents submission with invalid date', async () => {
    render(<EventCreation />);
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2022-01-01' } });
    
    const createButton = screen.getByText('Create Event');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a future date')).toBeInTheDocument();
    });
  });

  test('handles large capacity values correctly', () => {
    render(<EventCreation />);
    fireEvent.change(screen.getByLabelText('Capacity'), { target: { value: '1000000' } });
    
    expect(screen.getByLabelText('Capacity')).toHaveValue(1000000);
  });

