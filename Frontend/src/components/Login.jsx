import React from 'react';
import {Link} from 'react-router-dom'

function Login() {
  return (
    <div className='border-emerald-300'>
      <Link >
        <button className='font-semibold text-xl'>Login</button>
      </Link>
    </div>
  );
}

export default Login;