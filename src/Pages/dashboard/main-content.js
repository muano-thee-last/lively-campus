import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main-content.css";
import profile from "./images-logos/profile-logo.jpg";
import comments from "./images-logos/comments.jpeg";
import { useCallback } from "react";


const tagGroups = {
  "Music & Dance": ["Music", "Dance"],
  "Sports": ["Sports"],
  "Celebrations": ["Birthday", "Wedding", "Party", "Anniversary", "Graduation"],
  "Conferences & Workshops": [
    "Conference",
    "Seminar",
    "Workshop",
    "Lecture",
    "Symposium",
    "Hackathon",
    "Career Fair",
  ],
  "Fundraising & Networking": ["Fundraiser", "Networking Event", "Alumni Reunion"],
  "Educational Events": ["Debate", "Exhibition", "Panel", "Research Presentation", "Colloquium"],
  "Club Meetings": ["Club Meeting"]
};


function MainContent() {
  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [visibleComments, setVisibleComments] = useState({});

  const [comment, setComment] = useState(""); 
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("uid");

  const sliderRefs = useRef({});
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
        
        // Set the liked state based on the event ID
        const likedStatuses = {};
        likedEvents.forEach((eventId) => {
          likedStatuses[eventId] = true; // Mark the event as liked
        });
        
        setLiked(likedStatuses);
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching user liked events:", error);
    }
  }, [userId, setLiked]);
  

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
    // Function to handle comment submission
    const handleSubmit = async (eventId) => {
      try {
        // Fetch the current comments for the event
        const response = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch event details.");
        }
    
        const eventData = await response.json();
    
        // Append the new comment to the existing comments
        const updatedComments = [...eventData.comments, comment];
    
        // Update the event's comments
        const updateResponse = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}/comments`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              comments: updatedComments, // Send the updated comments array
            }),
          }
        );
    
        if (updateResponse.ok) {
          // Optionally update your local state to reflect the change
          setComment(""); // Clear the input after submission
          handleFlip(eventId)
        } else {
          console.error("Failed to update comments.");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };
    
  const handleFlip = (eventId) => {
    setFlippedCards((prevFlipped) => ({
      ...prevFlipped,
      [eventId]: !prevFlipped[eventId], // Toggle the flip state for this event
    }));
  };

  const handleScroll = (slider, direction) => {
    if (slider && slider.current) {
      const cardWidth =
        slider.current.querySelector(".dashboard-card").offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleLike = (eventId) => {
    const isLiked = !liked[eventId]; // Toggle the like state for the specific event
  
    setLiked((prevLiked) => ({
      ...prevLiked,
      [eventId]: isLiked, // Update the like state for the clicked event
    }));
  
    const updatedEvents = [...events];
    const eventIndex = events.findIndex((event) => event.id === eventId);
  
    if (isLiked) {
      updatedEvents[eventIndex].likes += 1;
      
      incrementLike(eventId).then((response) => {
        if (!response.ok) {
          updatedEvents[eventIndex].likes -= 1; // Revert like count on failure
          setEvents(updatedEvents);
          console.error("Failed to increment like:", response.json());
        }
      });
    } else {
      updatedEvents[eventIndex].likes -= 1;
      
      decrementLike(eventId).then((response) => {
        if (!response.ok) {
          updatedEvents[eventIndex].likes += 1; // Revert like count on failure
          setEvents(updatedEvents);
          console.error("Failed to decrement like:", response.json());
        }
      });
    }
  };
  

  const handleViewDetails = (id) => {
    navigate(`/view-more-details/${id}`);
  };

  const handleFeedbackClick = () => {
    const email = "livelycampus@gmail.com";  // Replace with your website email
    const subject = "Feedback";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    window.location.href = mailtoLink;
  };
  const toggleCommentsVisibility = (eventId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Function to group events by tag group
  const getEventsByTagGroup = (group) => {
    const tagsInGroup = tagGroups[group];
    return events.filter((event) =>
      event.tags.some((tag) => tagsInGroup.includes(tag))
    );
  };


  return (
    <div id="dashboard-main-content">
      {Object.keys(tagGroups).map((group, idx) => {
        const groupedEvents = getEventsByTagGroup(group);

        if (groupedEvents.length === 0) return null;

        // Create a unique ref for each tag group
        if (!sliderRefs.current[group]) {
          sliderRefs.current[group] = React.createRef();
        }

        return (
          <div className="dashboard-events-section" key={idx}>
            <p className="dashboard-tags">{group}</p>
            <div className="dashboard-slider-container">
              <button
                className="arrow-button left"
                onClick={() => handleScroll(sliderRefs.current[group], "left")}
              >
                ‹
              </button>
              <div className="dashboard-slider">
                <div
                  className="dashboard-card-container"
                  ref={sliderRefs.current[group]}
                >
                  {groupedEvents.map((event, index) => (
                    <div className="dashboard-card" key={index}>
                      <div
                        className={`card-inner ${
                          flippedCards[event.id] ? "is-flipped" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="card-front">
                          <div className="card-first-row">
                            <h4 className="event-title">{event.title}</h4>
                          </div>
                          <div className="card-second-row">
                            <img
                              src={event.organizerImg ? event.organizerImg : profile}
                              style={event.organizerImg ? { borderRadius: "50%" } : {}}
                              alt="Profile"
                              className={event.organizerImg ? "imported-image" : "profile-image"}
                            />
                            <p className="event-organizer">
                              {event.organizerName}
                            </p>
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
                                  liked[event.id] ? "active" : ""
                                }`}
                                onClick={() => handleLike(event.id)}
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
                                onClick={() => handleFlip(event.id)} // Flip the card when comments icon is clicked
                               
                              />
                              <p className="like-count">
                                likes {event.likes}
                              </p>
                              <p className="comment-count">
                                {event.comments.length}
                              </p>
                            </div>
                            <button
                              className="details-button"
                              onClick={() => handleViewDetails(event.id)}
                            >
                              View more details
                            </button>
                          </div>
                        </div>

                        {/* Back Side (Comment Section) */}
                        <div className="card-back">
                        <div className="feedback1-container">
      <h1 className="feedback1-title">
        Leave a comment
        <button
          className="close-comment-button"
          onClick={() => handleFlip(event.id)} // Close the comment section
        >
          X
        </button>
      </h1>
      <textarea
        className="feedback1-textarea"
        placeholder="Post a comment"
        value={comment} // Bind the textarea to the comment state
        onChange={(e) => setComment(e.target.value)} // Update state on change
      ></textarea>
      <div className="feedback1-buttons">
        <button className="view-comments" onClick={() => toggleCommentsVisibility(event.id)}>Comments</button>
        <button className="submit1-button" onClick={() => handleSubmit(event.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <path d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M10.11 13.6501L13.69 10.0601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>
                {/* Conditionally render the comments view */}
  {visibleComments[event.id] && (
                <div className="comments-list-container">
                  <h2>Comments</h2>
                  <button
                    className="close-comments-button"
                    onClick={() => toggleCommentsVisibility(event.id)}
                  >
                    Close 
                  </button>
                  <div className="comments-list">
                    {event.comments && event.comments.length > 0 ? (
                      event.comments.map((com, idx) => (
                        <div key={idx} className="comment">
                          {com}
                        </div>
                      ))
                    ) : (
                      <div>No comments yet.</div>
                    )}
                  </div>
                </div>
              )}
    </div>

        </div>

                        </div>
                      </div>
                   
                  ))}
                </div>
              </div>
              <button
                className="arrow-button right"
                onClick={() => handleScroll(sliderRefs.current[group], "right")}
              >
                ›
              </button>
            </div>
          </div>
        );
      })}

      {showFeedback && (
        <div className="feedback-box">
          <p onClick={handleFeedbackClick}>Send us your feedback!</p>
        </div>
      )}
    </div>
  );
}

export default MainContent;
