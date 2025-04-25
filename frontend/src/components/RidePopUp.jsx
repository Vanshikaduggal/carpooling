import React, { useState, useEffect } from "react";
import { LoadScript, DistanceMatrixService } from '@react-google-maps/api';

const RidePopUp = (props) => {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!props.ride) return;

    // Calculate distance and duration using Google Maps Distance Matrix Service
    const calculateDistance = () => {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [props.ride.pickup],
          destinations: [props.ride.destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            const result = response.rows[0].elements[0];
            setDistance(result.distance.text);
            setDuration(result.duration.text);
          }
        }
      );
    };

    calculateDistance();
  }, [props.ride]);

  return (
    <div>
      <h5
        onClick={() => {
          props.setRidePopupPanel(false);
        }}
        className="p-1 text-center absolute w-[93%] top-0 "
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3tzGh_8fgG0kuFPxwh_vvey4zzlrDz5nz7A&s"
            alt=""
          />
          <h2 className="text-lg font-medium">{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
        </div>
        <div className="text-right">
          <h5 className="text-lg font-semibold">{distance || 'Calculating...'}</h5>
          <p className="text-sm text-gray-700">{duration || ''}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Estimated Fare</p>
            </div>
          </div>
        </div>
        <div className='mt-5 w-full '>
          <button 
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide();
            }} 
            className='bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'
          >
            Accept
          </button>
          <button 
            onClick={() => {
              props.setRidePopupPanel(false);
            }} 
            className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg'
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
