// CommentsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Commentspage.css";

function CommentsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`
        );
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSubmitComment = async () => {
    if (!comment) return;

    try {
      const updatedComments = [...event.comments, comment]; 

      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}/comments`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comments: updatedComments }),
        }
      );

      if (response.ok) {
        setEvent((prevEvent) => ({
          ...prevEvent,
          comments: updatedComments,
        }));
        setComment(""); 
      } else {
        console.error("Failed to update comments.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    
      <div className="comments-page">
        <h1>Comments for {event?.title}</h1>
        <button onClick={() => navigate(-1)}>Go Back</button>

        <div className="comments-list">
          {event?.comments && event.comments.length > 0 ? (
            event.comments.map((com, idx) => (
              <div key={idx} className="comment">
                {com}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        <textarea
          placeholder="Write a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmitComment}>Post Comment</button>
      </div>
  );
}

export default CommentsPage;
