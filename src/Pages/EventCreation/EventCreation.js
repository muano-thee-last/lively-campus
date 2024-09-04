import React from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import add from "./images-logos/add.svg";
import location from "./images-logos/location.svg";
import calendar from "./images-logos/calendar.svg";
import clock from "./images-logos/clock.svg";
import upload from "./images-logos/upload.svg";
import locationButton from "./images-logos/location-button.svg";
import "./styles/EventCreationStyles.css";
import PopupCard from "./components/PopupCard";
import person from "./images-logos/person.svg";
import {storage} from "../../Pages/Login/config";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";
import {useNavigate} from "react-router-dom"

const EVENTS_API =
  "https://us-central1-witslivelycampus.cloudfunctions.net/app/events";
const VENUE_API = null;
const MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;





export default function EventCreation() {
  let availableVenues;
  let showStatus = false;
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
    console.log(sessionStorage.getItem("uid"));
  };
  
  const [eventData, setEventData] = React.useState({
    eventName: "",
    eventDescription: "",
    ticketPrice: 0,
    capacity: 0,
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventVenue: "",
  });
  const id = React.useId();
  const fileInputRef = React.useRef(null);
  const [image, setImage] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageUrlLocal, setImageUrlLocal] = React.useState("");
  const [isPopupTagOpen, setIsPopupTagOpen] = React.useState(false);
  const [isPopupLocationOpen, setIsPopupLocationOpen] = React.useState(false);

  const [selectedTags, setSelectedTags] = React.useState([]);
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

  availableVenues = [
    {
      features: ["WiFi", "Projector"],
      name: "Great Hall",
      location: "Great+Hall",
      id: "GH001",
      capacity: 500,
      time: "10:00 AM - 8:00 PM",
    },
    {
      features: ["Air Conditioning", "Sound System"],
      name: "Senate Room",
      location: "Senate+Room, 2nd Floor",
      id: "SR002",
      capacity: 100,
      time: "10:00 - 00:00 ",
    },
    {
      features: ["WiFi", "Video Conferencing"],
      name: "Computer Lab 1",
      location: "The+Wits+Science+Stadium",
      id: "CL003",
      capacity: 40,
      time: "10:00 - 12:00",
    },
    {
      features: ["Whiteboard", "Natural Light"],
      name: "Seminar Room 3",
      location: "Education+Campus",
      id: "SR004",
      capacity: 30,
      time: "10:00 - 22:00",
    },
  ];
  const user = JSON.parse(sessionStorage.getItem("user"));

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
    document
      .querySelector(".event-creation-container")
      .classList.add("blurred");
  }
  function closeTagPopup() {
    setIsPopupTagOpen(false);
    document
      .querySelector(".event-creation-container")
      .classList.remove("blurred");
  }

  function openLocationPopup() {
    setIsPopupLocationOpen(true);
    document
      .querySelector(".event-creation-container")
      .classList.add("blurred");
  }
  function closeLocationPopup() {
    setIsPopupLocationOpen(false);
    document
      .querySelector(".event-creation-container")
      .classList.remove("blurred");
  }

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
      !image
    ) {
      console.error("All fields must be filled out before submission.");
      return; // Stop execution if any field is empty
    }
  
    const imageRef = ref(storage, `images/${image.name}`);
  
    try {
      // Upload image and get download URL
      await uploadBytes(imageRef, image);
      console.log("Uploaded a blob or file!");
  
      const url = await getDownloadURL(imageRef);
      console.log("Image Download URL:", url);
  
      let headersList = {
        Accept: "*/*",
        "User-Agent": "lively-campus",
        "Content-Type": "application/json",
      };
  
      let bodyContent = JSON.stringify({
        organizerName: user.displayName,
        organizerId: sessionStorage.getItem("userId"),
        title: eventData.eventName,
        description: eventData.eventDescription,
        ticketPrice: Number(eventData.ticketPrice),
        capacity: Number(eventData.capacity),
        availableTickets: Number(eventData.capacity),
        date: eventData.eventDate,
        time: eventData.eventTime,
        imageUrl: url,
        tags: selectedTags,
        venue: eventData.eventLocation,
        likes: 0,
        comments: [],
      });
  
      // Send the POST request
      let response = await fetch(EVENTS_API, {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });
  
      console.log("Response Status:", response.status);
      
      showStatus = true;
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error uploading image:", error);
      navigate("/");
    }
  }
  

  async function getAvailableVenues() {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "lively-campus",
    };
    let bodyContent = JSON.stringify({
      date: eventData.eventDate,
      time: eventData.eventTime,
    });

    let response = await fetch(VENUE_API, {
      method: "GET",
      headers: headersList,
      body: bodyContent,
    });

    availableVenues = await response.json();
  }

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
  function AddLocationContent() {
    return (
      <div className="card-container">
        {availableVenues.map((venue) => (
          <div className="venue-card" key={venue.id}>
            <div className="venue-details">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${venue.location},Wits+University, Johannesburg, South+Africa&zoom=16&size=220x115&format=png&markers=color:red%7C${venue.location},Wits+University, Johannesburg, South+Africa&key=${MAP_API_KEY}`}
                height="115"
                width="220"
                alt="mapImage"
              />
              <div className="venue-info">
                <div className="logo-name">
                  <img src={location} alt="logo" height="25" width="25" />
                  <span>{venue.name}</span>
                </div>

                <div className="logo-name">
                  <img src={person} alt="logo" height="25" width="25" />
                  <span>Max Capacity {venue.capacity}</span>
                </div>

                <div className="logo-name">
                  <img src={clock} alt="logo" height="25" width="25" />
                  <span>From {venue.time}</span>
                </div>
              </div>
            </div>
            <button
              className="create-button centered"
              onClick={() => {
                handleChange({
                  target: { name: "eventLocation", value: venue.name },
                });
                closeLocationPopup();
              }}
              name="eventLocation"
              value={venue.name}
            >
              Book Venue
            </button>
          </div>
        ))}
      </div>
    );
  }
  let [colors, setColors] = React.useState({});
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
      <Header  toggleSidebar={toggleSidebar}/>  
      <div className="container">
        <SideBar isSidebarOpen={isSidebarOpen}/>
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
            title="Available Venues"
            children={AddLocationContent()}
            notButton={false}
            onClose={closeLocationPopup}
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
            {imageUrl ? <p>Change Cover Image</p> : <p>Upload Cover Image</p>}
          </div>
          <input
            type="file"
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
            <div className="event-details">
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
                  name={"ticketPrice"}
                  value={eventData.ticketPrice}
                  className="ticket-price"
                  id={id + 1}
                  required
                />
              </div>

              <div className="detail-input">
                <label htmlFor={id + 2}>Capacity</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name={"capacity"}
                  value={eventData.capacity}
                  className="capacity"
                  id={id + 2}
                  required
                />
              </div>

              <div className="detail-input">
                <label htmlFor={id + 3} className="name-logo-title">
                  <span>Date</span>
                  <img src={calendar} alt="calendar" />
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name={"eventDate"}
                  value={eventData.eventDate}
                  className="event-date"
                  id={id + 3}
                  required
                />
              </div>
              <div className="detail-input">
                <label htmlFor={id + 6} className="name-logo-title">
                  <span>Time</span>
                  <img src={clock} alt="clock" />
                </label>
                <input
                  type="time"
                  onChange={handleChange}
                  name={"eventTime"}
                  value={eventData.eventTime}
                  className="event-time"
                  id={id + 6}
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
                  {eventData.eventLocation && <h4>{eventData.eventLocation}</h4>}
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
              <div className="center-button">
                <button className="create-button" onClick={handleSubmitButton}>
                  Create Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
