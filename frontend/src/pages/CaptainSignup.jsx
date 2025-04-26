import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [vehicleColor, setVehicleColor] = useState('')
    const [vehiclePlate, setVehiclePlate] = useState('')
    const [vehicleCapacity, setVehicleCapacity] = useState('')
    const [vehicleType, setVehicleType] = useState('')
    const { captain, setCaptain } = React.useContext(CaptainDataContext)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_CAPTAIN);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            setProfileImage(response.data.secure_url);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };
    
    const submitHandler = async (e) => {
        e.preventDefault();
    
        const captainData = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password,
            profileImage: profileImage,
            vehicle: {
                color: vehicleColor,
                plate: vehiclePlate,
                capacity: vehicleCapacity,
                vehicleType: vehicleType
            }
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
        
            if (response.status === 201) {
                const data = response.data
                setCaptain(data.captain)
                localStorage.setItem('token', data.token)
                navigate('/captain-home')
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Failed to create account. Please try again.');
        }

        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setVehicleColor('');
        setVehiclePlate('');
        setVehicleCapacity('');
        setVehicleType('');
        setProfileImage(null);
    }

    return (
        <div className='py-5 px-5 h-screen flex flex-col justify-between'>
            <div>
                <img 
                    className='w-16 mb-10'
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
                    alt="Logo"
                />
                <form onSubmit={submitHandler}>
                    <h3 className='text-lg w-full font-medium mb-2'>What's our Captain's name</h3>
                    <div className='flex gap-4 mb-7'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='First name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='Last name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        type="email"
                        placeholder='email@example.com'
                    />

                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        type="password"
                        placeholder='password'
                    />

                    <h3 className='text-lg font-medium mb-2'>Profile Image</h3>
                    <div className='mb-7'>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className='w-full'
                        />
                        {uploading && <p className='text-sm text-gray-600'>Uploading image...</p>}
                        {profileImage && (
                            <div className='mt-2'>
                                <img 
                                    src={profileImage} 
                                    alt="Profile preview" 
                                    className='w-20 h-20 rounded-full object-cover'
                                />
                            </div>
                        )}
                    </div>

                    <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
                    <div className='flex gap-4 mb-7'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='Vehicle Color'
                            value={vehicleColor}
                            onChange={(e) => setVehicleColor(e.target.value)}
                        />
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='Vehicle Plate'
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                        />
                    </div>
                    <div className='flex gap-4 mb-7'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="number"
                            placeholder='Vehicle Capacity'
                            min={1}
                            value={vehicleCapacity}
                            onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setVehicleCapacity(val);
                            }}
                        />
                        <select
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                        >
                            <option value="" disabled>Vehicle Type</option>
                            <option value="car">Car</option>
                            <option value="auto">Auto</option>
                            <option value="moto">Moto</option>
                        </select>
                    </div>

                    <button
                        className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                        disabled={uploading}
                    >
                        {uploading ? 'Creating Account...' : 'Create Captain Account'}
                    </button>
                </form>
                <p className='text-center mb-5'>
                    Already have an Account ? <Link to="/captain-login" className='text-blue-600'>Login Here</Link>
                </p>
            </div>

            <div>
                <p className='text-[10px] mt-6 leading-tight mb-4'>
                    This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                    Policy</span> and <span className='underline'>Terms of Service apply</span>.
                </p>
            </div>
        </div>
    )
}

export default CaptainSignup
