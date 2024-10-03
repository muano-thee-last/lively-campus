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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date();
      setLoading(true); 
      setError(null);
      try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
        const data = await response.json();

        // Filter upcoming and previous events
        const upcoming = data.filter(event => new Date(event.date) > today);
        const previous = data.filter(event => new Date(event.date) < today);

        setUpcomingEvents(upcoming);
        setPreviousEvents(previous);
      } catch (error) {
        setError('Error fetching events, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const upcomingInterval = setInterval(() => {
        setCurrentUpcomingIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
      }, 6500);

      return () => clearInterval(upcomingInterval); 
    }
  }, [upcomingEvents.length]);

  useEffect(() => {
    if (previousEvents.length > 0) {
      const previousInterval = setInterval(() => {
        setCurrentPreviousIndex((prevIndex) => (prevIndex + 1) % previousEvents.length);
      }, 6500);

      return () => clearInterval(previousInterval);
    }
  }, [previousEvents.length]);

  const handleButtonClick = () => {setShowLogin(true)
    document.body.style.overflow = "hidden";
  };
  const handleCloseLogin = () => {setShowLogin(false)
    document.body.style.overflow = "auto";
  };
  const handleUpcomingDotClick = (index) => setCurrentUpcomingIndex(index);
  const handlePreviousDotClick = (index) => setCurrentPreviousIndex(index);

  return (
    <div className="LandingPage">
      <div className="landing-header-landing-card">
        <Header handleButtonClick={handleButtonClick} />
        <HeroSection />
      </div>

      {loading && <p></p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
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
        </>
      )}

      <Footer />

      {showLogin && <LoginModal handleCloseLogin={handleCloseLogin} />}
    </div>
  );
}

function Header({ handleButtonClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);

  return (
    <header className="landing-page-landing-header">
      <div className="landing-logo-container">
        <img src={logo} alt="LivelyCampus Logo" className="landing-logo-image" />
        <div className="logo-text">LivelyCampus</div>
      </div>
      <nav className={`landing-page-nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#ticket">Ticket</a></li>
          <li><a href="/about">Contact</a></li>
          <li><a href="/about">About Us</a></li>
          <li><button className="btn-secondary" onClick={handleButtonClick} aria-label='Login'>Login</button></li>
        </ul>
      </nav>
      <label className="burger" aria-label="burger" htmlFor="burger">
        <input type="checkbox" id="burger" onClick={toggleMenu} />
        <span></span>
        <span></span>
        <span></span>
      </label>
    </header>
  );
}

function HeroSection() {
  return (
    <div className="hero-landing-card">
      <section className="hero">
        <h1>Ignite Your Campus</h1>
        <h1>Experience!</h1>
        <p>
          Connecting you with the best campus events and activities. Discover, engage, and celebrate!
        </p>
        <div className="hero-buttons">
          <button className="btn-secondary" onClick={AboutSec}>Learn More</button>
        </div>
      </section>
    </div>
  );
}

function AboutSec() {
  window.location.href = '/about';
}

function EventsSection({ title, events, currentIndex, handleDotClick, showBookNow, handleButtonClick }) {
  const sectionRef = useRef(null);
  const [animationKey, setAnimationKey] = useState(0);

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

  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, [currentIndex]);

  const filteredEvents = events.filter(event => 
    title === "Upcoming Events" 
      ? ["Tech Innovators Conference", "Wits 100 Celebration"].includes(event.title)
      : ["Jaiv'ujuluke", "Mountain Biking Challenge"].includes(event.title)
  );

  const currentEvent = filteredEvents[currentIndex % filteredEvents.length];

  return (
    <section ref={sectionRef} className="landing-page-events-section">
      <h2 className="landing-events-title">{title}</h2>

      {currentEvent ? (
        <div
          className="landing-card"
          style={{
            backgroundImage: `url(${currentEvent.imageUrl})`,
          }}
        >
          <div className="landing-event-content">
            <div className="landing-event-card-description">
              <h2 className="landing-event-title" key={animationKey}>
                <span className="landing-event-title-text">
                  {currentEvent.title.split(' ').map((word, wordIndex) => (
                    <span key={wordIndex} className="landing-event-title-word">
                      {word.split('').map((char, charIndex) => (
                        <span
                          key={charIndex}
                          className="landing-event-title-letter"
                          style={{ animationDelay: `${(wordIndex * word.length + charIndex) * 0.05}s` }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </h2>
              <p>{currentEvent.description}</p>
            </div>
            {showBookNow && (
              <button className="btn-primary" onClick={handleButtonClick} aria-label='Login'>Get Ticket</button>
            )}
          </div>
          <div className="dots">
            {filteredEvents.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex % filteredEvents.length === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Slide ${index + 1}`}
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

function LoginModal({ handleCloseLogin }) {
  return (
    <div className="login-modal">
      <button className="landing-close-button" onClick={handleCloseLogin} aria-label='landing-close-button'>X</button>
      <Login />
    </div>
  );
}

export default LandingPage;