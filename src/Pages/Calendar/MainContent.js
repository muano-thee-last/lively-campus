import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './MainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import CalendarPopUpCard from './components/CalendarPopUpCard';

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [userTicketedEvents, setUserTicketedEvents] = useState([]);
  const calendarRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Start from Sunday

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        
        // Fetch user's ticketed events
        const userID = sessionStorage.getItem("uid");
        if (userID) {
          try {
            const ticketResponse = await fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/getTicketsx/${userID}`);
            if (ticketResponse.ok) {
              const ticketData = await ticketResponse.json();
              
              // Filter out tickets with "Title not found" and map to event IDs
              const validTicketEventIds = ticketData
                .filter(ticket => ticket.eventTitle !== "Title not found")
                .map(ticket => ticket.eventId);

              // Filter events to only include those the user has tickets for
              const ticketedEvents = data.filter(event => validTicketEventIds.includes(event.id));
              setUserTicketedEvents(ticketedEvents);
            } else {
              console.log('No tickets found for user or user not logged in');
              setUserTicketedEvents([]);
            }
          } catch (error) {
            console.error('Error fetching user tickets:', error);
            setUserTicketedEvents([]);
          }
        } else {
          console.log('User not logged in, skipping ticket fetch');
          setUserTicketedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setUserTicketedEvents([]);
      }
    };

    fetchEvents();

    // Get the current user from sessionStorage
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    console.log('Current date changed:', currentDate);
  }, [currentDate]);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    const newDate = new Date(currentYear, newMonth, 1);
    console.log('Changing month to:', newDate);
    setCurrentDate(newDate);
  };

  const handleFilterDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    setFilterDate(e.target.value);
    setCurrentDate(newDate);
  };
  const handleFilterTypeChange = (e) => setFilterType(e.target.value);
  const handleFilterLocationChange = (e) => setFilterLocation(e.target.value);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const matchesDate = filterDate ? eventDate.toDateString() === new Date(filterDate).toDateString() : true;
    
    // Check if the event's tags include the selected filter type
    const matchesType = filterType ? (event.tags && event.tags.some(tag => tag.toLowerCase() === filterType.toLowerCase())) : true;
    
    // Update this line to use the venue field and handle undefined cases
    const matchesLocation = filterLocation ? (event.venue && event.venue.toLowerCase().includes(filterLocation.toLowerCase())) : true;
    
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

  const isUserEvent = (event) => {
    return currentUser && event.organizerName === currentUser.displayName;
  };

  const isTicketedEvent = (event) => {
    return userTicketedEvents.some(te => te.id === event.id);
  };

  // Update dayHasEvents to check for both user events and ticketed events
  const dayHasEvents = (day, month, year) => {
    return filteredEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  const dayHasUserEvents = (day, month, year) => {
    return filteredEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year &&
             isUserEvent(event);
    });
  };

  const dayHasTicketedEvents = (day, month, year) => {
    return userTicketedEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  // Update the renderMiniCalendar function
  const renderMiniCalendar = () => {
    const miniCalendarDate = new Date(currentDate);
    const miniCalendarMonth = miniCalendarDate.getMonth();
    const miniCalendarYear = miniCalendarDate.getFullYear();
    const miniCalendarDaysInMonth = new Date(miniCalendarYear, miniCalendarMonth + 1, 0).getDate();
    const miniCalendarFirstDayOfMonth = new Date(miniCalendarYear, miniCalendarMonth, 1).getDay();

    const miniCalendarDays = [...Array(miniCalendarDaysInMonth).keys()].map(day => day + 1);
    const paddedDays = [...Array(miniCalendarFirstDayOfMonth).fill(null), ...miniCalendarDays];
    
    return (
      <div className="mini-calendar">
        <div className="mini-calendar-row">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <span key={`header-${index}`}>{day}</span>
          ))}
        </div>
        <div className="mini-calendar-dates">
          {paddedDays.map((day, index) => {
            const isToday = day === today.getDate() && miniCalendarMonth === today.getMonth() && miniCalendarYear === today.getFullYear();
            const hasEvents = day && dayHasEvents(day, miniCalendarMonth, miniCalendarYear);
            const hasUserEvents = day && dayHasUserEvents(day, miniCalendarMonth, miniCalendarYear);
            const hasTicketedEvents = day && dayHasTicketedEvents(day, miniCalendarMonth, miniCalendarYear);
            const isSelectedDate = filterDate && day === new Date(filterDate).getDate();

            return (
              <div 
                key={`mini-${index}`} 
                className={`mini-date 
                  ${isToday ? 'highlight-today' : ''}
                  ${hasEvents ? 'has-events' : ''}
                  ${hasUserEvents ? 'has-user-events' : ''}
                  ${hasTicketedEvents ? 'has-ticketed-events' : ''}
                  ${isSelectedDate ? 'selected-date' : ''}`}
              >
                {day}
              </div>
            );
          })}
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

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
  };

  const handleClosePopup = () => {
    setSelectedDate(null);
  };

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    }).map(event => ({
      ...event,
      isTicketed: isTicketedEvent(event),
      isUserEvent: isUserEvent(event)
    }));
  };

  const isPastEvent = (eventDate) => {
    return new Date(eventDate) < new Date().setHours(0, 0, 0, 0);
  };

  // Function to handle swipe gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      console.log('Swipe detected. Start:', touchStartX, 'End:', touchEndX);
      if (touchStartX - touchEndX > 50) {
        // Swipe left, go to next month
        setCurrentDate(prevDate => {
          const nextMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
          console.log('Swiping to next month:', nextMonth);
          return nextMonth;
        });
      }
      if (touchEndX - touchStartX > 50) {
        // Swipe right, go to previous month
        setCurrentDate(prevDate => {
          const prevMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
          console.log('Swiping to previous month:', prevMonth);
          return prevMonth;
        });
      }
    };

    const calendar = calendarRef.current;
    if (calendar) {
      calendar.addEventListener('touchstart', handleTouchStart);
      calendar.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (calendar) {
        calendar.removeEventListener('touchstart', handleTouchStart);
        calendar.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentMonth, currentYear]);

  return (
    <div className="calendar-container">
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="month-header">
            <span className='current-month'>{months[currentMonth]} </span>
            <span className='current-year'>{currentYear}</span>
          </div>

          {renderMiniCalendar()}

          <div className="filters">
            <h4>Filters</h4>
            <label htmlFor="date-filter">Date Filter</label>
            <input 
              id="date-filter"
              type="date" 
              value={filterDate} 
              onChange={handleFilterDateChange} 
              max={new Date().toISOString().split('T')[0]}
            />
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
                    <Link to={`/view-more-details/${event.id}`}>
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
      </div>

      <div className="calendar" ref={calendarRef} data-testid="calendar-container">
        <div className="calendar-header">
          <h2 className='viewing-month' data-testid="viewing-month">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <select 
            className='select-month' 
            onChange={handleMonthChange} 
            value={currentDate.getMonth()}
            aria-label="Select month"
          >
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
            const currentDayEvents = getEventsForDate(new Date(currentYear, currentMonth, day + 1));
            const isTodayDate = day + 1 === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isPastDayDate = new Date(currentYear, currentMonth, day + 1) < new Date().setHours(0, 0, 0, 0);
            const hasTicketedEventsForDay = currentDayEvents.some(event => isTicketedEvent(event));
            const hasUserEventsForDay = currentDayEvents.some(event => isUserEvent(event));

            return (
              <div 
                key={day} 
                className={`day ${isTodayDate ? 'highlight-day' : ''} 
                  ${hasTicketedEventsForDay ? 'has-ticketed-events' : ''}
                  ${hasUserEventsForDay ? 'has-user-events' : ''}
                  ${isPastDayDate ? 'past-day' : ''}`}
                onClick={() => handleDateClick(day + 1)}
              >
                <span className="day-number">{day + 1}</span>
                {currentDayEvents.length > 0 && (
                  <div className="events-container">
                    {currentDayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={`event-details 
                          ${isPastEvent(event.date) ? 'past-event' : ''} 
                          ${isTicketedEvent(event) ? 'ticketed-event' : ''}
                          ${isUserEvent(event) ? 'user-event' : ''}`} 
                        title={`${event.title} - ${formatEventDateTime(event.date)}`}
                      >
                        <span className="event-title">{event.title}</span>
          
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <CalendarPopUpCard
          date={selectedDate.toDateString()}
          events={getEventsForDate(selectedDate)}
          onClose={handleClosePopup}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default MainContent;