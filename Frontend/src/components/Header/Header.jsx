import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login.jsx';

function Header({toggleSidebar}) {
  return (
    <div className='w-full flex items-center justify-between p-3 m-1 shadow-sm'>
      <div className='flex items-center'>
        <button className='px-1 focus:outline-none material-icons text-3xl'
          onClick={toggleSidebar}
          >
          &#xe5d2;
        </button>
        <Link to='/' className='flex items-center ml-2'>
          <img className='rounded-xl w-9 h-9 mr-1' src="Logo2.webp" alt="YT Logo" />
          <span className='text-xl font-semibold text-gray-700 tracking-tighter'>YouTube</span>
        </Link>
      </div>

      <div className='flex-grow flex justify-center items-center mx-6'>
        <input type="text" placeholder='Search' className='w-full max-w-lg px-4 py-1 border rounded-full text-md focus:outline-1' />
        <button className='material-icons ml-2'> &#xe8b6; </button>
      </div>

      <div className='flex items-center'>
        <Login />
      </div>
    </div>
  );
}

export default Header;