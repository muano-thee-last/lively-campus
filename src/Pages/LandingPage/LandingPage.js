import React, { useRef,useState, useEffect } from 'react';
import './LandingPage.css';
import logo from '../../asserts/logo.png';
import upcomingEventsImg from '../../asserts/pater.jpeg';
import upcomingEventsImg2 from '../../asserts/gospel.jpg'
import upcomingEventsImg3 from '../../asserts/centenary-wits-landscape-scaled.jpg'
import previousEventsImg2 from '../../asserts/couple.jpg'
import previousEventImg from '../../asserts/previous-event.webp';
import Login from '../Login/login';
import Footer from '../dashboard/footer'
import { FaBars } from 'react-icons/fa';

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
    }, 6500);

    const previousInterval = setInterval(() => {
      setCurrentPreviousIndex((prevIndex) => (prevIndex + 1) % previousImages.length);
    }, 6500);

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
      <div className="header-card">
        <div className={`background-blur ${showLogin ? 'active' : ''}`}></div>
        <div className='image-blur'></div>
        <Header handleButtonClick={handleButtonClick} />
        <HeroSection />
      </div>

      <EventsSection
        title="Upcoming Events"
        images={upcomingImages}
        handleButtonClick={handleButtonClick}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the hamburger menu
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
      {/* Hamburger Icon using react-icons */}
      <FaBars className="hamburger-icon" onClick={toggleMenu} />
      {/* Navigation items - displayed conditionally based on screen size */}
   
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
function EventsSection({ title, images, currentIndex, handleDotClick, showBookNow, titles,handleButtonClick }) {
  const sectionRef = useRef(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add the visible class to trigger the animation
          sectionRef.current.classList.add('visible');
          // Stop observing after the animation has been triggered once
          observer.unobserve(sectionRef.current);
        }
      },
      {
        threshold: 0.1, // Adjust this if necessary
      }
    );
  
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="landing-page-events-section">
      <h1>{title}</h1>
      
      <div
        className="card"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
         
        }}
      >
        
        <div className="event-content">
          <div className='event-card-description'>

          <h2>Name of the event
        </h2>
        <p>
         Medium description about the event, or even the full description of the event,  I live this up to the groups discussion
        </p>
          </div>
        
      
          {showBookNow ? (
            
            <button className="btn-primary" onClick={handleButtonClick}>Get Ticket</button>
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
