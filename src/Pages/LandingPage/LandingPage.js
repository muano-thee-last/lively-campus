import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import logo from '../../asserts/logo.png';
import upcomingEventsImg from '../../asserts/beer-garden.jpg';
import upcomingEventsImg2 from '../../asserts/festival.jpeg'
import upcomingEventsImg3 from '../../asserts/parade.jpeg'
import previousEventsImg2 from '../../asserts/img.jpg'
import previousEventImg from '../../asserts/previous-event.webp';
import Login from '../Login/login';
import Footer from '../dashboard/footer'

// Main component for the Landing Page
function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentUpcomingIndex, setCurrentUpcomingIndex] = useState(0);
  const [currentPreviousIndex, setCurrentPreviousIndex] = useState(0);

  const upcomingImages = [upcomingEventsImg, upcomingEventsImg2, upcomingEventsImg3];
  const previousImages = [previousEventImg, previousEventsImg2];
  const previousTitles = ["Wits Concert", "Wits Annual Parade"];

  useEffect(() => {
    const upcomingInterval = setInterval(() => {
      setCurrentUpcomingIndex((prevIndex) => (prevIndex + 1) % upcomingImages.length);
    }, 3000);

    const previousInterval = setInterval(() => {
      setCurrentPreviousIndex((prevIndex) => (prevIndex + 1) % previousImages.length);
    }, 3000);

    return () => {
      clearInterval(upcomingInterval);
      clearInterval(previousInterval);
    };
  }, [upcomingImages.length, previousImages.length]);

  const handleButtonClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleUpcomingDotClick = (index) => setCurrentUpcomingIndex(index);
  const handlePreviousDotClick = (index) => setCurrentPreviousIndex(index);

  return (
    <div className="LandingPage">
      <div className="card1">
        <div className={`background-blur ${showLogin ? 'active' : ''}`}></div>
        <Header handleButtonClick={handleButtonClick} />
        <HeroSection />
      </div>

      <EventsSection
        title="Upcoming Events"
        images={upcomingImages}
        currentIndex={currentUpcomingIndex}
        handleDotClick={handleUpcomingDotClick}
        showBookNow
      />

      <EventsSection
        title="Previous Events"
        images={previousImages}
        currentIndex={currentPreviousIndex}
        handleDotClick={handlePreviousDotClick}
        titles={previousTitles}
      />

      <Footer />

      {showLogin && <LoginModal handleCloseLogin={handleCloseLogin} />}
   
    </div>
  );
}

// Header component containing logo and navigation
function Header({ handleButtonClick }) {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="LivelyCampus Logo" className="logo-image" />
        <div className="logo-text">LivelyCampus</div>
      </div>
      <nav>
        <ul>
          <li><a href="#ticket">Ticket</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#about">About Us</a></li>
          <li><button className="btn-secondary" onClick={handleButtonClick}>Login</button></li>
        </ul>
      </nav>
    </header>
  );
}

// Hero section component with main call-to-action
function HeroSection() {
  return (
    <div className="hero-card">
      <section className="hero">
        <h4>BEER GARDEN SHOW TICKET PACKAGE</h4>
        <p>
          Look no further! Our BEER GARDEN SHOW tickets are the simplest way to experience different artists performing live.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Get Ticket</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </section>
    </div>
  );
}

// Events section component for displaying upcoming or previous events
function EventsSection({ title, images, currentIndex, handleDotClick, showBookNow, titles }) {
  return (
    <section className="events-section">
      <h3>{title}</h3>
      <div
        className="card"
        style={{
          backgroundImage: `url(${images[currentIndex]})`
        }}
      >
        <div className="event-content">
          {showBookNow ? (
            <button className="btn-primary">Book Now</button>
          ) : (
            <h2>{titles[currentIndex]}</h2>
          )}
        </div>
        <div className="dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer component with logo, links, and newsletter signup


// Footer section component for rendering a list of items


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
