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
  const [showFeedback, setShowFeedback] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [user, setUser] = useState({});
  const [comment, setComment] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("uid");

  const sliderRefs = useRef({});
  const userData = {
    name: user.displayName,
    myImg: user.photoURL,
  };
  
  const { myImg, name} = userData;
  
  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);
  
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
  useEffect(() => {
    if (overlayVisible) {
      // Use timeout to trigger class change after the overlay has mounted
      setTimeout(() => setContentVisible(true), 10);
    } else {
      setContentVisible(false);
    }
  }, [overlayVisible]);
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
      if (!comment.trim()) {
        setError("Comment cannot be empty!"); // Set error if comment is empty
        return;
      }
    
      setError(""); // Clear error if the comment is valid
    
      try {
        // Fetch the current comments for the event
        const response = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch event details.");
        }
    
        const eventData = await response.json();
    
        // Create a new comment with timestamp, user name, and profile picture
        const newComment = {
          text: comment,
          timestamp: new Date().toLocaleString(), // Get the current date and time
          userName: name, // Replace with actual user name
          userProfilePic: myImg, // Replace with actual profile picture URL
        };
    
        // Append the new comment to the existing comments
        const updatedComments = [...eventData.comments, newComment];
    
        // Update the event's comments on the server
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
          // Immediately update local state to reflect the new comment
          const updatedEvents = events.map(event => 
            event.id === eventId ? { ...event, comments: [...event.comments, newComment] } : event
          );
          setEvents(updatedEvents); // Update the events state
          setComment(""); // Clear the input after submission
        } else {
          console.error("Failed to update comments.");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };
    
    
    const timeAgo = (timestamp) => {
      const currentTime = new Date();
      const commentTime = new Date(timestamp);
      const timeDifference = currentTime - commentTime; // Difference in milliseconds
    
      const minutesAgo = Math.floor(timeDifference / (1000 * 60)); // Convert to minutes
      const hoursAgo = Math.floor(minutesAgo / 60);
      const daysAgo = Math.floor(hoursAgo / 24);
    
      if (daysAgo > 0) {
        return `${daysAgo}d ago`;
      } else if (hoursAgo > 0) {
        return `${hoursAgo}h ago`;
      } else if (minutesAgo > 0) {
        return `${minutesAgo}min ago`;
      } else {
        return "Just now";
      }
    };
    
    const handleCommentsClick = (eventId) => {
      setCurrentEventId(eventId);
      setOverlayVisible(true);
      document.body.style.overflow = "hidden"; // Disable scrolling
    };
  
    const closeOverlay = () => {
      setOverlayVisible(false);
      setCurrentEventId(null);
      document.body.style.overflow = "auto"; // Re-enable scrolling
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
                       className="card-inner"
                      >
                        {/* Front Side */}
                        <div className="card-front">
                          <div className="card-first-row">
                            <h4 className="event-title">{event.title}</h4>
                          </div>
                          <div className="card-second-row">
                            <img
                              src={event.organizerImg ? event.organizerImg : profile}
                              style={event.organizerImg ? { borderRadius: 50 } : {}}
                              alt="Profile"
                              className="profile-image"
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
                                onClick={() => handleCommentsClick(event.id)}
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
         // Close the comment section
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
      
      </div>
                {/* Conditionally render the comments view */}

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
  {/* Overlay for comments */}
  {overlayVisible && (
  <div className={`overlay ${overlayVisible ? 'overlay-visible' : ''}`}>
    <div className={`overlay-content ${contentVisible ? 'content-visible' : ''}`}>
      <h2>Comments</h2>
      <button className="close-overlay-button" onClick={closeOverlay}>
        Close
      </button>
      <div className="comments-list scrollable-element">
  {currentEventId && events.find(e => e.id === currentEventId)?.comments.map((com, idx) => (
    <div className="comment-img-comment">
      <img src={com.userProfilePic} alt={`${com.userName}'s profile`} className="profile-pic" />
          <div key={idx} className="comment">
      <div className="comment-content">
        <h5 className="commentor">{com.userName}</h5> {/* Display the user's name */}
        <p>{com.text}</p> {/* Display the comment text */}
        <small>{timeAgo(com.timestamp)}</small> {/* Display the relative time */}
      </div>
    </div>
    </div>

  ))}
</div>
      <div className="post-comments">
      <textarea
        className="comment-input"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="comment-error-message">{error}</p>} {/* Show error message */}
      <button className="submit-button" onClick={() => handleSubmit(currentEventId)}>
        Submit
      </button>
      </div>
    </div>
  </div>
)}

      {showFeedback && (
        <div className="feedback-box">
          <p onClick={handleFeedbackClick}>Send us your feedback!</p>
        </div>
      )}
       
    </div>
    
  );
}

export default MainContent;
