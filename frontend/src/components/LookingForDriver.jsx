import React from 'react'

const LookingForDriver = (props) => {
  return (
    <div>
      <h5 onClick={() => {
          props.setVehicleFound(false)
        }} className="p-1 text-center absolute w-[93%] top-0 "><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>

        <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>
    
        <div className='flex gap-2 justify-between flex-col items-center'>
            <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className='text-lg ri-map-pin-user-fill'></i>
                    <div>
                        <h3 className='text-lg font-medium text-gray-600'>{props.pickup}</h3>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className='text-lg ri-map-pin-2-fill'></i>
                    <div>
                        <h3 className='text-lg font-medium text-gray-600'>{props.destination}</h3>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className='text-lg ri-currency-line'></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LookingForDriver
