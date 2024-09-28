import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, RadioGroup, FormControl, FormControlLabel } from "@mui/material"; // MUI components
import "../EventCreation/styles/Profile.css";
import "./ApproveEvents.css";
import profile from "../EventCreation/images-logos/profile-logo.jpg";

function ApproveEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // Filter state

  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/view-more-details/${id}`, { state: { approveEvent: true } });
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
          setEvents(data);
          setFilteredEvents(data); 
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    };
    fetchEvents();
  }, []);

  // Function to handle filter changes
  const handleFilterChange = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
    
    if (status === "all") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => {
        if (status === "approved") return event.isApproved === true;
        if (status === "rejected") return event.isApproved === false;
        if (status === "pending") return event.isApproved !== true && event.isApproved !== false;
        return false;
      });
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="approve-events-container">
      <div className="filter-container">
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="approval-status"
            name="approval-status"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All"
            />
            <FormControlLabel
              value="approved"
              control={<Radio />}
              label="Approved"
            />
            <FormControlLabel
              value="rejected"
              control={<Radio />}
              label="Rejected"
            />
            <FormControlLabel
              value="pending"
              control={<Radio />}
              label="Pending"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="cards-container">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div className="dashboard-card card-width-height" key={index}>
              <div className="card-first-row override-title">
                <h4 className="event-title" style={{ color: "#003B5C" }}>
                  {event.title}
                </h4>
              </div>
              <div className="card-second-row override-organizer">
                <img src={profile} alt="Profile " className="profile-image" />
                <p className="event-organizer">{event.organizerName}</p>
              </div>
              <div className="card-third-row override-image">
                <img
                  className="event-images"
                  src={event.imageUrl}
                  alt="Event"
                />
              </div>
              <div className="card-fourth-row status-view-more">
                <div className="like-comment">
                  {/* Approval Status */}
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
    </div>
  );
}

export default ApproveEvents;

