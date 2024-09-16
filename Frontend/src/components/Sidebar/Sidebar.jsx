import React from 'react';
import {Link} from 'react-router-dom'

function Sidebar({ toggleSidebar }) {
  return (
    <>
      <div
        className='fixed inset-0 bg-black opacity-50 z-40'
        onClick={toggleSidebar}
      />

      <div className='fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col'>
        <div className='p-4 flex-1'>
          
          <ul className='flex flex-col space-y-2'>
            <li className='flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded'>
              <span className='material-icons mr-2'>home</span>
              Home
            </li>
            <li className='flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded'>
              <span className='material-icons mr-2'>article</span>
              Tweet
            </li>
            <li className='flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded'>
              <span className='material-icons mr-2'>library_add</span>
              Library
            </li>
            <li className='flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded'>
              <span className='material-icons mr-2'>history</span>
              Watch History
            </li>
            <li className='flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded'>
              <span className='material-icons mr-2'>subscriptions</span>
              Subscriptions
            </li>
          </ul>
        </div>

        <hr></hr>

        <div className='p-4'>
          <Link to='/'>
            <button className='w-full my-4 py-2 bg-red-400 text-white rounded-full flex items-center justify-center'>
              Logout
            </button>
          </Link>
          <button className='w-full py-2 bg-blue-500 text-white rounded-full flex items-center justify-center'>
            <span className='material-icons mr-2'>support</span>
            Support
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
