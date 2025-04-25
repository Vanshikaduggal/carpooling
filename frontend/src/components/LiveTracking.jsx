import React, { useState, useEffect, useContext } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'

const containerStyle = {
    width: '100%',
    height: '100%',
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    useEffect(() => {
        if (!captain) return;

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setCurrentPosition(location);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            }
        };

        // Initial position update
        updateLocation();

        // Set up watch position for real-time updates
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCurrentPosition(location);
            },
            (error) => {
                console.error('Error watching position:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        // Cleanup
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [captain]);

    if (!currentPosition) {
        return <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <p>Loading map...</p>
        </div>;
    }

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
                options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                <Marker
                    position={currentPosition}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
};

export default LiveTracking;