import React from 'react'

const ConfirmRide = (props) => {
  return (
    <div>
      <h5 onClick={() => {
          props.setConfirmRidePanel(false)
        }} className="p-1 text-center absolute w-[93%] top-0 "><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>

        <h3 className="text-lg font-semibold mb-5">Confirm your Ride</h3>
    
        <div className='flex gap-2 justify-between flex-col items-center'>
            <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className='text-lg ri-map-pin-user-fill'></i>
                    <div>
                        <p className='text-lg font-medium'>{props.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className='text-lg ri-map-pin-2-fill'></i>
                    <div>
                        <p className='text-lg font-medium'>{props.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className='text-lg ri-currency-line'></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>
            <button onClick={()=>{
                props.setVehicleFound(true)
                props.setConfirmRidePanel(false)
                props.createRide()
            }} className='w-full mt-5 text-white font-semibold p-2 rounded-lg bg-green-600'>
                Confirm
            </button>
        </div>
    </div>
  )
}

export default ConfirmRide
