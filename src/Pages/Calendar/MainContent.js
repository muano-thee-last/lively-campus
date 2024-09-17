import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Update eventTypes to match the tags in your database
const eventTypes = [
  'Seminar', 'Conference', 'Workshop', 'Sports', 'Music', 'Dance',
  'Celebration', 'Fundraising', 'Networking', 'Educational', 'Club Meeting'
];

const MainContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Start from Sunday

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
        const data = await response.json();
        console.log('Fetched events:', data);
        // Log unique event types
        const uniqueTypes = [...new Set(data.map(event => event.type))];
        console.log('Unique event types:', uniqueTypes);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    const newDate = new Date(currentYear, newMonth, 1);
    setCurrentDate(newDate);
  };

  const handleFilterDateChange = (e) => setFilterDate(e.target.value);
  const handleFilterTypeChange = (e) => setFilterType(e.target.value);
  const handleFilterLocationChange = (e) => setFilterLocation(e.target.value);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const matchesDate = filterDate ? eventDate.toDateString() === new Date(filterDate).toDateString() : true;
    
    // Check if the event's tags include the selected filter type
    const matchesType = filterType ? event.tags.some(tag => tag.toLowerCase() === filterType.toLowerCase()) : true;
    
    // Update this line to use the venue field
    const matchesLocation = filterLocation ? event.venue.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    return matchesDate && matchesType && matchesLocation;
  });

  // Log the filtered events
  console.log('Filtered events:', filteredEvents);

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show only the next 5 events

  const formatEventDateTime = (date) => {
    const eventDate = new Date(date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate}, ${formattedTime}`;
  };

  const formatEventTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // New function to check if a day has events
  const dayHasEvents = (day) => {
    return filteredEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    });
  };

  const renderMiniCalendar = () => {
    const miniCalendarDays = [...Array(daysInMonth).keys()].map(day => day + 1);
    const paddedDays = [...Array(firstDayOfMonth).fill(null), ...miniCalendarDays];
    
    return (
      <div className="mini-calendar">
        <div className="mini-calendar-row">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <span key={`header-${index}`}>{day}</span>
          ))}
        </div>
        <div className="mini-calendar-dates">
          {paddedDays.map((day, index) => (
            <div 
              key={`mini-${index}`} 
              className={`mini-date ${
                day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() 
                  ? 'highlight' 
                  : day && dayHasEvents(day) 
                    ? 'has-events' 
                    : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // New function to get today's events
  const getTodayEvents = () => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === today.toDateString();
    });
  };

  return (
    <div className="calendar-container">
      <div className="sidebar">
        <div className="month-header">
          <span className='current-month'>{months[currentMonth]} </span>
          <span className='current-year'>{currentYear}</span>
        </div>

        {renderMiniCalendar()}

        <div className="filters">
          <h4>Filters</h4>
          <input type="date" value={filterDate} onChange={handleFilterDateChange} />
          <select value={filterType} onChange={handleFilterTypeChange}>
            <option value="">All Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="location" 
            value={filterLocation} 
            onChange={handleFilterLocationChange} 
          />
        </div>

        <div className="today-events">
          <h4>
            <FontAwesomeIcon icon={faCalendarAlt} /> Today
          </h4>
          {getTodayEvents().length > 0 ? (
            <ul className="today-event-list">
              {getTodayEvents().map(event => (
                <li key={event.id} className="today-event">
                  <Link to={`/details/${event.id}`}>
                    <div className="today-event-title">{event.title}</div>
                    <div className="today-event-time">{formatEventTime(event.date)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className='no-events-today'>No events today</p>
          )}
        </div>

        <div className="upcoming-events">
          <h4>
            <FontAwesomeIcon icon={faCalendarAlt} /> Upcoming Events
          </h4>
          {upcomingEvents.length > 0 ? (
            <ul className="upcoming-event-list">
              {upcomingEvents.map(event => (
                <li key={event.id} className="upcoming-event">
                  <Link to={`/details/${event.id}`}>
                    <div className="upcoming-event-title">{event.title}</div>
                    <div className="upcoming-event-datetime">{formatEventDateTime(event.date)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className='no-events'>No upcoming events</p>
          )}
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          <h2 className='viewing-month'>{months[currentMonth]} {currentYear}</h2>
          <select className='select-month' onChange={handleMonthChange} value={currentMonth}>
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-name">{day}</div>
          ))}

          {Array(firstDayOfMonth).fill(null).map((_, index) => (
            <div key={`empty-${index}`} className="day"></div>
          ))}

          {[...Array(daysInMonth).keys()].map(day => {
            const dayEvents = filteredEvents.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getDate() === day + 1 && 
                     eventDate.getMonth() === currentMonth && 
                     eventDate.getFullYear() === currentYear;
            });

            const isToday = day + 1 === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

            return (
              <div key={day} className={`day ${isToday ? 'highlight-day' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                <span className="day-number">{day + 1}</span>
                {dayEvents.length > 0 && (
                  <div className="events-container">
                    {dayEvents.map(event => (
                      <Link key={event.id} to={`/details/${event.id}`}>
                        <div className="event-details" title={`${event.title} - ${formatEventDateTime(event.date)}`}>
                          <span className="event-title">{event.title}</span>
                          <span className="event-time">{formatEventTime(event.date)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainContent;






