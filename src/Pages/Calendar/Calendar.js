// CustomCalendar.jsx
import React, { useState } from 'react';
import './Calendar.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    { date: '2024-01-08', title: 'BEER GARDEN', time: '17:00' },
    { date: '2024-01-09', title: 'BEER GARDEN', time: '17:00' },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get the days in the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Function to handle events for a specific date
  const getEventsForDate = (date) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter((event) => event.date === dateString);
  };

  const generateCalendar = () => {
    const days = [];
    const leadingEmptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Mon-Sun start

    // Push empty cells for days before the start of the month
    for (let i = 0; i < leadingEmptyDays; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Push cells for each day in the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const eventsForDay = getEventsForDate(day);
      days.push(
        <div key={day} className="calendar-day">
          <span className="day-number">{day}</span>
          <ul className="events">
            {eventsForDay.length > 0 ? (
              eventsForDay.map((event, index) => (
                <li key={index} className="event">
                  {event.title} - {event.time}
                </li>
              ))
            ) : null}
          </ul>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="calendar-day-header">
            {day}
          </div>
        ))}
        {generateCalendar()}
      </div>
    </div>
  );
}

export default Calendar;
