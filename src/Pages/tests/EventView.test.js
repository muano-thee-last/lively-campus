import { render, screen } from '@testing-library/react';
import EventView from '../EventHistory/eventView';
import '@testing-library/jest-dom';

describe('EventView Component', () => {
  test('renders event details correctly', () => {
    const props = {
      eventName: "Music Festival",
      organizerName: "JohnDoe",
      eventDate: "2024-01-01T12:00:00Z",
      eventDescription: "A fun music festival",
      eventImageUrl: "https://example.com/image.jpg",
    };
    
    render(<EventView {...props} />);
    
    // Expect event name to be rendered
    expect(screen.getByRole('heading', { level: 2, name: /Music Festival/i })).toBeInTheDocument();
    
    // Expect organizer name to be rendered
    expect(screen.getByText(/JohnDoe/i)).toBeInTheDocument();
    
    // Match the full "Date: 01/01/2024" string using a regex
    //expect(screen.getByText(/Date: 01\/01\/2024/i)).toBeInTheDocument();

    // Expect event description to be rendered
    expect(screen.getByText(/A fun music festival/i)).toBeInTheDocument();

    // Expect the image to be rendered
    expect(screen.getByAltText(/Event Music Festival/i)).toBeInTheDocument();
  });

  test('does not render image if eventImageUrl is absent', () => {
    const props = {
      eventName: "Music Festival",
      organizerName: "JohnDoe",
      eventDate: "2024-01-01T12:00:00Z",
      eventDescription: "A fun music festival",
      eventImageUrl: null,
    };
    
    render(<EventView {...props} />);
    
    // Expect no image to be rendered
    expect(screen.queryByAltText(/Event Music Festival/i)).not.toBeInTheDocument();
  });

//   test('renders event date in the correct format', () => {
//     const props = {
//       eventName: "Conference",
//       organizerName: "Alice",
//       eventDate: "2024-05-10T09:00:00Z",
//       eventDescription: "Annual Conference",
//     };
  
//     render(<EventView {...props} />);
    
//     expect(screen.getByText(/05\/10\/2024/)).toBeInTheDocument();
//   });
  
});
