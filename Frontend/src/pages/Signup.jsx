import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // TODO: Handle API call to signup

    const formData = new FormData();
    formData.append('username',username)
    formData.append('email',email)
    formData.append('fullname',fullName)
    formData.append('password',password)

    if (!avatar) {
      setError("Avatar is required");
      return;
    } else {
      formData.append("avatar", avatar);
    }
  
    if (coverImage) {
      formData.append("coverimage", coverImage);
    }

    setUsername('');
    setEmail('');
    setPassword('');
    setFullName('');
    setAvatar(null);
    setCoverImage(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register',{
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      })

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Signup failed');
      } else {
        navigate('/')
      }

    } catch (error) {
      console.log(" Error sending data while Signup : ", error)
      setError(error)
    }


  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className='text-2xl mb-5 text-center font-semibold'>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className='mb-3'>
            <input
              type="text"
              placeholder='Full Name*'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <input
              type="text"
              placeholder='Username*'
              value={username}
              autoComplete='username'
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <input
              type="email"
              placeholder='Email*'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <input
              type="password"
              placeholder='Password*'
              value={password}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-left text-gray-600 text-sm mb-1'>Avatar Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setAvatar)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-left text-gray-600 text-sm mb-1'>Cover Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setCoverImage)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none'
            />
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <button
            type='submit'
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition my-4"
          >
            Sign Up
          </button>
        </form>

        <div className='text-center'>
          <p>Already have an account? <Link to="/login" className="text-blue-500">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
