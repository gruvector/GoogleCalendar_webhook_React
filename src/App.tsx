import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the type for Google Calendar event
interface CalendarEvent {
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  description: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Step 1: Check if the user is authenticated
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  // Step 2: Redirect the user to start the OAuth2 login process
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth'; // Redirect to backend's auth route
  };

  // Step 3: Fetch events from Google Calendar
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CalendarEvent[]>('http://localhost:3000/calendar', { withCredentials: true });
      setEvents(response.data); // Store the events in the state
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Error fetching events. Please check your authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Google Calendar Integration</h1>

      {!isAuthenticated ? (
        <div>
          <p>To access your Google Calendar, please log in with your Google account:</p>
          <button onClick={handleLogin} id="login-button">
            Login with Google
          </button>
        </div>
      ) : (
        <div>
          <button onClick={fetchEvents} id="fetch-events-button" disabled={loading}>
            {loading ? 'Loading Events...' : 'Fetch Events'}
          </button>

          <div id="events">
            {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                  <li key={index}>
                    <strong>{event.summary}</strong>
                    <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                    <p>{event.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
