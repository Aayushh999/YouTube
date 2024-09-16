import React, { useState } from 'react';
import {Link} from 'react-router-dom'

function Login() {
  const [usernameOrEmail , setUsernameOrEmail]  = useState('')
  const [password , setPassword]  = useState('')
  const [error , setError]  = useState('')

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: Handle Api call
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className='text-2xl mb-5 text-center font-semibold'>Login</h2>
        <form onSubmit={handleLogin}>
          <div className='mb-3'>
            <input 
              type="text"
              placeholder='Enter Username or Email'
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <input 
              type="text"
              placeholder='Password' 
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <button
            type='submit'
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition my-4"
          >
            Log In
          </button>
        </form>

        <div className=' text-center'>
        <p>Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;