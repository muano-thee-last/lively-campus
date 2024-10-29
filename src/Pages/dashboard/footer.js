import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';
import logo from './images-logos/logo.png';
import facebook from './images-logos/facebook.png';
import twitter from './images-logos/twitter.png';
import linkdlen from './images-logos/linkdlen.png';

function Footer({ handleLoginClick }) {
    const navigate = useNavigate();

    const handlePlanEventClick = (e) => {
        e.preventDefault();
        if (handleLoginClick) {
            handleLoginClick();
        }
    };

    const handleNavigation = (path) => {
        navigate('/about');
    };

    return (
        <div id='footer'>
            <section id='footer-1st-quator'>
                <div className='footer-logo'>
                    <img className='lively-campus-logo' src={logo} alt='logo' />
                    <h4>LivelyCampus</h4>
                </div>
                <div className='socials'>
                    <img className='social-logos' src={facebook} alt='facebook' />
                    <img className='social-logos' src={twitter} alt='twitter' />
                    <img className='linkdlen-logo' src={linkdlen} alt='linkedin' />
                </div>
            </section>
            
            <section id='footer-2nd-quator'>
                <h5>Plan Events</h5>
                <div className='plan-events'>
                    <p onClick={handlePlanEventClick}>Create and Set Up</p>
                    <p onClick={handlePlanEventClick}>Sell Tickets</p>
                    <p onClick={handlePlanEventClick}>Online RSVP</p>
                    <p onClick={handlePlanEventClick}>Online Events</p>
                </div>
            </section>
            
            <section id='footer-3rd-quator'>
                <h5>LivelyCampus</h5>
                <div className='plan-events'>
                    <p onClick={() => handleNavigation('/about')}>About Us</p>
                    <p onClick={() => handleNavigation('/about')}>Press</p>
                    <p onClick={() => handleNavigation('/about')}>Contact</p>
                    <p onClick={() => handleNavigation('/about')}>Help Centre</p>
                    <p onClick={() => handleNavigation('/about')}>How it Works</p>
                    <p onClick={() => handleNavigation('/about')}>Privacy</p>
                    <p onClick={() => handleNavigation('/about')}>Terms</p>
                </div>
            </section>
            
            <section id='footer-4th-quator'>
                <h5>Stay in the Loop</h5>
                <div className='suscribe'>
                    <p>Join our mailing list to stay in the loop with our newest details for Events and Concerts</p>
                </div>
                <div className='button-position'>
                    <input 
                        type="email" 
                        className="email-subscription" 
                        placeholder="Enter your email address"
                    />
                    <button className='subscribe-button'>Subscribe Now</button>
                </div>
            </section>
        </div>
    );
}

export default Footer;