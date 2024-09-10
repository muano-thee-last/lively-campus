import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainContent.css';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MainContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

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

  // Filter events for the current month and year
  const eventsInCurrentMonth = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  // Calculate the number of days needed to fill the calendar grid
  const totalDays = firstDayOfMonth + daysInMonth;
  const emptyDaysAfter = (7 - (totalDays % 7)) % 7;

  // Sort events by date
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show only the next 5 events

  return (
    <div className="calendar-container">
      <div className="sidebar">
        <div className="month-header">
          <p className='current-month'>{months[currentMonth]}</p>
          <p className='current-year'>{currentYear}</p>
        </div>

        <div className="mini-calendar">
          <div className="mini-calendar-row">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="mini-calendar-dates">
            {/* Align start of month */}
            {Array(firstDayOfMonth).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="mini-date empty"></div>
            ))}
            {/* Display correct number of days */}
            {[...Array(daysInMonth).keys()].map(day => (
              <div key={day} className={`mini-date ${day + 1 === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'highlight' : ''}`}>
                {day + 1}
              </div>
            ))}
            {/* Fill remaining days to complete the week */}
            {Array(emptyDaysAfter).fill(null).map((_, i) => (
              <div key={`end-empty-${i}`} className="mini-date empty"></div>
            ))}
          </div>
        </div>

        <div className="upcoming-events">
          <h4>Upcoming Events</h4>
          <ul>
            {upcomingEvents.map(event => (
              <li key={event.id} className="upcoming-event">
                <Link to={`/details/${event.id}`}>
                  <span>{event.title}</span> - <span>{new Date(event.date).toLocaleDateString()}</span> - <span>{new Date(event.date).toLocaleTimeString()}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          <h2 className='viewing-month'>{months[currentMonth]}</h2>
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

          {/* Empty slots for days before the first of the month */}
          {Array(firstDayOfMonth).fill(null).map((_, index) => (
            <div key={`empty-${index}`} className="day empty"></div>
          ))}

          {/* Render calendar days with events */}
          {[...Array(daysInMonth).keys()].map(day => {
            const dayEvents = eventsInCurrentMonth.filter(event => {
              const eventDate = new Date(event.date).getDate();
              return eventDate === day + 1;
            });

            return (
              <div key={day} className={`day ${day + 1 === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'highlight-day' : ''}`}>
                <span>{day + 1}</span>
                {/* Render events on this day */}
                {dayEvents.length > 0 && (
                  <div className="events-container">
                    {dayEvents.map(event => (
                      <Link key={event.id} to={`/details/${event.id}`}>
                        <div className="event-details">
                          <span className="event-title">{event.title}</span>
                          <span className="event-time">{new Date(event.date).toLocaleTimeString()}</span>
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






