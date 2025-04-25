import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

const FinishRide = (props) => {
  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)

  async function endRide() {
    try {
      // First get the final distance and fare calculation
      const distanceResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/calculate-final`, {
        params: {
          rideId: props.ride._id
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const finalData = distanceResponse.data;

      // End the ride with final calculations
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
        rideId: props.ride._id,
        finalDistance: finalData.distance,
        finalFare: finalData.fare
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.status === 200) {
        // Emit ride completed event with final data
        socket.emit('ride-completed', {
          rideId: props.ride._id,
          fare: finalData.fare,
          distance: finalData.distance,
          timestamp: new Date().toISOString()
        })

        // Small delay to ensure socket event is processed
        setTimeout(() => {
          navigate('/captain-home')
        }, 500)
      }
    } catch (error) {
      console.error('Error ending ride:', error)
      alert('Error completing ride. Please try again.')
    }
  }

  return (
    <div>
      <h5
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
        className="p-1 text-center absolute w-[93%] top-0 "
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">
        Finish this ride 
      </h3>
      <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-10 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3tzGh_8fgG0kuFPxwh_vvey4zzlrDz5nz7A&s"
            alt=""
          />
          <div>
            <h2 className="text-lg font-medium">{props.ride?.user.fullname.firstname}</h2>
            <p className="text-sm text-gray-600">Passenger</p>
          </div>
        </div>
        <div className="text-right">
          <h5 className="text-lg font-semibold">{props.ride?.distance || 'Calculating...'} KM</h5>
          <p className="text-sm text-gray-600">Distance</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Distance</span>
          <span className="font-medium">{props.ride?.distance || 'Calculating...'} KM</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Fare</span>
          <span className="font-medium">₹{props.ride?.fare || 'Calculating...'}</span>
        </div>
      </div>

      <div className="mt-4">
        <button 
          onClick={endRide}
          className="w-full bg-green-600 text-white font-semibold p-3 rounded-lg"
        >
          Complete Ride
        </button>
      </div>
    </div>
  )
}

export default FinishRide
