import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../EventCreation/styles/Profile.css";
import genderLogo from "../EventCreation/images-logos/gender-male.svg";
import birthdayLogo from "../EventCreation/images-logos/birthday.svg";
import emailLogo from "../EventCreation/images-logos/email.svg";
import phoneLogo from "../EventCreation/images-logos/phone.svg";
import witsBackground from "../EventCreation/images-logos/wits-background.png";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";
import Footer from "../dashboard/footer";
import profile from '../dashboard/images-logos/profile-logo.jpg';
import comments from '../dashboard/images-logos/comments.jpeg';

export default function Profile() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = sessionStorage.getItem("uid");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);
  const navigate = useNavigate();

  const userData = {
    name: user.displayName,
    myImg: user.photoURL,
    title: "Student",
    gender: "many-genders-issue",
    birthday: "to-be-added",
    email: user.email,
    phone: "to-be-added",
  };

  const { myImg, name, title, gender, birthday, email, phone } = userData;

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      fetchUserLikedEvents();
    }
  }, [events]);

  const fetchEvents = () => {
    fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Error fetching events:", error));
  };

  const fetchUserLikedEvents = () => {
    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        const likedEventIds = data.likedEvents || [];
        const filteredLikedEvents = events.filter(event => likedEventIds.includes(event.id));
        setLikedEvents(filteredLikedEvents);
      })
      .catch(error => console.error("Error fetching liked events:", error));
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
    console.log(sessionStorage.getItem("uid"));
  };

  const handleUnlike = (eventId) => {
    updateUserLikedEvents(eventId, false)
      .then(() => {
        const updatedLikedEvents = likedEvents.filter(event => event.id !== eventId);
        setLikedEvents(updatedLikedEvents);
      })
      .catch(error => console.error('Error unliking event:', error));
  };

  const updateUserLikedEvents = (eventId, isLiked) => {
    if (!userId) {
      console.error("User is not logged in");
      return Promise.reject("User is not logged in");
    }

    return fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user liked events');
        }
        return response.json();
      })
      .then(data => {
        const currentLikedEvents = data.likedEvents || [];

        let updatedLikedEvents;
        if (isLiked) {
          updatedLikedEvents = [...currentLikedEvents, eventId];
        } else {
          updatedLikedEvents = currentLikedEvents.filter(id => id !== eventId);
        }

        return fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}/liked-events`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ likedEvents: updatedLikedEvents }),
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update liked events');
        }
        return response.json();
      })
      .then(data => {
        console.log('Liked events updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating liked events:', error);
      });
  };
  const handleEventManagement = () => {
    navigate(`/eventManagement`);
  };

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <SideBar isSidebarOpen={isSidebarOpen} />
        <div className="profile">
          <div className="wits-background-picture">
            <img src={witsBackground} className="wits-background" alt="background" />
          </div>
          <div className="picture-container">
            <img src={myImg} className="profile-picture" alt="profile-pic" />
            <div className="user-info">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
          <div className="about-section">
            <h2 className="bold-title">About</h2>
            <div className="details-container">
              <div>
                <img src={genderLogo} alt="gender" />
                <span>{gender}</span>
              </div>
              <div>
                <img src={birthdayLogo} alt="dob" />
                <span>{birthday}</span>
              </div>
              <div>
                <img src={emailLogo} alt="email" />
                <span>{email}</span>
              </div>
              <div>
                <img src={phoneLogo} alt="phone" />
                <span>{phone}</span>
              </div>
            </div>
          </div>
          <div className="additional-features-container">
          <div className="additional-features">
          <h2 className="add-features-bold-title">Additional Functions
          </h2>
          <button className="additional-features-buttons" onClick={() => handleEventManagement()}>Manage your Events</button>
          <button className="additional-features-buttons">Create an Event</button>
          </div>
          </div>
          

          {/* Liked Events Section */}
          <div className="liked-events-section">
            <h2 className="bold-title">Liked Events</h2>
            <div className="dashboard-card-container">
              {likedEvents.length > 0 ? (
                likedEvents.map((event, index) => (
                  <div className="dashboard-card" key={index}>
                    <div className="card-first-row">
                      <h4 className="event-title">{event.title}</h4>
                    </div>
                    <div className="card-second-row">
                      <img src={profile} alt="Profile" className="profile-image" />
                      <p className="event-organizer">{event.organizer}</p>
                    </div>
                    <div className="card-third-row">
                      <img className="event-images" src={event.imageUrl} alt="Event" />
                    </div>
                    <div className="card-fourth-row">
                      <div className="like-comment">
                        {/* Red heart icon for already liked events */}
                        <button
                          className="like-button active"
                          onClick={() => handleUnlike(event.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="like-icon">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                        <img src={comments} alt="Comments" className="comments-image" />
                        <p className="like-count">Likes: {event.likes}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="liked-p">No liked events yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
