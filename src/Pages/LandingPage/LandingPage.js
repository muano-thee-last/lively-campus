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

      <Footer handleLoginClick={handleButtonClick} />

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

  const mockEvents = {
    upcoming: [
      {
        availableTickets: 299,
        capacity: 300,
        comments: [],
        date: "2024-11-29",
        description: "A conference bringing together tech industry leaders to discuss the latest innovations, trends, and future technologies. Features keynote speakers and breakout sessions.",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/witslivelycampus.appspot.com/o/images%2Ftech.jpg?alt=media&token=a85e0d01-f704-48e9-bd32-f3ec223dffba",
        isApproved: true,
        likes: 2,
        organizerId: null,
        organizerName: "Vhutshilo Ramukosi",
        tags: ["Conference", "Seminar", "Exhibition", "Research Presentation", "Workshop", "Networking Event"],
        ticketPrice: 230,
        time: "07:30",
        title: "Tech Innovators Conference",
        venue: "The Great Hall"
      },
      // Keep the "Wits 100 Celebration" event
      events.find(event => event.title === "Wits 100 Celebration")
    ],
    previous: [
      {
        availableTickets: 15,
        bookingId: 105,
        capacity: 100,
        comments: [{
          text: "check",
          timestamp: "10/28/2024, 11:36:45 AM",
          userName: "Knowledge Ramukosi",
          userProfilePic: "https://lh3.googleusercontent.com/a/ACg8ocICPY5QapHcHM_F1y6A8oP1Vt8kurA_NpQzEIz85kyR4nf-bw=s96-c"
        }],
        createdAt: "2024-10-04T11:52:17.189Z",
        date: "2024-11-09",
        description: "Great week introducing freshers to the wits environment",
        endTime: "15:06",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/witslivelycampus.appspot.com/o/images%2Fphoto-1492684223066-81342ee5ff30.jpg?alt=media&token=a1fff9e0-144e-4a42-836a-3b7b2bf61d86",
        isApproved: true,
        likes: 2,
        organizerId: "Ql34IrtMpsOC6nzPXSeifnMnrfw1",
        organizerImg: "https://lh3.googleusercontent.com/a/ACg8ocLqM_9XDB3CRQtIFijDqs8VSgyWBZi5ANSnBHlH_GeZC-Z4Xw=s96-c",
        organizerName: "Hulisani Rambau",
        tags: ["Music", "Dance"],
        ticketPrice: 5,
        time: "12:00",
        title: "Freshers",
        venue: "West Campus First National Bank Building FNB36"
      },
      // Keep the "Mountain Biking Challenge" event
      events.find(event => event.title === "Mountain Biking Challenge")
    ]
  };

  const filteredEvents = title === "Upcoming Events" 
    ? mockEvents.upcoming.filter(Boolean)  // Filter out any undefined values
    : mockEvents.previous.filter(Boolean); // Filter out any undefined values

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