import React, { useState, useEffect } from 'react';
import './Calendar.css';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // To align the start of the month correctly

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

  // Handle month change
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(currentYear, newMonth, 1);
    setCurrentDate(newDate);
  };

  // Filter events for the current month and year
  const eventsInCurrentMonth = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  return (
    <div className="calendar-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="month-header">
          <p className='current-month'>{months[currentMonth]}</p>
          <p className='current-year'>{currentYear}</p>
        </div>

        <div className="mini-calendar">
          {/* Mini calendar dates */}
          <div className="mini-calendar-row">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
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
          </div>
        </div>

        <div className="upcoming-events">
          <h4>Upcoming Events</h4>
          
        </div>
      </div>

      {/* Main Calendar */}
      <div className="calendar">
        <div className="calendar-header">
          <h2 className='viewing-month'>{months[currentMonth]}</h2>
          <select onChange={handleMonthChange} value={currentMonth}>
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>

        <div className="calendar-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
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
                {dayEvents.map(event => (
                  <div key={event.id} className="event-details">
                    <span>{event.title}</span>
                    <span>{new Date(event.date).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;




