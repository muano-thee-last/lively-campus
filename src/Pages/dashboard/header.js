import React, { useState, useEffect } from "react";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from "@mui/icons-material"; // MUI icons
import { useNavigate } from "react-router-dom";
import { IconButton, InputBase, Badge } from "@mui/material";
import logo from "./images-logos/logo.png";
import "./header.css";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const [pictureUrl, setPictureUrl] = useState("");
  const [showFilters] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const getPictureUrl = () => {
      setPictureUrl(user?.photoURL);
    };
    getPictureUrl();
  }, [pictureUrl]);

  const handleNotificationsClick = () => {
    navigate("/Notifications");
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

  return (
    <div id="header">
      <section className="header-right-section">
        <IconButton onClick={toggleSidebar}>
          <MenuIcon className="hamburger-logo pointer" />
        </IconButton>
        <img
          className="lively-campus-logo pointer"
          src={logo}
          alt="Livelycampus Logo"
          onClick={handleDashboardNavigation}
        />
        <h4 onClick={handleDashboardNavigation} className="pointer">
          Livelycampus
        </h4>
      </section>

      <section className="header-middle-section">
        <div className="search-bar">
          <InputBase
            className="search-input"
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton type="submit" className="search-button" style={{scale: "2.5"}}>
            {/* <SearchIcon /> */}
          </IconButton>
        </div>
        {showFilters && (
          <div className="filter-options">
            <h4>Filter by:</h4>
            <div className="filter-option">
              <label>Location:</label>
              <select>
                <option value="all">All</option>
                <option value="location1">Location 1</option>
                <option value="location2">Location 2</option>
              </select>
            </div>
            <div className="filter-option">
              <label>Type:</label>
              <select>
                <option value="all">All</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
              </select>
            </div>
          </div>
        )}
      </section>

      <section className="header-left-section">
        <IconButton onClick={handleNotificationsClick}>
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon className="pointer" />
          </Badge>
        </IconButton>
        <IconButton onClick={() => navigate("/profile")}>
          {pictureUrl ? (
            <img
              className="lively-campus-profile pointer"
              src={pictureUrl}
              alt="Profile"
              style={{ borderRadius: "50%", width: 40, height: 40 }}
            />
          ) : (
            <AccountCircleIcon className="pointer" style={{ fontSize: 40 }} />
          )}
        </IconButton>
      </section>
    </div>
  );
}

export default Header;

