import React, { useState, useRef, useEffect } from "react";
import "../EventCreation/styles/main-content.css";
import "../EventCreation/styles/Profile.css";
import genderLogo from "../EventCreation/images-logos/gender-male.svg";
import birthdayLogo from "../EventCreation/images-logos/birthday.svg";
import emailLogo from "../EventCreation/images-logos/email.svg";
import phoneLogo from "../EventCreation/images-logos/phone.svg";
import witsBackground from "../EventCreation/images-logos/wits-background.png";
import profile from "../EventCreation/images-logos/profile-logo.jpg";
import comments from "../EventCreation/images-logos/comments.jpeg";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";
import MainContent from "../dashboard/main-content";
export default function Profile() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  console.log(user);
  const userData = {
    name: user.displayName,
    myImg: user.photoURL,
    title: "Student",
    gender: "Male",
    birthday: "01/01/2001",
    email: user.email,
    phone: "1234567890",
  }; //this data must be fetched from the session storage

  const { myImg, name, title, gender, birthday, email, phone } = userData;

  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState([]);
  const upcomingSlider = useRef(null);

  useEffect(() => {
    fetch("https://us-central1-witslivelycampus.cloudfunctions.net/app/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLiked(new Array(data.length).fill(false));
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        // You might want to set an error state here to display a message to users
      });
  }, []);

  const handleScroll = (slider, direction) => {
    if (slider.current) {
      const cardWidth = slider.current.querySelector(".card").offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleLike = (index) => {
    setLiked((prev) => {
      const updatedLiked = [...prev];
      updatedLiked[index] = !updatedLiked[index];
      return updatedLiked;
    });
  };
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    console.log(sessionStorage.getItem("uid"));
  };
  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <SideBar isSidebarOpen={isSidebarOpen} />
        <div className="profile">
          <div className="wits-background-picture">
            <img src={witsBackground} className="wits-background" />
          </div>
          <div className="picture-container">
            <img src={myImg} className="profile-picture" alt="profile-pic" />
            <div className="user-info">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
          <div className="about-section">
            <h2 className="bold-title">About</h2>
            <div className="details-container">
              <div>
                <img src={genderLogo} />
                <span>{gender}</span>
              </div>
              <div>
                <img src={birthdayLogo} />
                <span>{birthday}</span>
              </div>
              <div>
                <img src={emailLogo} />
                <span>{email}</span>
              </div>
              <div>
                <img src={phoneLogo} />
                <span>{phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
