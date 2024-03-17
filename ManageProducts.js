import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const ManageProducts = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [cycleDetails, setCycleDetails] = useState({});

  const trackUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        // Send user's location to the backend
        socket.emit('updateLocation', { userId: 'uniqueUserId', latitude, longitude });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  useEffect(() => {
    // Listen for location updates from the backend
    socket.on('locationUpdate', (updatedUserLocations) => {
      setUserLocation(updatedUserLocations['uniqueUserId']); // Assuming 'uniqueUserId' is used as the user identifier
    });

    // Listen for cycle details from the backend
    socket.on('cycleDetails', (details) => {
      setCycleDetails((prevDetails) => ({
        ...prevDetails,
        [details.cycleId]: details.details,
      }));
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCycleDetails = (cycleId) => {
    // Predefined details for each cycle
    const predefinedDetails = {
   
        'Cycle 1': 'Cycle 1 details: currently in thambaram.',
        'Cycle 2': 'Cycle 2 details: still for 20 mins near the buhari hotel',
        'Cycle 3': 'Cycle 3 details: near beach station'
      
      
    };

    // Set the predefined details for the specified cycle
    setCycleDetails((prevDetails) => ({
      ...prevDetails,
      [cycleId]: predefinedDetails[cycleId],
    }));
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <div>
        <h3>User Tracker</h3>
        <button onClick={trackUserLocation}>Track User Location</button>
        {userLocation && (
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  Your current location. <br /> Latitude: {userLocation.lat}, Longitude: {userLocation.lng}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
      <div>
        <h3>Cycle Details</h3>
        <button onClick={() => handleCycleDetails('Cycle 1')}>Cycle 1 Details</button>
        <button onClick={() => handleCycleDetails('Cycle 2')}>Cycle 2 Details</button>
        <button onClick={() => handleCycleDetails('Cycle 3')}>Cycle 3 Details</button>
        {Object.entries(cycleDetails).map(([cycleId, details]) => (
          <div key={cycleId}>
            <h4>{cycleId}</h4>
            <p>{details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;