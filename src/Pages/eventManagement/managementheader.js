import React, { useState } from 'react';
import hamburger from './images-logos/hamburger.jpg';
import logo from './images-logos/logo.png';
import profile from './images-logos/profile-logo.jpg';
import notifications from './images-logos/notification-logo.jpeg';
import './managementheader.css';
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
    const navigate = useNavigate();
   
    const handleNotificationsClick = () => {
        navigate('/Notifications');
    };
    
    const handleDashboardNavigation = () => {
        navigate('/dashboard');
    };
    return (
        <div id='header'>
            <section className='header-right-section'>
                <img 
                    className='hamburger-logo' 
                    src={hamburger} 
                    alt="Menu" 
                    onClick={toggleSidebar} 
                />
                <img 
                    className='lively-campus-logo' 
                    src={logo} 
                    alt="Livelycampus Logo"
                    onClick={handleDashboardNavigation}
                />
                <h4 onClick={handleDashboardNavigation}>Livelycampus</h4>
            </section>
            <section className='header-middle-section'>
               <h1>EVENT MANAGEMENT</h1>
            </section>
            <section className='header-left-section'>
                <img 
                    className='lively-campus-notifications' 
                    src={notifications} 
                    alt="Notifications"
                    onClick={handleNotificationsClick}
                />
                <img 
                    className='lively-campus-profile' 
                    src={profile} 
                    alt="Profile"
                    onClick={() =>navigate("/profile")}
                />
            </section>
           
        </div>
    );
}

export default Header;
