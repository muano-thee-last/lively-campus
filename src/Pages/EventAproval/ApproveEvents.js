import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../EventCreation/styles/Profile.css";
import "./ApproveEvents.css";
import profile from "../EventCreation/images-logos/profile-logo.jpg";

function ApproveEvents() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/view-more-details/${id}`, { state: { approveEvent: true}});
  };

  useEffect(() => {
    const fetchEvents = () => {
      fetch(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/events"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched events:", data);
          setEvents(data);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    };
    fetchEvents();
  }, [setEvents]);

  const handleScroll = (slider, direction) => {
    if (slider && slider.current) {
      const cardWidth =
        slider.current.querySelector(".dashboard-card").offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  console.log(events);

  return (
    <div className="cards-container">
      {events.length > 0 ? (
        events.map((event, index) => (
          <div className="dashboard-card card-width-height" key={index}>
            <div className="card-first-row override-title">
              <h4 className="event-title" style={{ color: "#003B5C" }}>{event.title}</h4>
            </div>
            <div className="card-second-row override-organizer">
              <img src={profile} alt="Profile " className="profile-image" />
              <p className="event-organizer">{event.organizerName}</p>
            </div>
            <div className="card-third-row override-image">
              <img className="event-images" src={event.imageUrl} alt="Event" />
            </div>
            <div className="card-fourth-row status-view-more">
              <div className="like-comment">
                {/* Approval Status*/}
                {event.isApproved === true ? (
                  <div className="status-bar">
                    <div className="green-circle"></div>{" "}
                    <p className="status">Approved</p>
                  </div>
                ) : event.isApproved === false ? (
                  <div className="status-bar">
                    {" "}
                    <div className="red-circle"></div>{" "}
                    <p className="status">Rejected</p>{" "}
                  </div>
                ) : (
                  <div className="status-bar">
                    {" "}
                    <div className="grey-circle"></div>
                    <p className="status">Pending</p>
                  </div>
                )}
                </div>
                <button
                  className="details-button"
                  onClick={() => handleViewDetails(event.id)}
                >
                  View more details
                </button>
              
            </div>
          </div>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
}

export default ApproveEvents;
