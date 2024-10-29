import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main-content.css";
import profile from "./images-logos/profile-logo.jpg";
import { IconButton,Badge } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
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


function MainContent({ searchQuery }) {
  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [replyVisible, setReplyVisible] = useState({}); // 
  const [replyInputVisible, setReplyInputVisible] = useState({}); 
  const [replyText, setReplyText] = useState({});
  const [user, setUser] = useState({});
  const [comment, setComment] = useState(""); 
  const [error, setError] = useState(""); 
  const [filteredEvents, setFilteredEvents] = useState([]);
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
        setEvents(data.filter((event) => event.isApproved === true && event.date >= new Date().toISOString()));  
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
          submitComment(comment);
          setComment(""); // Clear the input after submission
        } else {
          console.error("Failed to update comments.");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };
    const submitComment = (comment) => {
      const commentWithTimestamp = {
        text: comment,
        timestamp: new Date().toISOString(), // Save the timestamp when the comment is submitted
      };
    
      // Save commentWithTimestamp in state, local storage, or your database as needed
      console.log(commentWithTimestamp);
    };
    
    
    const timeAgo = (timestamp) => {
      const currentTime = new Date();
      const commentTime = new Date(isNaN(timestamp) ? timestamp : parseInt(timestamp));
      
      if (isNaN(commentTime)) {
        return "Invalid date";
      }
    
      const timeDifference = currentTime - commentTime;
      if (timeDifference < 0) {
        return "In the future";
      }
    
      const minutesAgo = Math.floor(timeDifference / (1000 * 60));
      const hoursAgo = Math.floor(minutesAgo / 60);
      const daysAgo = Math.floor(hoursAgo / 24);
    
      if (daysAgo > 0) {
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      } else if (hoursAgo > 0) {
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
      } else if (minutesAgo > 0) {
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
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
    useEffect(() => {
      document.body.style.overflow = "auto"; // Enable scrolling on initial load
  
      return () => {
        document.body.style.overflow = "auto"; // Cleanup: Ensure scrolling is re-enabled when the component is unmounted
      };
    }, []);

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
  const handleCommentLike = async (eventId, commentIndex) => {
    console.log("Comment Index for Like:", commentIndex);
  
    try {
      // Fetch the current event details, including comments
      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch event details.");
      }
  
      const eventData = await response.json();
  
      // Access the specific comment based on the provided index
      const comment = eventData.comments[commentIndex];
  
      // Check if the likes field exists; if not, initialize it
      const updatedComment = { 
        ...comment, 
        likes: (comment.likes || 0) + 1 // Increment likes or initialize to 1
      };
  
      // Update the specific comment in the event's comments array
      const updatedComments = [...eventData.comments];
      updatedComments[commentIndex] = updatedComment; // Update the comment with the new likes count
  
      // Update the event's comments with the new likes count on the server
      const updateResponse = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}/comments`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comments: updatedComments, // Send the updated comments array with likes
          }),
        }
      );
  
      if (updateResponse.ok) {
        // Immediately update local state to reflect the new likes count
        const updatedEvents = events.map(event => 
          event.id === eventId ? { ...event, comments: updatedComments } : event
        );
        setEvents(updatedEvents); // Update the events state locally
      } else {
        console.error("Failed to update likes.");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
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

// Toggle reply input visibility for a specific comment based on index
const toggleReplyInputVisibility = (commentIndex) => {
  setReplyInputVisible(prevState => ({
    ...prevState,
    [commentIndex]: !prevState[commentIndex] // Toggle visibility for only the clicked comment by index
  }));
};

// Toggle reply visibility for a specific comment based on index
const toggleReplyVisibility = (commentIndex) => {
  setReplyVisible(prevState => ({
    ...prevState,
    [commentIndex]: !prevState[commentIndex] // Toggle visibility for replies of the clicked comment by index
  }));
};

// Handle reply input change for a specific comment based on index
const handleReplyChange = (commentIndex, text) => {
  setReplyText(prevState => ({
    ...prevState,
    [commentIndex]: text // Store reply text for the specific comment by index
  }));
};

const handleSubmitReply = async (eventId, commentIndex) => {
  console.log("Comment Index:", commentIndex);
  if (!replyText[commentIndex]?.trim()) {
    setError("Reply cannot be empty!"); // Set error if reply is empty
    return;
  }

  setError(""); // Clear error if the reply is valid

  try {
    // Fetch the current event details, including comments
    const response = await fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch event details.");
    }

    const eventData = await response.json();

    // Access the specific comment based on the provided index
    const comment = eventData.comments[commentIndex];

    // Create a new reply with timestamp, user name, and profile picture
    const newReply = {
      text: replyText[commentIndex],
      timestamp: new Date().toLocaleString(), // Get the current date and time
      userName: name, // Replace with actual user name
      userProfilePic: myImg, // Replace with actual profile picture URL
    };

    // If the comment doesn't have a replies field, initialize it as an empty array
    if (!comment.replies) {
      comment.replies = [];
    }

    // Append the new reply to the existing replies
    comment.replies = [...comment.replies, newReply];

    // Update the specific comment's replies in the event's comments array
    const updatedComments = [...eventData.comments];
    updatedComments[commentIndex] = { ...comment, replies: comment.replies };

    // Update the event's comments with the new replies on the server
    const updateResponse = await fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}/comments`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: updatedComments, // Send the updated comments array with replies
        }),
      }
    );

    if (updateResponse.ok) {
      // Immediately update local state to reflect the new reply
      const updatedEvents = events.map(event => 
        event.id === eventId ? { ...event, comments: updatedComments } : event
      );
      setEvents(updatedEvents); // Update the events state locally

      // Clear the reply input after submission
      setReplyText(prevState => ({
        ...prevState,
        [commentIndex]: ''
      }));
    } else {
      console.error("Failed to update replies.");
    }
  } catch (error) {
    console.error("Error submitting reply:", error);
  }
};

  useEffect(() => {
    const filtered = events.filter((event) => {
      const titleMatch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const organizerMatch = event.organizerName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const tagsMatch = Array.isArray(event.tags)
        ? event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : false;
      
      return titleMatch || organizerMatch || tagsMatch;
    });
    
    setFilteredEvents(filtered);
  }, [searchQuery, events]);
  
  // Modify the getEventsByTagGroup function to use filteredEvents
  const getEventsByTagGroup = useCallback((group) => {
    const tagsInGroup = tagGroups[group];
    return filteredEvents.filter((event) =>
      event.tags.some((tag) => tagsInGroup.includes(tag))
    );
  }, [filteredEvents]);

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
              <button aria-label="scroll-left"
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
                              style={event.organizerImg ? {  } : {}}
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
                                <IconButton aria-label={`like-button-${event.id}`}  className={`like-button ${
                                  liked[event.id] ? "active" : ""
                                }`}
                                onClick={() => handleLike(event.id)}>
                                <Badge badgeContent={event.likes} color="secondary">
                                  <FavoriteIcon  className="like-icon" />
                                </Badge>
                              </IconButton>
                              <IconButton alt="comments" 
                              data-testid="comments-button" onClick={() => handleCommentsClick(event.id)} >
                               <Badge badgeContent={event.comments.length} color="secondary">
                              <CommentIcon />
                              </Badge>
                            </IconButton>
                              <p className="like-count">
                                likes {event.likes}
                              </p>
                              <p className="comment-count">
                                {event.comments.length}
                              </p>
                            </div>
                            <button  aria-label="view-more-details-button"
                              className="details-button"
                              onClick={() => handleViewDetails(event.id)}
                            >
                              View more details
                            </button>
                          </div>
                        </div>
                        </div>
                      </div>
                   
                  ))}
                </div>
              </div>
              <button aria-label="scroll-right"
                className="arrow-button right"
                onClick={() => handleScroll(sliderRefs.current[group], "right")}
              >
                ›
              </button>
            </div>
          </div>
        );
      })}
{overlayVisible && (
  <div className={`overlay ${overlayVisible ? 'overlay-visible' : ''}`}>
    <div className={`overlay-content ${contentVisible ? 'content-visible' : ''}`}>
      <h2>Comments</h2>
      <button className="close-overlay-button" onClick={closeOverlay}>
        Close
      </button>
      <div className="comments-list scrollable-element">
        {currentEventId && events.find(e => e.id === currentEventId)?.comments.map((com, idx) => (
          <div key={idx} className="comment-img-comment">
            <img src={com.userProfilePic} alt={`${com.userName}'s profile`} className="profile-pic" />
            
            <div className="comment">
              <div className="comment-content">
                <h5 className="commentor">{com.userName}</h5> {/* Display the user's name */}
                <p>{com.text}</p> {/* Display the comment text */}
                <small>{timeAgo(com.timestamp)}</small> {/* Display the relative time */}
              </div>

              {/* Replies Section */}
              {com.replies && com.replies.length > 0 && (
                <div className="replies-section">
                {/* Like button */}

                  <button className="toggle-replies-button" data-testid={`toggle-replies-button-${idx}`} 
                  onClick={() => toggleReplyVisibility(idx)}>
                    {replyVisible[idx] ? 'Hide replies' : `View replies (${com.replies.length})`}
                  </button>
                  {replyVisible[idx] && (
                    <div className="replies-list">
                      {com.replies.map((reply, rIdx) => (
                        <div key={rIdx} className="reply">
                          <img src={reply.userProfilePic} alt={`${reply.userName}'s profile`} className="profile-pic-reply" />
                          <div className="reply-content">
                            <h6 className="reply-author">{reply.userName}</h6>
                            <p className="actual-reply">{reply.text}</p>
                            <small>{timeAgo(reply.timestamp)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reply Input Section */}
              <button className="reply-button" data-testid={`reply-button-${idx}`} onClick={() => toggleReplyInputVisibility(idx)}>
                {replyInputVisible[idx] ? 'Cancel' : 'Reply'}
              </button>
              {replyInputVisible[idx] && (
                <div className="reply-input">
            <textarea
  aria-label="reply-comment-input"
  className="reply-input3"
  placeholder="Write a reply..."
  value={replyText[idx] || ''} // Make sure it's tied to the correct comment
  onChange={(e) => handleReplyChange(idx,e.target.value)}
/>
                  <button data-testid="submit-reply-button" className="submit-reply-button" onClick={() => handleSubmitReply(currentEventId,idx)}>
                    Reply
                  </button>
                </div>
              )}
            </div>
            <IconButton className="likecomment-icon"
                                onClick={() => handleCommentLike(currentEventId,idx)}>
                                <Badge badgeContent={com.likes} color="primary">
                                  <FavoriteIcon   />
                                </Badge>
                              </IconButton>
          </div>
        ))}
      </div>

      <div className="post-comments">
        <textarea
          aria-label="overlay-comment-input"
          className="comment-input"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="comment-error-message">{error}</p>} {/* Show error message */}
        <button aria-label="submit-comment-button" className="submit-button" onClick={() => handleSubmit(currentEventId)}>
          Submit
        </button>
      </div>
    </div>
  </div>
)}  
  {filteredEvents.length === 0 && (
    <div className="no-events-message">
      <p>No events found.</p>
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