import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";

import "./Profile.css";
import emailLogo from "../EventCreation/images-logos/email.svg";

import witsBackground from "../EventCreation/images-logos/wits-background.png";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";
import Footer from "../dashboard/footer";
import profile from "../dashboard/images-logos/profile-logo.jpg";
import comments from "../dashboard/images-logos/comments.jpeg";

export default function Profile() {
  const [user, setUser] = useState({});
  const userId = sessionStorage.getItem("uid");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);
  const navigate = useNavigate();

  const userData = {
    name: user.displayName,
    myImg: user.photoURL,
    title: "Student",
    email: user.email,
  };

  const { myImg, name, title, email } = userData;

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const fetchUserLikedEvents = useCallback(() => {
    fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        const likedEventIds = data.likedEvents || [];
        const filteredLikedEvents = events.filter((event) =>
          likedEventIds.includes(event.id)
        );
        setLikedEvents(filteredLikedEvents);
      })
      .catch((error) => console.error("Error fetching liked events:", error));
  }, [events, userId]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      fetchUserLikedEvents();
    }
  }, [events, fetchUserLikedEvents]);

  const fetchEvents = () => {
    fetch("https://us-central1-witslivelycampus.cloudfunctions.net/app/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const decrementLike = (eventId) => {
    return fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/unlike`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, eventId }),
      }
    );
  };

  const handleUnlike = (eventId) => {
    const updatedLikedEvents = likedEvents.filter(
      (event) => event.id !== eventId
    );
    setLikedEvents(updatedLikedEvents);

    decrementLike(eventId).then((response) => {
      if (!response.ok) {
        console.error("Failed to decrement like:", response.json());
        setLikedEvents([eventId, ...updatedLikedEvents]);
      } else {
        console.log("Successfully decremented like", response.json());
      }
    });
  };

  const handleEventManagement = () => {
    navigate(`/eventManagement`);
  };
  const handleCreateEvent = () => {
    navigate(`/post-event`);
  };

  // Logout Function
  const handleLogout = () => {
    sessionStorage.clear(); // Clear user data from session storage
    navigate("/"); // Redirect to login page
  };

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.clear();
    setShowLogoutConfirmation(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <SideBar isSidebarOpen={isSidebarOpen} />
        <div className="profile">
          <div className="wits-background-picture">
            <img
              src={witsBackground}
              className="wits-background"
              alt="background"
            />
          </div>
          <div className="picture-container">
            <img src={myImg} className="profile-picture" alt="profile-pic" />
            <div className="user-info">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
          <div className="profile-about-section">
            <h2 className="bold-title">About</h2>
            <div className="details-container">
              <div>
                <img src={emailLogo} alt="email" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="additional-features">
            <h2 className="add-features-bold-title">Additional Functions</h2>
            <div className="additional-features-buttons-container">
              <button
                className="additional-features-buttons"
                onClick={handleEventManagement}
              >
                Manage your Events
              </button>
              <button
                className="additional-features-buttons"
                onClick={handleCreateEvent}
              >
                Create an Event
              </button>
              <button
                className="additional-features-buttons logout-button"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
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
                      <img
                        src={profile}
                        alt="Profile"
                        className="profile-image"
                      />
                      <p className="event-organizer">{event.organizerName}</p>
                    </div>
                    <div className="card-third-row">
                      <img
                        className="event-images"
                        src={event.imageUrl}
                        alt="Event"
                      />
                    </div>
                    <div className="card-fourth-row">
                      <div className="like-comment">
                        <button
                          className="like-button active"
                          onClick={() => handleUnlike(event.id)}
                          aria-label={`Unlike ${event.title}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="like-icon"
                            role="button"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                        <img
                          src={comments}
                          alt="Comments"
                          className="comments-image"
                        />
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

      {showLogoutConfirmation && (
        <div className="logout-confirmation-overlay">
          <div className="logout-confirmation-modal">
            <p>Are you sure you want to logout?</p>
            <div className="logout-confirmation-buttons">
              <button onClick={handleLogoutConfirm}>Yes</button>
              <button onClick={handleLogoutCancel}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
