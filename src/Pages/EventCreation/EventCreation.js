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
import { FaTicketAlt } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import add from "./images-logos/add.svg";
import calendar from "./images-logos/calendar.svg";
import clock from "./images-logos/clock.svg";
import upload from "./images-logos/upload.svg";
import locationButton from "./images-logos/location-button.svg";
import locationSVG from "./images-logos/location.svg";
import "./styles/EventCreationStyles.css";
import PopupCard from "./components/PopupCard";
import person from "./images-logos/person.svg";
import zesti from "./Restuarant/zesti.png";
import lantern from "./Restuarant/chinese_lantern.jpg"; 
import jimmy from "./Restuarant/jimmy's.png";
import olives from "./Restuarant/olives.webp"
import { storage } from "../../Pages/Login/config";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../dashboard/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EVENTS_API =
  "https://us-central1-witslivelycampus.cloudfunctions.net/app/events";

const WIMAN_API = "https://wiman.azurewebsites.net/api/";

export default function EventCreation() {
  const location = useLocation();
  const { editingEvent, isEditing } = location.state || {};
  //console.log(editingEvent, isEditing);
  const navigate = useNavigate();

  const [availableVenues, setAvailableVenues] = useState([]);
  const [MAP_API_KEY, SET_MAP_API_KEY] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [wimanBearerKey, setWimanBearerKey] = useState("");
  const [startDate, setStartDate] = useState("");
  const endDate = "";
  const [startTime, setStartTime] = useState(
    isEditing ? editingEvent.time.split("-")[0] : ""
  );
  const [endTime, setEndTime] = useState(
    isEditing ? editingEvent.endTime.split("-")[0] : ""
  );
  const [error, setError] = useState("");
  const [isValidDateTime, setIsValidDateTime] = useState(
    isEditing ? true : false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [renderWithMockData, setRenderWithMockData] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const [eventData, setEventData] = useState(
    isEditing
      ? {
          eventName: editingEvent.title,
          eventDescription: editingEvent.description,
          ticketPrice: editingEvent.ticketPrice,
          availableTickets: editingEvent.availableTickets,
          capacity: editingEvent.capacity,
          eventDate: new Date(editingEvent.date).toLocaleDateString(), // Format date
          eventTime: new Date(
            "1970-01-01T" + editingEvent.time
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Format time
          eventLocation: editingEvent.venue,
          eventVenue: editingEvent.venue,
        }
      : {
          eventName: "",
          eventDescription: "",
          ticketPrice: 0,
          availableTickets: 0,
          capacity: 0,
          eventDate: "",
          eventTime: "",
          eventLocation: "",
          eventVenue: "",
        }
  );

  //console.log(eventData);

  const id = useId();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [imageUrlLocal, setImageUrlLocal] = useState(
    isEditing ? editingEvent.imageUrl : ""
  );
  const [isPopupTagOpen, setIsPopupTagOpen] = useState(false);
  const [isPopupLocationOpen, setIsPopupLocationOpen] = useState(false);
  const [isAvailableTimePopup, setIsAvailableTimePopup] = useState(false);

  const [selectedTags, setSelectedTags] = useState(
    isEditing ? editingEvent.tags : []
  );

  const restuarantsMockData = [
    {
      venueId: "Zesti Lemonz",
      capacity: 200,
      buildingName: "The Matrix",
      campusName: "Wits West Campus",
      imageUrl: {zesti},
      type: "RESTAURANT",
      isUnderMaintenance: false,
      rating: 3.3,
      restuarant: true,
    },
    {
      venueId: "Olives and Plates",
      capacity: 200,
      buildingName: "The Matrix",
      campusName: "Wits West Campus",
      imageUrl:
        {olives},
      type: "RESTAURANT",
      isUnderMaintenance: false,
      rating: 5,
      restuarant: true,
    },
    {
      venueId: "Chinese Lantern",
      capacity: 200,
      buildingName: "",
      campusName: "Wits East Campus",
      imageUrl:
        {lantern},
      type: "RESTAURANT",
      isUnderMaintenance: false,
      rating: null,
      restuarant: true,
    },
    {
      venueId: "Jimmy's",
      capacity: 200,
      buildingName: "The Matrix",
      campusName: "Wits West Campus",
      imageUrl:
        {jimmy},
      type: "RESTAURANT",
      isUnderMaintenance: false,
      rating: 4.5,
      restuarant: true,
    },
  ];
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
  const mockData = [
    {
      venueId: "FH-FF",
      capacity: 400,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/Flower-Hall.jpg",
      type: "HALL",
      isUnderMaintenance: false,
      amenities: ["Air Conditioning", "Wi-Fi"],
      buildingName: "Flower Hall",
      campusName: "West Campus",
      location: {
        lat: -26.191749231525343,
        lng: 28.026097082309278,
      },
    },
    {
      venueId: "FH-GF",
      capacity: 400,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/Flower-Hall.jpg",
      type: "HALL",
      isUnderMaintenance: false,
      amenities: ["Air Conditioning", "Wi-Fi"],
      buildingName: "Flower Hall",
      campusName: "West Campus",
      location: {
        lat: -26.191749231525343,
        lng: 28.026097082309278,
      },
    },
    {
      venueId: "FNB33",
      capacity: 100,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/FNB-building.jpg",
      type: "LECTURE",
      isUnderMaintenance: false,
      amenities: ["projector", "Air Conditioning", "Wi-Fi"],
      buildingName: "First National Bank Building",
      campusName: "West Campus",
      location: {
        lat: -26.18860966118155,
        lng: 28.026387782014314,
      },
    },
    {
      venueId: "FNB36",
      capacity: 100,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/FNB-building.jpg",
      type: "LECTURE",
      isUnderMaintenance: false,
      amenities: ["projector", "Air Conditioning", "Wi-Fi"],
      buildingName: "First National Bank Building",
      campusName: "West Campus",
      location: {
        lat: -26.18860966118155,
        lng: 28.026387782014314,
      },
    },
    {
      venueId: "OMSH",
      capacity: 1000,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/sports-hall.jpg",
      type: "HALL",
      isUnderMaintenance: false,
      amenities: ["Wi-Fi"],
      buildingName: "Old Mutual Sports Hall",
      campusName: "East Campus",
      location: {
        lat: -26.189442852140527,
        lng: 28.029317829500492,
      },
    },
    {
      venueId: "P115",
      capacity: 300,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/Physics-Building-Braamfontein-Campus-East.png",
      type: "LECTURE",
      isUnderMaintenance: false,
      amenities: ["Wi-Fi", "whiteboard", "projector"],
      buildingName: "Physics Building",
      campusName: "East Campus",
      location: {
        lat: -26.19061797755485,
        lng: 28.030991597387718,
      },
    },
    {
      venueId: "PHYS-LAB",
      capacity: 200,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/physics-lab.jpg",
      type: "LAB",
      isUnderMaintenance: false,
      amenities: ["whiteboard", "Air Conditioning", "Wi-Fi"],
      buildingName: "Wits Science Stadium",
      campusName: "West Campus",
      location: {
        lat: -26.190634268424184,
        lng: 28.02534818903165,
      },
    },
    {
      venueId: "WSS100",
      capacity: 25,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/wss1.jpg",
      type: "HALL",
      isUnderMaintenance: false,
      amenities: ["projector", "Air Conditioning", "Wi-Fi"],
      buildingName: "Wits Science Stadium",
      campusName: "West Campus",
      location: {
        lat: -26.190634268424184,
        lng: 28.02534818903165,
      },
    },
    {
      venueId: "WSS102",
      capacity: 150,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/wss1.jpg",
      type: "LECTURE",
      isUnderMaintenance: false,
      amenities: ["projector", "whiteboard"],
      buildingName: "Wits Science Stadium",
      campusName: "West Campus",
      location: {
        lat: -26.190634268424184,
        lng: 28.02534818903165,
      },
    },
    {
      venueId: "WSS103",
      capacity: 150,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/wss1.jpg",
      type: "LECTURE",
      isUnderMaintenance: false,
      amenities: ["projector", "Air Conditioning", "Wi-Fi"],
      buildingName: "Wits Science Stadium",
      campusName: "West Campus",
      location: {
        lat: -26.190634268424184,
        lng: 28.02534818903165,
      },
    },
    {
      venueId: "WSS201",
      capacity: 60,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/wss1.jpg",
      type: "TUTORIAL",
      isUnderMaintenance: false,
      amenities: ["whiteboard"],
      buildingName: "Wits Science Stadium",
      campusName: "West Campus",
      location: {
        lat: -26.190634268424184,
        lng: 28.02534818903165,
      },
    },
    {
      venueId: "WSS300",
      capacity: 35,
      imageUrl:
        "https://sdp2024wiman.blob.core.windows.net/sdp2024wiman-container/wss1.jpg",
      type: "MEETING",
      isUnderMaintenance: false,
      amenities: ["whiteboard", "Air Conditioning"],
      buildingName: "Wits Science Stadium",
      campusName: "West Campus",
      location: {
        lat: -26.190634268424184,
        lng: 28.02534818903165,
      },
    },
    ...restuarantsMockData,
  ];


  const [venueSearchTerm, setVenueSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  function handleVenueSearch(event) {
    const searchTerm = event.target.value;
    const searchTermLowerCase = searchTerm.toLowerCase();
    setVenueSearchTerm(searchTerm);

    // Filter available venues based on the search term
    const filteredVenues = availableVenues.filter((venue) => {
      return (
        venue.venueId.toLowerCase().includes(searchTermLowerCase) ||
        venue.campusName.toLowerCase().includes(searchTermLowerCase) ||
        venue.buildingName.toLowerCase().includes(searchTermLowerCase) ||
        venue.type.toLowerCase().includes(searchTermLowerCase)
      );
    });

    // Update the state with the filtered venues
    setFilteredVenues(filteredVenues);
  }

  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  // Function to handle checkbox changes for tags
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

  const successMessage = () => {
    toast.success("Event created successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => navigate("/dashboard"),
    });
  };
  const fillFormMessage = () => {
    toast.error("Please fill in the form", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const errorMessage = () => {
    toast.error("Error saving event. Please try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Function to handle file input click
  function handleDivClick() {
    fileInputRef.current.click();
  }

  // Function to handle file change
  function handleFileChange(event) {
    setImage(event.target.files[0]);
    setImageUrlLocal(URL.createObjectURL(event.target.files[0]));
  }

  // Function to handle form input changes
  function handleChange(event) {
    setEventData((prevFormData) => {
      return { ...prevFormData, [event.target.name]: event.target.value };
    });
  }

  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
  }

  // Function to open tag popup
  function openTagPopup() {
    setIsPopupTagOpen(true);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.add("blurred");
      }
    );
  }

  // Function to close tag popup
  function closeTagPopup() {
    setIsPopupTagOpen(false);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.remove("blurred");
      }
    );
  }

  // Function to open location popup
  function openLocationPopup() {
    setIsPopupLocationOpen(true);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.add("blurred");
      }
    );
  }

  // Function to close location popup
  function closeLocationPopup() {
    setIsPopupLocationOpen(false);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.remove("blurred");
      }
    );
  }

  // Function to open available time popup
  function openAvailableTimePopup() {
    setIsAvailableTimePopup(true);
    [".event-creation-container", "#header", "#footer", "#side-bar"].forEach(
      (el) => {
        document.querySelector(el).classList.add("blurred");
      }
    );
  }

  // Function to close available time popup
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

  // Function to handle submit button click
  async function handleSubmitButton() {
    setIsSubmitting(true);
    // Validation: Check if all required fields are filled
    if (!isEditing) {
      if (
        !eventData.eventName ||
        !eventData.eventDescription ||
        !eventData.ticketPrice ||
        !eventData.capacity ||
        !eventData.eventDate ||
        !eventData.eventTime ||
        !eventData.eventLocation ||
        !selectedTags.length ||
        !image ||
        !eventData.availableTickets
      ) {
        // console.error("All fields must be filled out before submission.");
        // console.log("eventName missing:", eventData.eventName);
        // console.log("eventDescription missing:", eventData.eventDescription);
        // console.log("ticketPrice missing:", eventData.ticketPrice);
        // console.log("capacity missing:", eventData.capacity);
        // console.log("eventDate missing:", eventData.eventDate);
        // console.log("eventTime missing:", eventData.eventTime);
        // console.log("eventLocation missing:", eventData.eventLocation);
        // console.log("selectedTags empty:", selectedTags.length);
        // console.log("image missing:", image);
        // console.log("availableTickets missing:", eventData.availableTickets);

        fillFormMessage();
        setIsSubmitting(false);
        return; // Stop execution if any field is empty
      }
    }

    try {
      // Upload the image if present
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      let imageUrl = await getDownloadURL(imageRef);
      //console.log("Uploaded image:", imageUrl);

      // Book with Wiman API
      if (isEditing) {
        if (
          isEditing &&
          !(
            editingEvent.title === eventData.eventName &&
            new Date(editingEvent.date).toLocaleDateString() ===
              new Date(eventData.eventDate).toLocaleDateString() &&
            editingEvent.time === startTime &&
            editingEvent.endTime === endTime &&
            editingEvent.venue === eventData.eventLocation
          )
        ) {
          const cancelWiman = await fetch(
            `${WIMAN_API}/bookings/cancel/${editingEvent.bookingId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${wimanBearerKey}`,
              },
            }
          );
          const cancelData = await cancelWiman.json();
          console.log("Cancel data:", cancelData);
          console.log("Cancelling Wiman booking...");
          if (cancelWiman.ok) {
            console.log("Wiman booking cancelled successfully.");
          } else {
            toast.warning("Error cancelling Wiman booking. Please try again.");
            setIsSubmitting(false);
            return;
          }
        }
      }
      let skipWiman = false;
      if (
        isEditing &&
        editingEvent.title === eventData.eventName &&
        new Date(editingEvent.date).toLocaleDateString() ===
          new Date(eventData.eventDate).toLocaleDateString() &&
        editingEvent.time === startTime &&
        editingEvent.endTime === endTime &&
        editingEvent.venue === eventData.eventLocation
      ) {
        skipWiman = true;
        console.log("No changes detected. Skipping Wiman booking.");
      } else {
        const wimanBody = {
          date: isEditing ? eventData.eventDate : startDate,
          startTime: startTime,
          endTime: endTime,
          venueId: isEditing ? eventData.eventVenue.split(" ").pop() : venueId,
          eventName: eventData.eventName,
          repeatFrequency: "none",
          repeatUntil: isEditing ? eventData.eventDate : startDate,
        };
        //console.log("Wiman body:", wimanBody);
        var responseWiman = await fetch(`${WIMAN_API}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wimanBearerKey}`,
          },
          body: JSON.stringify(wimanBody),
        });

        var dataWiman = await responseWiman.json();
        console.log("Wiman booking data:", dataWiman);
      }
      console.log(skipWiman);
      if (skipWiman || responseWiman.ok) {
        // Prepare the event data to send to EVENTS API
        const bodyContent = JSON.stringify({
          organizerName: user.displayName,
          organizerId: user.uid,
          title: eventData.eventName,
          description: eventData.eventDescription,
          ticketPrice: Number(eventData.ticketPrice),
          capacity: Number(eventData.capacity),
          availableTickets: Number(eventData.availableTickets),
          date: eventData.eventDate,
          time: eventData.eventTime,
          endTime: endTime,
          imageUrl: isEditing
            ? editingEvent.imageUrl === imageUrlLocal
              ? editingEvent.imageUrl
              : imageUrl
            : imageUrl,
          tags: selectedTags,
          venue: eventData.eventLocation,
          likes: isEditing ? eventData.likes : 0,
          comments: isEditing ? eventData.comments : [],
          createdAt: isEditing ? eventData.createdAt : new Date().toISOString(),
          organizerImg: user.photoURL,
          bookingId: isEditing ? editingEvent.bookingId : dataWiman.bookingId,
        });

        // Send the POST/PUT request to the EVENTS API
        const response = await fetch(
          isEditing ? `${EVENTS_API}/${editingEvent.id}` : EVENTS_API,
          {
            method: isEditing ? "PUT" : "POST",
            headers: {
              Accept: "*/*",
              "User-Agent": "lively-campus",
              "Content-Type": "application/json",
            },
            body: bodyContent,
          }
        );

        if (response.ok) {
          console.log("Event successfully saved!");
          successMessage();
          setIsSubmitting(false);
        } else {
          errorMessage();
          setIsSubmitting(false);
          return;
        }
      } else {
        console.error(
          "Error booking venue with Wiman API:",
          responseWiman.status
        );
        errorMessage();
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Error during submission:", error);
      errorMessage();
      setIsSubmitting(false);
      return;
    }
  }

  useEffect(() => {
    const getVenues = async () => {
      const restaurantsMockData = [
        {
          venueId: "Zesti Lemonz",
          capacity: 200,
          buildingName: "The Matrix",
          campusName: "Wits West Campus",
          imageUrl: zesti, // Assuming `zesti` is a valid image URL or imported image
          type: "RESTAURANT",
          isUnderMaintenance: false,
          rating: 3.3,
          restaurant: true, // Fixed spelling
        },
        {
          venueId: "Olives and Plates",
          capacity: 200,
          buildingName: "The Matrix",
          campusName: "Wits West Campus",
          imageUrl: olives, // Assuming `olives` is a valid image URL or imported image
          type: "RESTAURANT",
          isUnderMaintenance: false,
          rating: 5,
          restaurant: true, // Fixed spelling
        },
        {
          venueId: "Chinese Lantern",
          capacity: 200,
          buildingName: "",
          campusName: "Wits East Campus",
          imageUrl: lantern, // Assuming `lantern` is a valid image URL or imported image
          type: "RESTAURANT",
          isUnderMaintenance: false,
          rating: null,
          restaurant: true, // Fixed spelling
        },
        {
          venueId: "Jimmy's",
          capacity: 200,
          buildingName: "The Matrix",
          campusName: "Wits West Campus",
          imageUrl: jimmy, // Assuming `jimmy` is a valid image URL or imported image
          type: "RESTAURANT",
          isUnderMaintenance: false,
          rating: 4.5,
          restaurant: true, // Fixed spelling
        },
      ];
  
      try {
        const response = await fetch(`${WIMAN_API}/venues`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wimanBearerKey}`,
          },
        });
        const json = await response.json();
        const combinedData = [...json, ...restaurantsMockData]; // Combine API data and mock data
        setAvailableVenues(combinedData);
        setFilteredVenues(combinedData);
        console.log(json);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setRenderWithMockData(true);
        setAvailableVenues(restaurantsMockData); // Use mock data in case of failure
        setFilteredVenues(restaurantsMockData); // Use mock data in case of failure
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

      // Helper function to format date as "YYYY-MM-DD"
      function formatDate(date) {
        return date.toISOString().split("T")[0];
      }

      function findAvailableTimeForDate(
        events,
        startDate,
        startTime = "00:00:00",
        endTime = "24:00:00"
      ) {
        const startOfDay = timeToMinutes(startTime); // Custom start time in minutes
        const endOfDay = timeToMinutes(endTime); // Custom end time in minutes

        const currentDateString = formatDate(new Date(startDate));

        // Extract occupied time slots for the selected date
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
        const availableIntervals = [];

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

        return availableIntervals;
      }

      try {
        const response = await fetch(
          `${WIMAN_API}/venues/${venueId}/reservations`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${wimanBearerKey}`,
            },
          }
        );
        const json = await response.json();
        setVenueAvailabilitySlots(findAvailableTimeForDate(json, startDate));
        console.log(json);
      } catch (error) {
        console.error("Error fetching venue availability:", error);

        // Mock data for testing
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
        setVenueAvailabilitySlots(findAvailableTimeForDate(events, startDate));
      }
    };

    if (venueId && startDate) {
      getVenueAvailability();
    }
  }, [venueId, startDate, wimanBearerKey]);

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

        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <div className="venue-card" key={venue.venueId}>
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
                    <img
                      src={locationSVG}
                      alt="Location icon"
                      height="25"
                      width="25"
                    />
                    <span>{`${venue.campusName} ${venue.buildingName} ${venue.venueId}`}</span>
                  </div>
                  <div className="logo-name">
                    <img src={person} alt="logo" height="25" width="25" />
                    <span>Max Capacity {venue.capacity}</span>
                  </div>
                  <div className="logo-name">
                    Type: <span>{venue.type}</span>
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
          ))
        ) : (
          <div>
            {renderWithMockData && (
              <div>
                <h2
                  style={{
                    textAlign: "center",
                    margin: "0 auto",
                    color: "red",
                    fontSize: "1rem",
                  }}
                >
                  Error Fetching Venues From Classroom and Infrastructure
                  Management, Please refresh the page
                </h2>

                <button
                  className="create-button centered"
                  onClick={() => {
                    setAvailableVenues(mockData);
                    setFilteredVenues(mockData);
                  }}
                >
                  Load mock data
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function AddVenueTimeContent() {
    const validateTimeSelection = () => {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${startDate}T${endTime}`);

      // Ensure end time is after start time
      if (startDateTime >= endDateTime) {
        setError("End time must be after start time.");
        setIsValidDateTime(false);
        return false;
      }

      // Check if the selected time is within available slots for the selected date
      for (const slot of venueAvailabilitySlots) {
        if (slot.date === startDate) {
          const slotStart = new Date(`${slot.date}T${slot.start}`);
          const slotEnd = new Date(`${slot.date}T${slot.end}`);

          // Check if the selected time range is within the slot
          if (startDateTime >= slotStart && endDateTime <= slotEnd) {
            setError("");
            return true;
          }
        }
      }

      // If no matching slot
      setError("The selected time is outside of available slots.");
      setIsValidDateTime(false);
      return false;
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Check if the time is valid before proceeding
      if (validateTimeSelection()) {
        closeAvailableTimePopup();
        setEventData((prevFormData) => {
          return {
            ...prevFormData,
            eventDate: startDate,
            eventTime: startTime,
            endTime: endTime,
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
              <span>Date</span>
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
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Available Slots
          </Typography>

          {startDate ? (
            venueAvailabilitySlots.length > 0 ? (
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
                    min={startTime || "00:00"} // Set min time to startTime, default to "00:00"
                  />
                </div>
              </div>
            ) : (
              <Typography variant="body1" style={{ marginTop: "10px" }}>
                No available time slots for the selected date.
              </Typography>
            )
          ) : (
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Please select a date.
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
            backgroundcolor="#003B5C"
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
                  min={0}
                />
              </div>

              <div className="venue-selected">
                <label
                  htmlFor={id + 7}
                  className="name-logo-title"
                  style={eventData.eventLocation ? { top: "-24px" } : {}}
                >
                  <span>Venue</span>
                  <img src={locationSVG} alt="location" />
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
                      {isEditing ? (
                        eventData.eventDate
                      ) : startDate === endDate ? (
                        <span>{startDate}</span>
                      ) : (
                        <span>{startDate}</span>
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
                  <div className="detail-input ">
                    <label htmlFor={id + "tic"} className="name-logo-title">
                      Available Tickets
                      <FaTicketAlt className="icon" height={20} width={20} />
                    </label>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="availableTickets"
                      value={eventData.availableTickets}
                      className={`${
                        (eventData.availableTickets < 0 ||
                          Number(eventData.availableTickets) >
                            Number(eventData.capacity)) &&
                        "input-error"
                      } ticket-price`}
                      id={id + "tic"}
                      required
                      min={0}
                      max={eventData.capacity}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="center-button">
                <button
                  className="create-button"
                  onClick={handleSubmitButton}
                  disabled={isSubmitting}
                >
                  {isEditing ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}
