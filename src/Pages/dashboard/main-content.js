import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main-content.css";
import profile from "./images-logos/profile-logo.jpg";
import comments from "./images-logos/comments.jpeg";
import { useCallback } from "react";

function MainContent() {
  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const upcomingSlider = useRef(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("uid");

  const fetchUserLikedEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user liked events");
      }

      const data = await response.json();

      if (data && Array.isArray(data.likedEvents)) {
        const likedEvents = data.likedEvents;
        const likedStatuses = events.map((event) =>
          likedEvents.includes(event.id)
        );
        setLiked(likedStatuses);
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching user liked events:", error);
    }
  }, [userId, events, setLiked]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      fetchUserLikedEvents();
    }
  }, [events, fetchUserLikedEvents]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledPercentage =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;

      if (scrolledPercentage > 50) {
        setShowFeedback(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchEvents = () => {
    fetch("https://us-central1-witslivelycampus.cloudfunctions.net/app/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  const incrementLike = (eventId) => {
    return fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, eventId }),
      }
    );
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

  const handleScroll = (slider, direction) => {
    if (slider.current) {
      const cardWidth =
        slider.current.querySelector(".dashboard-card").offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleLike = (index) => {
    const eventId = events[index].id;
    const isLiked = !liked[index];

    const updatedLiked = [...liked];
    updatedLiked[index] = isLiked;
    setLiked(updatedLiked);

    const updatedEvents = [...events];
    if (isLiked) {
      updatedEvents[index].likes += 1;

      incrementLike(eventId).then((response) => {
        if (!response.ok) {
          updatedEvents[index].likes -= 1;
          setEvents(updatedEvents);
          console.error("Failed to increment like:", response.json());
        }
      });
    } else {
      updatedEvents[index].likes -= 1;

      decrementLike(eventId).then((response) => {
        if (!response.ok) {
          updatedEvents[index].likes += 1;
          setEvents(updatedEvents);
          console.error("Failed to decrement like:", response.json());
        }
      });
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/details/${id}`);
  };

  const handleFeedbackClick = () => {
    const email = "livelycampus@gmail.com";  // Replace with your website email
    const subject = "Feedback";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    window.location.href = mailtoLink;
  };
  



  return (
    <div id="dashboard-main-content">
      <div className="dashboard-events-section">
        <h2>Upcoming Events</h2>
        <div className="dashboard-slider-container">
          <button
            className="arrow-button left"
            onClick={() => handleScroll(upcomingSlider, "left")}
          >
            ‹
          </button>
          <div className="dashboard-slider">
            <div className="dashboard-card-container" ref={upcomingSlider}>
              {events.map((event, index) => (
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
                        className={`like-button ${
                          liked[index] ? "active" : ""
                        }`}
                        onClick={() => handleLike(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="like-icon"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                      <img
                        src={comments}
                        alt="Comments"
                        className="comments-image"
                      />
                      <p className="like-count">likes {event.likes}</p>
                    </div>
                    <button
                      className="details-button"
                      onClick={() => handleViewDetails(event.id)}
                    >
                      View more details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="arrow-button right"
            onClick={() => handleScroll(upcomingSlider, "right")}
          >
            ›
          </button>
        </div>
      </div>

      {showFeedback && (
        <div className="feedback-box">
          <p onClick={handleFeedbackClick}>Send us your feedback!</p>
       
        </div>
      )}
    </div>
  );
}

export default MainContent;
