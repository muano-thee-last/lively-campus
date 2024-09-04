import React from "react";
import "../EventCreation/styles/main-content.css";
import "../EventCreation/styles/Profile.css";
import genderLogo from "../EventCreation/images-logos/gender-male.svg";
import birthdayLogo from "../EventCreation/images-logos/birthday.svg";
import emailLogo from "../EventCreation/images-logos/email.svg";
import phoneLogo from "../EventCreation/images-logos/phone.svg";
import witsBackground from "../EventCreation/images-logos/wits-background.png";
import Header from "../dashboard/header";
import SideBar from "../dashboard/side-bar";

export default function Profile() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  const userData = {
    name: user.displayName,
    myImg: user.photoURL,
    title: "Student",
    gender: "many-genders-issue",
    birthday: "to-be-added",
    email: user.email,
    phone: "to-be-added",
  }; //this data must be fetched from the session storage

  const { myImg, name, title, gender, birthday, email, phone } = userData;

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
            <img src={witsBackground} className="wits-background" alt="background"/>
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
                <img src={genderLogo} alt="gender" />
                <span>{gender}</span>
              </div>
              <div>
                <img src={birthdayLogo} alt="dob" />
                <span>{birthday}</span>
              </div>
              <div>
                <img src={emailLogo} alt="email" />
                <span>{email}</span>
              </div>
              <div>
                <img src={phoneLogo} alt="phone"/>
                <span>{phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
