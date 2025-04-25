import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [ userData, setUserData ] = useState({});

    const navigate = useNavigate();

    const { user, setUser } = useContext(UserDataContext)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_USER);

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

        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password,
            profileImage: profileImage
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

            if (response.status === 201) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token', data.token);
                navigate('/home');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Failed to create account. Please try again.');
        }

        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setProfileImage(null);
    }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
            <img 
                className='w-16 mb-10'
                src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
                alt="Logo"
            />
            <form onSubmit={submitHandler}>
                <h3 className='text-lg font-medium mb-2'>What's your name?</h3>
                <div className='flex gap-4 mb-7'>
                    <input
                        className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base' 
                        type='text' 
                        required 
                        placeholder='First Name' 
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />
                    <input
                        className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base' 
                        type='text' 
                        required 
                        placeholder='Last Name' 
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                </div>
                <h3 className='text-lg font-medium mb-2'>What's your email?</h3>
                <input
                    className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' 
                    type='email' 
                    required 
                    placeholder='email@example.com' 
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                <input 
                    className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' 
                    type='password' 
                    required 
                    placeholder='password'
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }} 
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
                <button
                    className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'
                    disabled={uploading}
                >
                    {uploading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p className='text-center'>
                Already have an Account ? <Link to="/login" className='text-blue-600'>Login Here</Link>
            </p>
        </div>

        <div>
            <p className='text-[10px] leading-tight'>
                This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                Policy</span> and <span className='underline'>Terms of Service apply</span>.
            </p>
        </div>
    </div>
  )
}

export default UserSignup
