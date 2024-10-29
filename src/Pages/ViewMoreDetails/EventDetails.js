import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
} from "react-icons/fa";
import "./EventDetails.css";
import "../EventCreation/styles/EventCreationStyles.css";
import { Modal, Button } from "@mui/material";
import "../EventCreation/styles/EventCreationStyles.css";
//import BuyTickets from "../BuyTickets/BuyTickets";
import BuyTicket from "../BuyTickets/purchase";

const LIVELY_CAMPUS_API =
  "https://us-central1-witslivelycampus.cloudfunctions.net/app";
const WIMAN_API = "https://wiman.azurewebsites.net/api/";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [approveEvent, setApproveEvent] = useState(false);
  const navigate = useNavigate();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [wimanBearerKey, setWimanBearerKey] = useState("");
  const [isVenueApproved, setIsVenueApproved] = useState(null);

  function handleReject() {
    setIsRejectModalOpen(true);
  }
  useEffect(() => {
    const getWimanBearerKey = async () => {
      const url =
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/getEnvWiman";

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setWimanBearerKey(json.value);
      } catch (error) {
        console.error("Error fetching Wiman API key:", error);
      }
    };

    getWimanBearerKey();
  }, []);

  useEffect(() => {
    fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
    try {
      setApproveEvent(location.state.approveEvent);
    } catch {
      setApproveEvent(false);
    }
  }, [id, setApproveEvent, location]);

  useEffect(() => {
    async function getVenueStatus() {
      const response = await fetch(
        `${WIMAN_API}/bookings/status/${event.bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wimanBearerKey}`,
          },
        }
      );
      const res = await response.json();
      if (res.status === "confirmed") {
        setIsVenueApproved(true);
      } else if (res.status === "rejected") {
        setIsVenueApproved(false);
      }
    }
    if (event && wimanBearerKey) getVenueStatus();
  }, [event, wimanBearerKey]);

  useEffect(() => {
    const getGoogleKey = async () => {
      const url =
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/getEnvgoogle";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setGoogleMapsApiKey(json.value);
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error);
      }
    };

    getGoogleKey();
  }, []);

  let [colors, setColors] = useState({});

  function randomColor(tagName) {
    const letters = "0123456789ABCDEF";
    let color = "#";
    if (tagName in colors) {
      return colors[tagName];
    }
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 11)];
    }
    setColors({ ...colors, [tagName]: color });
    return color;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleAccept = () => {
    setIsAcceptModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(false);
    setIsAcceptModalOpen(false); // Close accept modal as well
  };

  if (!event || !googleMapsApiKey) {
    return <p>Loading...</p>;
  }

  return (
    <div className="event-creation-container">
      <div className={""}>
        <img
          src={event.imageUrl}
          alt="event-picture"
          className="event-picture"
        />
      </div>

      <div className="event-header">
        <h1 className="event-name-view">{event.title}</h1>
        <div className="eventTags chosenTags">
          {event.tags.map((tagName, index) => {
            return (
              <div
                key={`${tagName}-${index}`}
                className="chosenTag"
                style={{ backgroundColor: randomColor(tagName) }}
              >
                <p>{tagName}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="event-info">
        <div className="info-item">
          <FaMapMarkerAlt className="icon" /> {event.venue}
        </div>
        <div className="info-item">
          <FaCalendarAlt className="icon" />{" "}
          {new Date(event.date).toLocaleDateString()} {event.time}
          {" - "}
          {event.endTime}
        </div>
        <div className="info-item">
          <FaUsers className="icon" /> Capacity: {event.capacity}
        </div>
        <div className="info-item">
          <FaTicketAlt className="icon" /> Available Tickets:{" "}
          {event.availableTickets}
        </div>
      </div>

      <div className="event-description">
        <h3>Description</h3>
        <div style={{ whiteSpace: "pre-wrap", paddingTop: "1vw" }}>
          <p>{event.description}</p>
        </div>
      </div>
      <div className="event-venue-location">
        <h3>Venue and Location</h3>
        <div className="map-container">
          <iframe
            title={`Map showing location of ${event.venue}`}
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(
              event.venue
            )}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>
      {approveEvent && (
        <div className="response-wiman-section">
          <h3>Venue Approval Status </h3>{" "}
          {isVenueApproved === true ? (
            <div className="status-bar">
              <div className="green-circle"></div>{" "}
              <p className="status">Approved</p>
            </div>
          ) : isVenueApproved === false ? (
            <div className="status-bar">
              {" "}
              <div className="red-circle"></div>{" "}
              <p className="status">Rejected</p>{" "}
            </div>
          ) : (
            <div className="status-bar">
              {" "}
              <div className="grey-circle"></div>
              <p className="status">Waiting Approval</p>
            </div>
          )}
        </div>
      )}

      <div className="event-buy-tickets">
        <p>
          <strong>
            Ticket Price:{" "}
            {event.ticketPrice === 0 ? "Free" : <>R {event.ticketPrice}</>}
          </strong>
        </p>
        {approveEvent ? (
          event.isApproved == null ? (
            <div className="approve-reject">
              <button className="create-button red" onClick={handleReject}>
                Reject
              </button>
              <button className="create-button green" onClick={handleAccept}>
                Approve
              </button>
            </div>
          ) : event.isApproved === true ? (
            <h2 style={{ color: "green" }}>Event Approved</h2>
          ) : (
            <h2 style={{ color: "red" }}>Event Rejected</h2>
          )
        ) : (
          <button className="create-button" onClick={handleOpenModal}>
            Buy Ticket
          </button>
        )}
      </div>
      <Modal open={isRejectModalOpen} onClose={handleCloseModal}>
        <div className="modal-content-accept-reject centered-modal">
          <h2 id="modal-title">Reject Event</h2>
          <p id="modal-description">
            Are you sure you want to reject this event?
          </p>
          <div className="modal-buttons">
            <Button
              style={{ backgroundColor: "#85714d" }}
              variant="contained"
              onClick={async () => {
                let headersList = {
                  Accept: "*/*",
                  "User-Agent": "lively-campus",
                  "Content-Type": "application/json",
                };

                console.log("Rejecting event...");

                try {
                  let cancelResponse = await fetch(
                    `${WIMAN_API}/bookings/cancel/${event.bookingId}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${wimanBearerKey}`,
                      },
                    }
                  );

                  if (cancelResponse.ok) {
                    let response = await fetch(
                      `${LIVELY_CAMPUS_API}/events/${id}/reject`,
                      {
                        method: "PUT",
                        headers: headersList,
                      }
                    );

                    if (response.ok) {
                      handleCloseModal(); // Close modal first
                      navigate("/approve-events"); // Navigate after modal closes
                    } else {
                      console.log(
                        "Failed to reject the event, status:",
                        response.status
                      );
                    }
                  }
                } catch (error) {
                  console.error("Error rejecting the event:", error);
                }
              }}
            >
              Yes
            </Button>

            <Button
              variant="contained"
              style={{ backgroundColor: "#003b5c" }}
              onClick={handleCloseModal}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={isAcceptModalOpen} onClose={handleCloseModal}>
        <div className="modal-content-accept-reject centered-modal">
          <h2 id="modal-title">Approve Event</h2>

          {isVenueApproved === true ? (
            <div>
              <p id="modal-description">
                Are you sure you want to approve this event?
              </p>
              <div className="modal-buttons">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "green" }}
                  onClick={async () => {
                    /* Handle Yes action for approving */
                    let headersList = {
                      Accept: "*/*",
                      "User-Agent": "lively-campus",
                      "Content-Type": "application/json",
                    };

                    try {
                      let response = await fetch(
                        `${LIVELY_CAMPUS_API}/events/${id}/accept`,
                        {
                          method: "PUT",
                          headers: headersList,
                        }
                      );

                      if (response.ok) {
                        handleCloseModal(); // Close modal first
                        navigate("/approve-events"); // Navigate after modal closes
                      } else {
                        console.log(
                          "Failed to approve the event, status:",
                          response.status
                        );
                      }
                    } catch (error) {
                      console.error("Error approve the event:", error);
                    }
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#003b5c" }}
                  onClick={handleCloseModal}
                >
                  No
                </Button>
              </div>
            </div>
          ) : isVenueApproved === false ? (
            <div>
              <p id="modal-description">
                This event has already been rejected.
              </p>
              <Button
                variant="contained"
                style={{ backgroundColor: "#003b5c" }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
          ) : (
            <div>
              <p id="modal-description">
                This event is still pending approval from the venue admin.
              </p>
              <Button
                variant="contained"
                style={{ backgroundColor: "#003b5c" }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="modal-content">
          <BuyTicket event={event} />
        </div>
      </Modal>
    </div>
  );
}
