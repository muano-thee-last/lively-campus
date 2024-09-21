import React, { useEffect, useRef, useState } from 'react';
import './About.css';
import Footer from '../dashboard/footer';
import logo from '../../asserts/logo.png';

function About() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(sectionElement);
        }
      },
      { threshold: 0.1 }
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

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  return (
    <div className="AboutPage">
      {/* Manually Coded Header */}
      <header className="about-page-header">
        <div className="logo-container">
          <img src={logo} alt="LivelyCampus Logo" className="logo-image" />
          <div className="logo-text">LivelyCampus</div>
        </div>
        <nav className={`about-page-nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#ticket">Ticket</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/about">About Us</a></li>
            <li><button className="btn-secondary">Login</button></li>
          </ul>
        </nav>
        <label className="burger" htmlFor="burger">
          <input type="checkbox" id="burger" onClick={toggleMenu} />
          <span></span>
          <span></span>
          <span></span>
        </label>
      </header>

      {/* Hero Section */}
      <div className="about-hero">
        <img src={logo} alt="LivelyCampus Logo" className="about-logo" />
        <h1>About LivelyCampus</h1>
        <p>
          Connecting students with exciting campus events. Our platform is designed to ensure that every student has access to the vibrant events happening on campus, from academic talks to concerts and festivals.
        </p>
      </div>

      {/* Content Section */}
      <section ref={sectionRef} className={`about-section ${isVisible ? 'visible' : ''}`}>
        <h2>Our Mission</h2>
        <p>
          At LivelyCampus, our mission is to bridge the gap between students and campus activities. We believe that university life should be more than just classes—it’s about building memories and making connections.
        </p>
        
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Easy-to-use event creation and management tools for organizers.</li>
          <li>Personalized recommendations based on user preferences.</li>
          <li>Google login for fast and secure access.</li>
          <li>Automated email reminders for registered events.</li>
          <li>Seamless payment system using PayFast for tickets.</li>
        </ul>

        <h2>How It Works</h2>
        <p>
          Organizers can create events on the platform, specifying event details such as time, date, location, and ticket prices. Attendees can browse through upcoming events, book tickets, and receive reminders for the events they registered for.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have any questions, suggestions, or want to collaborate with us? Feel free to reach out at:
          <a href="mailto:livelycampus@gmail.com"> support@witslivelycampus.com</a>.
        </p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
