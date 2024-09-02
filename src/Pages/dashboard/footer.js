import React from 'react';
import './footer.css';
import logo from './images-logos/logo.png'
import './header.css'
import facebook from './images-logos/facebook.png'
import './header.css'
import twitter from './images-logos/twitter.png'
import linkdlen from './images-logos/linkdlen.png'
function Footer() {
    return (
        <div id='footer'>
            <section id='footer-1st-quator'>
                <div className='footer-logo'>
                    <img className='lively-campus-logo'
                        src={logo} alt='logo' />
                    <h4>Livelycampus</h4>
                </div>
                <div className='socials'>
                    <img className='social-logos'
                        src={facebook} alt='facebook'/>
                    <img className='social-logos'
                        src={twitter} alt='twitter'/>
                    <img className='linkdlen-logo'
                        src={linkdlen} alt='linkedin'/>
                </div>
            </section>
            <section id='footer-2nd-quator'>
                <h5>Plan Events</h5>
                <div className='plan-events'>
                    <p>Create and Set Up</p>
                    <p>Sell Tickets</p>
                    <p>Online RSVP</p>
                    <p>Online Events</p>
                </div>
            </section>
            <section id='footer-3rd-quator'>
                <h5>LivelyCampus</h5>
                <div className='plan-events'>
                    <p>About Us</p>
                    <p>Press</p>
                    <p>Contact</p>
                    <p>Help Centre</p>
                    <p>How it Works</p>
                    <p>Privacy</p>
                    <p>Terms</p>
                </div>
            </section>
            <section id='footer-4th-quator'>
                <h5>Stay in the Loop</h5>
                <div className='suscribe'>
                    <p>Join our mailing list to stay in the loop with our newest details for Events and Concerts</p>

                </div>
                <div className='button-position'>
                    <input type="email" className="email-subscription" placeholder="Enter your email address" />
                    <button className='subscribe-button'>Subscribe Now</button>
                </div>

            </section>
        </div>
    )
}

export default Footer;