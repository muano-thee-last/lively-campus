import React, { useEffect, useState, useId, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { FaTicketAlt } from 'react-icons/fa';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import add from "./images-logos/add.svg";
import location from "./images-logos/location.svg";
import calendar from "./images-logos/calendar.svg";
import clock from "./images-logos/clock.svg";
import upload from "./images-logos/upload.svg";
import locationButton from "./images-logos/location-button.svg";
import "./styles/EventCreationStyles.css";
import PopupCard from "./components/PopupCard";
import person from "./images-logos/person.svg";
import { storage } from "../../Pages/Login/config";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";
import { useNavigate } from "react-router-dom";
import Footer from "../dashboard/footer";

const EVENTS_API =
  "https://us-central1-witslivelycampus.cloudfunctions.net/app/events";

const WIMAN_API = "https://wiman.azurewebsites.net/api/";

export default function EventCreation() {
  const [availableVenues, setAvailableVenues] = useState([]);
  const navigate = useNavigate();
  const [MAP_API_KEY, SET_MAP_API_KEY] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [wimanBearerKey, setWimanBearerKey] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    ticketPrice: 0,
    availableTickets: 0,
    capacity: 0,
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventVenue: "",
  });
  const id = useId();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [imageUrlLocal, setImageUrlLocal] = useState("");
  const [isPopupTagOpen, setIsPopupTagOpen] = useState(false);
  const [isPopupLocationOpen, setIsPopupLocationOpen] = useState(false);
  const [isAvailableTimePopup, setIsAvailableTimePopup] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const aboutTags = [
    "Music",
    "Dance",
    "Sports",
    "Birthday",
    "Conference",
    "Wedding",
    "Party",
    "Anniversary",
    "Seminar",
    "Workshop",
    "Lecture",
    "Symposium",
    "Hackathon",
    "Career Fair",
    "Fundraiser",
    "Debate",
    "Exhibition",
    "Panel",
    "Graduation",
    "Colloquium",
    "Research Presentation",
    "Club Meeting",
    "Alumni Reunion",
    "Networking Event",
  ];

  // availableVenues = [
  //   {
  //     features: ["WiFi", "Projector"],
  //     name: "The Great Hall",
  //     location: "Wits University",
  //     id: "GH001",
  //     capacity: 500,
  //     time: "10:00 AM - 8:00 PM",
  //   },
  //   {
  //     features: ["Air Conditioning", "Sound System"],
  //     name: "Senate Room",
  //     location: "Senate Room, 2nd Floor",
  //     id: "SR002",
  //     capacity: 100,
  //     time: "10:00 - 00:00 ",
  //   },
  //   {
  //     features: ["WiFi", "Video Conferencing"],
  //     name: "Computer Lab 1",
  //     location: "The Wits Science Stadium",
  //     id: "CL003",
  //     capacity: 40,
  //     time: "10:00 - 12:00",
  //   },
  //   {
  //     features: ["Whiteboard", "Natural Light"],
  //     name: "Sturrock Park",
  //     location: "Wits University",
  //     id: "SR004",
  //     capacity: 1000,
  //     time: "10:00 - 22:00",
  //   },
  // ];
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedTags((prevSelected) => [...prevSelected, name]);
    } else {
      setSelectedTags((prevSelected) =>
        prevSelected.filter((tagName) => tagName !== name)
      );
    }
  };
  function handleDivClick() {
    fileInputRef.current.click();
  }
  function handleFileChange(event) {
    setImage(event.target.files[0]);
    setImageUrlLocal(URL.createObjectURL(event.target.files[0]));
  }
  function handleChange(event) {
    setEventData((prevFormData) => {
      return { ...prevFormData, [event.target.name]: event.target.value };
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
  }
  function openTagPopup() {
    setIsPopupTagOpen(true);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.add("blurred");
      }
    );
  }
  function closeTagPopup() {
    setIsPopupTagOpen(false);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.remove("blurred");
      }
    );
  }

  function openLocationPopup() {
    setIsPopupLocationOpen(true);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.add("blurred");
      }
    );
  }
  function closeLocationPopup() {
    setIsPopupLocationOpen(false);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.remove("blurred");
      }
    );
  }
  function openAvailableTimePopup() {
    setIsAvailableTimePopup(true);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.add("blurred");
      }
    );
  }
  function closeAvailableTimePopup() {
    setIsAvailableTimePopup(false);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.remove("blurred");
      }
    );
  }
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
        SET_MAP_API_KEY(json.value);
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error);
      }
    };

    getGoogleKey();
  }, []);
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

  async function handleSubmitButton() {
    // Validation: Check if all required fields are filled

    if (
      !eventData.eventName ||
      !eventData.eventDescription ||
      !eventData.ticketPrice ||
      !eventData.capacity ||
      !eventData.eventDate ||
      !eventData.eventTime ||
      !eventData.eventLocation ||
      !selectedTags.length || // assuming selectedTags is an array
      !image ||
      eventData.ticketPrice < 0 ||
      !eventData.availableTickets ||
      eventData.availableTickets < 0 ||
      Number(eventData.availableTickets) > Number(eventData.capacity)
    ) {
      console.error("All fields must be filled out before submission.");
      return; // Stop execution if any field is empty
    }

    const imageRef = ref(storage, `images/${image.name}`);

    try {
      // Upload image and get download URL
      await uploadBytes(imageRef, image);

      const url = await getDownloadURL(imageRef);

      let headersList = {
        Accept: "*/*",
        "User-Agent": "lively-campus",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        organizerName: user.displayName,
        organizerId: user.uid,
        title: eventData.eventName,
        description: eventData.eventDescription,
        ticketPrice: Number(eventData.ticketPrice),
        capacity: Number(eventData.capacity),
        availableTickets: Number(eventData.availableTickets),
        date: eventData.eventDate,
        time: eventData.eventTime,
        imageUrl: url,
        tags: selectedTags,
        venue: eventData.eventLocation,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        isApproved: null,
        isVenueApproved: null,
        organizerImg: user.photoURL,
      });
      let alertCampusBodyContent = JSON.stringify({
        id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        type: "Type 1",
        description: "Emergency medical situation",
        location: {
          latitude: 0,
          longitude: 0,
        },
        userId: "user123",
        createdAt: "2024-08-18T09:12:33.001Z",
      });

      let notifyCampusSafety =
        await ("https://virtserver.swaggerhub.com/2380759_1/CampusSafety/1.0.0/alerts",
        {
          method: "POST",
          headers: headersList,
          body: alertCampusBodyContent,
        });

      // Send the POST request
      let response = await fetch(EVENTS_API, {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      console.log("Notify Campus Response Status:", notifyCampusSafety.status);

      console.log("Response Status:", response.status);
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error uploading image:", error);
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    const getVenues = async () => {
      try {
        const response = await fetch(`${WIMAN_API}/venues`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wimanBearerKey}`,
          },
        });
        const json = await response.json();
        setAvailableVenues(json);
        console.log(json);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    getVenues();
  }, [wimanBearerKey]);

  const [venueId, setVenueId] = useState("");
  const [venueAvailabilitySlots, setVenueAvailabilitySlots] = useState([]);
  useEffect(() => {
    const getVenueAvailability = async () => {
      function timeToMinutes(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      }

      // Helper function to convert minutes back to time string (HH:MM:SS)
      function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60)
          .toString()
          .padStart(2, "0");
        const mins = (minutes % 60).toString().padStart(2, "0");
        return `${hours}:${mins}:00`;
      }

      // Helper function to add days to a date
      function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

      // Helper function to format date as "YYYY-MM-DD"
      function formatDate(date) {
        return date.toISOString().split("T")[0];
      }

      function findAvailableTimeBetweenDates(
        events,
        startDate,
        endDate,
        startTime = "00:00:00",
        endTime = "24:00:00"
      ) {
        const startOfDay = timeToMinutes(startTime); // Custom start time in minutes
        const endOfDay = timeToMinutes(endTime); // Custom end time in minutes

        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        const availableIntervals = [];

        // Iterate over each day in the date range
        while (currentDate <= end) {
          const currentDateString = formatDate(currentDate);

          // Extract occupied time slots for the current date
          const occupiedSlots =
            events[currentDateString]?.map((event) => {
              const [startTime, endTime] = event.time.split("-");
              return {
                start: timeToMinutes(startTime),
                end: timeToMinutes(endTime),
              };
            }) || [];

          // Sort occupied slots by start time
          occupiedSlots.sort((a, b) => a.start - b.start);

          let lastEndTime = startOfDay;

          // Find available intervals between events
          for (const slot of occupiedSlots) {
            if (slot.start > lastEndTime) {
              availableIntervals.push({
                date: currentDateString,
                start: minutesToTime(lastEndTime),
                end: minutesToTime(slot.start),
              });
            }
            lastEndTime = Math.max(lastEndTime, slot.end);
          }

          // Check for available time after the last event
          if (lastEndTime < endOfDay) {
            availableIntervals.push({
              date: currentDateString,
              start: minutesToTime(lastEndTime),
              end: minutesToTime(endOfDay),
            });
          }

          // Move to the next day
          currentDate = addDays(currentDate, 1);
        }

        return availableIntervals;
      }
      try {
        const response = await fetch(
          `${WIMAN_API}/venues/${venueId}/reservations`
        );
        const json = await response.json();
        setVenueAvailabilitySlots(json);
        console.log(json);
      } catch (error) {
        console.error("Error fetching venue availability:", error);
        const events = {
          "2024-09-18": [
            { event_name: "Product Launch", time: "10:00:00-12:00:00" },
            { event_name: "Client Presentation", time: "14:00:00-15:30:00" },
          ],
          "2024-09-17": [
            { event_name: "Team Standup", time: "09:30:00-10:00:00" },
            { event_name: "Project Review", time: "11:00:00-12:00:00" },
            { event_name: "Lunch with Investors", time: "13:00:00-14:30:00" },
          ],
        };
        setVenueAvailabilitySlots(
          findAvailableTimeBetweenDates(events, startDate, endDate)
        );
      }
    };
    getVenueAvailability();
  }, [venueId, startDate, endDate]);

  function AddTagContent() {
    return (
      <div className="popup-content">
        {aboutTags.map((tagName) => (
          <div key={tagName + id} className="tag">
            <input
              type="checkbox"
              id={tagName}
              key={tagName}
              name={tagName}
              checked={selectedTags.includes(tagName)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={tagName}>{tagName}</label>
          </div>
        ))}
      </div>
    );
  }

  const [venueSearchTerm, setVenueSearchTerm] = useState("");
  function handleVenueSearch(event) {
    setVenueSearchTerm(event.target.value);
  }
  function AddLocationContent() {
    return (
      <div className="card-container">
        <div className="venue-search-bar">
          <input
            id="search-bar"
            type="text"
            placeholder="Search Venues"
            value={venueSearchTerm}
            onChange={handleVenueSearch}
          />
          <label htmlFor="search-bar"></label>
        </div>
        {availableVenues.map((venue) => (
          <div className="venue-card" key={venue.id}>
            <div className="venue-details">
              <iframe
                title={`Map showing location of ${venue.buildingName} ${venue.venueId}`}
                src={`https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${encodeURIComponent(
                  `${venue.campusName} ${venue.buildingName} ${venue.venueId}`
                )}`}
                allowFullScreen
                height="115"
                width="220"
              ></iframe>
              <div className="venue-info">
                <div className="logo-name">
                  <img src={location} alt="logo" height="25" width="25" />
                  <span>{`${venue.campusName} ${venue.buildingName} ${venue.venueId}`}</span>
                </div>

                <div className="logo-name">
                  <img src={person} alt="logo" height="25" width="25" />
                  <span>Max Capacity {venue.capacity}</span>
                </div>

                <div className="logo-name">
                  Type:
                  <span>{venue.type}</span>
                </div>
              </div>
            </div>
            <button
              className="create-button centered"
              onClick={() => {
                setVenueId(venue.venueId);
                handleChange({
                  target: {
                    name: "eventLocation",
                    value: `${venue.campusName} ${venue.buildingName} ${venue.venueId}`,
                  },
                });
                handleChange({
                  target: {
                    name: "capacity",
                    value: `${venue.capacity}`,
                  },
                });
                closeLocationPopup();
                openAvailableTimePopup();
              }}
              name="eventLocation"
              value={venue.name}
            >
              Check Venue Availability
            </button>
          </div>
        ))}
      </div>
    );
  }

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [isValidDateTime, setIsValidDateTime] = useState(false);

  function AddVenueTimeContent() {
    const validateTimeSelection = () => {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      // Ensure end time is after start time
      if (startDateTime >= endDateTime) {
        setError("End time must be after start time.");
        setIsValidDateTime(false);
        return false;
      }

      // Check if the selected time is within available slots
      for (const slot of venueAvailabilitySlots) {
        const slotStart = new Date(`${slot.date}T${slot.start}`);
        const slotEnd = new Date(`${slot.date}T${slot.end}`);

        // Check if the selected time is outside any slot
        if (startDateTime >= slotStart && endDateTime <= slotEnd) {
          setError("");
          return true;
        }
      }

      // If no slot matches
      setError("The selected time is outside of available slots.");
      setIsValidDateTime(false);
      return false;
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Check if the time is valid before proceeding
      if (validateTimeSelection()) {
        closeAvailableTimePopup(); // Call the function to close the popup if no errors
        setEventData((prevFormData) => {
          return {
            ...prevFormData,
            eventDate: startDate,
            eventTime: startTime,
            eventVenue: venueId,
          };
        });
        setIsValidDateTime(true);
        console.log("Form submitted successfully!");
      }
    };

    return (
      <div className="venue-availability">
        <form onSubmit={handleSubmit}>
          <div className="detail-input">
            <label htmlFor={id + 29} className="name-logo-title">
              <span>Start Date</span>
              <img src={calendar} alt="calendar" />
            </label>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              name="startDate"
              value={startDate}
              className="event-date"
              id={id + 29}
              required
            />
          </div>
          <div className="detail-input">
            <label htmlFor={id + 30} className="name-logo-title">
              <span>End Date</span>
              <img src={calendar} alt="calendar" />
            </label>
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              name="endDate"
              value={endDate}
              className="event-date"
              id={id + 30}
              required
            />
          </div>

          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Available Slots
          </Typography>

          {startDate > endDate ? (
            <Typography color="error" variant="body1">
              Date Error: Start date cannot be later than end date.
            </Typography>
          ) : venueAvailabilitySlots.length > 0 ? (
            <div>
              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venueAvailabilitySlots.map((slot, index) => (
                      <TableRow key={index}>
                        <TableCell>{slot.date}</TableCell>
                        <TableCell>{slot.start}</TableCell>
                        <TableCell>{slot.end}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="detail-input">
                <label htmlFor={id + 15} className="name-logo-title">
                  <span>Start Time</span>
                  <img src={clock} alt="clock" />
                </label>
                <input
                  type="time"
                  onChange={(e) => setStartTime(e.target.value)}
                  name="startTime"
                  value={startTime}
                  className="event-date"
                  id={id + 15}
                  required
                />
              </div>

              <div className="detail-input">
                <label htmlFor={id + 14} className="name-logo-title">
                  <span>End Time</span>
                  <img src={clock} alt="clock" />
                </label>
                <input
                  type="time"
                  onChange={(e) => setEndTime(e.target.value)}
                  name="endTime"
                  value={endTime}
                  className="event-date"
                  id={id + 14}
                  required
                />
              </div>
            </div>
          ) : (
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              No available time slots for the selected dates.
            </Typography>
          )}

          {/* Error message */}
          {error && (
            <Typography
              color="error"
              variant="body1"
              style={{ marginTop: "10px" }}
            >
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
            type="submit"
          >
            Done
          </Button>
        </form>
      </div>
    );
  }
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

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <SideBar isSidebarOpen={isSidebarOpen} />
        {isPopupTagOpen && (
          <PopupCard
            title="Select Tags"
            children={AddTagContent()}
            onClose={closeTagPopup}
            notButton={true}
          />
        )}
        {isPopupLocationOpen && (
          <PopupCard
            title="Wits Venues"
            children={AddLocationContent()}
            notButton={false}
            onClose={closeLocationPopup}
          />
        )}
        {isAvailableTimePopup && (
          <PopupCard
            title="Venue Availability"
            children={AddVenueTimeContent()}
            notButton={false}
            onClose={() => {
              closeAvailableTimePopup();
              closeLocationPopup();
            }}
          />
        )}

        <div className="event-creation-container">
          <div
            className="upload-image-section"
            onClick={handleDivClick}
            style={{
              backgroundImage: imageUrlLocal ? `url(${imageUrlLocal})` : "none",
            }}
          >
            <img src={upload} alt="upload-image-logo" id="upload-img" />
            {imageUrlLocal ? (
              <p>Change Cover Image</p>
            ) : (
              <p>Upload Cover Image</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            required
          />
          <form onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="Event Name"
              onChange={handleChange}
              name={"eventName"}
              value={eventData.eventName}
              className="event-name"
            />
            <div className="event-details-block">
              <label htmlFor={id}>Description</label>
              <textarea
                required
                onChange={handleChange}
                name={"eventDescription"}
                value={eventData.eventDescription}
                className="event-description"
                id={id}
              />

              <div className="about-tags">
                <label className="nowrap" htmlFor={id + 4}>
                  About Tag
                </label>
                <div className="chosenTags">
                  {selectedTags &&
                    selectedTags.map((tagName) => {
                      return (
                        <div
                          className="chosenTag"
                          style={{ backgroundColor: randomColor(tagName) }}
                        >
                          <p>{tagName}</p>
                        </div>
                      );
                    })}
                </div>
                <button
                  className="buttons"
                  onClick={openTagPopup}
                  name="addTag"
                  style={selectedTags.length > 0 ? { width: "35px" } : {}}
                >
                  <img src={add} alt="+" />
                  {selectedTags && selectedTags.length > 0 ? (
                    ""
                  ) : (
                    <span>Add tag</span>
                  )}
                </button>
              </div>

              <div className="detail-input">
                <label htmlFor={id + 1}>
                  Ticket Price <span className="currency">R</span>
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="ticketPrice"
                  value={eventData.ticketPrice}
                  className={`ticket-price ${
                    eventData.ticketPrice < 0 && "input-error"
                  }`}
                  id={id + 1}
                  required
                />
              </div>

              <div className="venue-selected">
                <label
                  htmlFor={id + 7}
                  className="name-logo-title"
                  style={eventData.eventLocation ? { top: "-24px" } : {}}
                >
                  <span>Venue</span>
                  <img src={location} alt="location" />
                </label>
                <div className="add-selected-location">
                  {eventData.eventLocation && (
                    <h4>{eventData.eventLocation}</h4>
                  )}
                  <button
                    className="buttons small-font"
                    onClick={openLocationPopup}
                    name="location"
                    id={id + 7}
                  >
                    <img src={locationButton} alt="loc" />
                    {eventData.eventLocation ? (
                      <span>Change Venue</span>
                    ) : (
                      <span>Available Venues</span>
                    )}
                  </button>
                </div>
              </div>
              {isValidDateTime ? (
                <div>
                  <div className="detail-input">
                    <label htmlFor={id + 3} className="name-logo-title">
                      <span>Date</span>
                      <img src={calendar} alt="calendar" />
                    </label>
                    <h4 className="selected-el">
                      {startDate === endDate ? (
                        <span>{startDate}</span>
                      ) : (
                        <span>
                          {startDate} - {endDate}
                        </span>
                      )}
                    </h4>
                  </div>

                  <div className="detail-input ">
                    <label htmlFor={id + 4} className="name-logo-title">
                      <span>Time</span>
                      <img src={clock} alt="clock" />
                    </label>
                    <h4 className="selected-el">
                      <span>
                        {startTime} - {endTime}
                      </span>
                    </h4>
                  </div>
                  <div className="detail-input ">
                    <label htmlFor={id + "cap"} className="name-logo-title">
                      <span>Capacity</span>
                      <img src={person} alt="person" />
                    </label>
                    <h4 className="selected-el">
                      <span>{eventData.capacity}</span>
                    </h4>
                  </div>
                  <div className="detail-input " >
                    <label htmlFor={id + "tic"} className="name-logo-title">
                    Available Tickets
                    <FaTicketAlt className="icon" height={20} width={20}/> 
                    </label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="availableTickets"
                      value={eventData.availableTickets}
                      className={`${
                        (eventData.availableTickets < 0 || Number(eventData.availableTickets) > Number(eventData.capacity)) && "input-error"
                      } ticket-price`}
                      id={id + "tic"}
                      required
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="center-button">
                <button className="create-button" onClick={handleSubmitButton}>
                  Create Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
