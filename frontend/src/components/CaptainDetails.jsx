import React, { useContext, useState, useEffect, useCallback } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext)
  const { socket } = useContext(SocketContext)
  const [stats, setStats] = useState({
    onlineTime: 0,
    distanceCovered: 0,
    totalEarnings: 0,
    ridesCompleted: 0,
    startTime: Date.now()
  })

  // Fetch stats from server
  const fetchStats = useCallback(async () => {
    if (!captain?._id) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        setStats(prev => ({
          ...prev,
          totalEarnings: response.data.totalEarnings || 0,
          ridesCompleted: response.data.ridesCompleted || 0,
          distanceCovered: response.data.totalDistance || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching captain stats:', error);
    }
  }, [captain?._id]);

  // Initial fetch of stats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Track online time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineTime: ((Date.now() - prev.startTime) / (1000 * 60 * 60)).toFixed(1)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for ride completion events
  useEffect(() => {
    if (!socket || !captain) return;

    const handleRideComplete = async (data) => {
      console.log('Ride completed event received:', data);
      
      // Update stats immediately for responsive UI
      setStats(prev => ({
        ...prev,
        totalEarnings: parseFloat(prev.totalEarnings || 0) + parseFloat(data.fare || 0),
        ridesCompleted: parseInt(prev.ridesCompleted || 0) + 1,
        distanceCovered: (parseFloat(prev.distanceCovered || 0) + parseFloat(data.distance || 0)).toFixed(1)
      }));

      // Fetch latest stats from server to ensure accuracy
      await fetchStats();
    };

    socket.on('ride-completed', handleRideComplete);

    return () => {
      socket.off('ride-completed', handleRideComplete);
    };
  }, [socket, captain, fetchStats]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
            alt=""
          />
          <h4 className="text-lg font-medium capitalize">
            {captain?.fullname.firstname} {captain?.fullname.lastname}
          </h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">
            ₹{parseFloat(stats.totalEarnings || 0).toFixed(1)}
          </h4>
          <p className="text-sm text-gray-600">Total Earnings</p>
        </div>
      </div>
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">{stats.onlineTime || '0.0'}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-road-map-line"></i>
          <h5 className="text-lg font-medium">{parseFloat(stats.distanceCovered || 0).toFixed(1)}</h5>
          <p className="text-sm text-gray-600">KM Covered</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-car-line"></i>
          <h5 className="text-lg font-medium">{stats.ridesCompleted || 0}</h5>
          <p className="text-sm text-gray-600">Rides Completed</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainDetails
