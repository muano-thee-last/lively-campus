import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About/About';
import Footer from '../dashboard/footer';

// Mocking Footer component
jest.mock('../dashboard/footer', () => () => <div>Mocked Footer</div>);

// Mock IntersectionObserver behavior
beforeEach(() => {
  global.IntersectionObserver = jest.fn(function (callback) {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
    this.triggerIntersect = (isIntersecting) => {
      callback([{ isIntersecting }]);
    };
  });
});

describe('About Component', () => {
  test('initial states are set correctly', () => {
    render(<About />);
    const navMenu = screen.getByRole('navigation');
    expect(navMenu).not.toHaveClass('open');

    const sectionElement = screen.getByTestId('about-section');
    expect(sectionElement).not.toHaveClass('visible');
  });

  test('renders all elements correctly', () => {
    render(<About />);
    // Logo and header elements
    expect(screen.getByTestId('logo-image')).toBeInTheDocument();
    expect(screen.getByTestId('logo-text')).toHaveTextContent('LivelyCampus');
    
    // Navigation bar elements
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Ticket')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();

    // Hero section elements
    expect(screen.getByTestId('hero-title')).toBeInTheDocument();
    expect(screen.getByTestId('hero-description')).toHaveTextContent(/Connecting students with exciting campus events/i);
    
    // Other section elements
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });

  test('renders logo image with correct attributes', () => {
    render(<About />);
    const logoImage = screen.getByTestId('logo-image');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', expect.any(String)); // Ensure logo has a source
    expect(logoImage).toHaveAttribute('alt', 'LivelyCampus Logo');
  });

  test('renders Contact Us section with correct email', () => {
    render(<About />);
    const emailLink = screen.getByText('support@witslivelycampus.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:livelycampus@gmail.com');
  });

  test('renders hero section correctly', () => {
    render(<About />);
    const heroTitle = screen.getByTestId('hero-title');
    const heroDescription = screen.getByTestId('hero-description');
  
    expect(heroTitle).toBeInTheDocument();
    expect(heroTitle).toHaveTextContent('About LivelyCampus');
    expect(heroDescription).toHaveTextContent('Connecting students with exciting campus events.');
  });
  
  test('toggles the menu when burger button is clicked', () => {
    render(<About />);
    const burgerButton = screen.getByLabelText('burger');
    const navMenu = screen.getByRole('navigation');
    
    // Initial state: Menu is closed
    expect(navMenu).not.toHaveClass('open');

    // First click: Menu should open
    fireEvent.click(burgerButton);
    expect(navMenu).toHaveClass('open');

    // Second click: Menu should close
    fireEvent.click(burgerButton);
    expect(navMenu).not.toHaveClass('open');
  });

  test('navigation links are present and clickable', () => {
    render(<About />);
    const homeLink = screen.getByText('Home');
    const ticketLink = screen.getByText('Ticket');
    const contactLink = screen.getByText('Contact');
    const aboutUsLink = screen.getByText('About Us');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(ticketLink).toHaveAttribute('href', '#ticket');
    expect(contactLink).toHaveAttribute('href', '#contact');
    expect(aboutUsLink).toHaveAttribute('href', '/about');
  });

  test('sectionRef correctly references the section element', () => {
    render(<About />);
    const sectionElement = screen.getByTestId('about-section');
    expect(sectionElement).toBeInTheDocument();
  });

  describe('IntersectionObserver useEffect', () => {
    test('creates an IntersectionObserver and observes the section', () => {
      render(<About />);
      expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);

      const observerInstance = IntersectionObserver.mock.instances[0];
      expect(observerInstance.observe).toHaveBeenCalledTimes(1);
      const sectionElement = screen.getByTestId('about-section');
      expect(observerInstance.observe).toHaveBeenCalledWith(sectionElement);
    });

    test('section becomes visible when it intersects the viewport', () => {
      render(<About />);
      const sectionElement = screen.getByTestId('about-section');
      expect(sectionElement).not.toHaveClass('visible');

      const observerInstance = IntersectionObserver.mock.instances[0];
      observerInstance.triggerIntersect(true);

      // Check visibility after triggering intersection
      setTimeout(() => {
        expect(sectionElement).toHaveClass('visible');
      }, 0);
    });

    test('cleans up IntersectionObserver on component unmount', () => {
      const { unmount } = render(<About />);
      const observerInstance = IntersectionObserver.mock.instances[0];
      const sectionElement = screen.getByTestId('about-section');

      unmount();
      expect(observerInstance.unobserve).toHaveBeenCalledWith(sectionElement);
    });
  });
});
