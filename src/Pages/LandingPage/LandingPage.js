import React, { useRef, useState, useEffect } from 'react';
import './LandingPage.css';
import logo from '../../asserts/logo.png';
import Login from '../Login/login';
import Footer from '../dashboard/footer';

// Main component for the Landing Page
function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentUpcomingIndex, setCurrentUpcomingIndex] = useState(0);
  const [currentPreviousIndex, setCurrentPreviousIndex] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date(); // Move the `today` variable inside useEffect
      try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
        const data = await response.json();

        // Filter upcoming and previous events
        const upcoming = data.filter(event => new Date(event.date) > today);
        const previous = data.filter(event => new Date(event.date) < today);

        setUpcomingEvents(upcoming);
        setPreviousEvents(previous);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Remove `today` from the dependency array

  useEffect(() => {
    const upcomingInterval = setInterval(() => {
      setCurrentUpcomingIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
    }, 6500);

    const previousInterval = setInterval(() => {
      setCurrentPreviousIndex((prevIndex) => (prevIndex + 1) % previousEvents.length);
    }, 6500);

    return () => {
      clearInterval(upcomingInterval);
      clearInterval(previousInterval);
    };
  }, [upcomingEvents.length, previousEvents.length]);

  const handleButtonClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleUpcomingDotClick = (index) => setCurrentUpcomingIndex(index);
  const handlePreviousDotClick = (index) => setCurrentPreviousIndex(index);

  return (
    <div className="LandingPage">
      <div className="header-card">
        <Header handleButtonClick={handleButtonClick} />
        <HeroSection />
      </div>

      <EventsSection
        title="Upcoming Events"
        events={upcomingEvents}
        currentIndex={currentUpcomingIndex}
        handleDotClick={handleUpcomingDotClick}
        showBookNow
        handleButtonClick={handleButtonClick}
      />

      <EventsSection
        title="Previous Events"
        events={previousEvents}
        currentIndex={currentPreviousIndex}
        handleDotClick={handlePreviousDotClick}
      />

      <Footer />

      {showLogin && <LoginModal handleCloseLogin={handleCloseLogin} />}
    </div>
  );
}

// Header component containing logo and navigation
function Header({ handleButtonClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };
  return (
    <header className="landing-page-header">
      <div className="logo-container">
        <img src={logo} alt="LivelyCampus Logo" className="logo-image" />
        <div className="logo-text">LivelyCampus</div>
      </div>
      <nav className={`landing-page-nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#ticket">Ticket</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#about">About Us</a></li>
          <li><button className="btn-secondary" onClick={handleButtonClick}>Login</button></li>
        </ul>
      </nav>
      <label className="burger" htmlFor="burger" >
        <input type="checkbox" id="burger" onClick={toggleMenu} />
        <span></span>
        <span></span>
        <span></span>
      </label>
    </header>
  );
}

// Hero section component with main call-to-action
function HeroSection() {
  return (
    <div className="hero-card">
      <section className="hero">
        <h1>Ignite Your Campus</h1>
        <h1>Experience!</h1>
        <p>
          Connecting you with the best campus events and activities. Discover, engage, and celebrate!
        </p>
        <div className="hero-buttons">
          <button className="btn-secondary">Learn More</button>
        </div>
      </section>
    </div>
  );
}

// Events section component for displaying upcoming or previous events
function EventsSection({ title, events, currentIndex, handleDotClick, showBookNow, handleButtonClick }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionElement.classList.add('visible');
          observer.unobserve(sectionElement);
        }
      },
      { threshold: 0.01 }
    );

    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  const currentEvent = events[currentIndex];

  return (
    <section ref={sectionRef} className="landing-page-events-section">
      <h1>{title}</h1>
      
      {currentEvent ? (
        <div
          className="card"
          style={{
            backgroundImage: `url(${currentEvent.imageUrl})`,
          }}
        >
          <div className="event-content">
            <div className='event-card-description'>
              <h2>{currentEvent.title}</h2>
              <p>{currentEvent.description}</p>
            </div>
            {showBookNow ? (
              <button className="btn-primary" onClick={handleButtonClick}>Get Ticket</button>
            ) : (
              <h2>{currentEvent.title}</h2>
            )}
          </div>
          <div className="dots">
            {events.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No events available</p>
      )}
    </section>
  );
}

// Login modal component for displaying the login form
function LoginModal({ handleCloseLogin }) {
  return (
    <div className="login-modal">
      <button className="close-button" onClick={handleCloseLogin}>X</button>
      <Login />
    </div>
  );
}

export default LandingPage;
