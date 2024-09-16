import {React , useState} from 'react';
import { Link } from 'react-router-dom';
import Login from '../../pages/Login.jsx';
import PublishVideo from '../PublishVideo.jsx';

function Header({toggleSidebar}) {

  const [PublishPopup, setPublishPopup] = useState(false);
  const handlePublishClick = () => setPublishPopup(true);

  return (
    <div className='w-full flex items-center justify-between p-2 m-1 shadow-sm'>
      <div className='flex items-center'>
        <button className='px-1 focus:outline-none material-icons text-3xl'
          onClick={toggleSidebar}
          >
          &#xe5d2;
        </button>
        <Link to='/' className='flex items-center ml-2'>
          <img className='rounded-xl w-9 h-9 mr-1' src="Logo2.webp" alt="YT Logo" />
          <span className='text-xl font-semibold text-black tracking-tighter'>YouTube</span>
        </Link>
      </div>

      <div className='flex-grow flex justify-center items-center mx-6'>
        <input type="text" placeholder='Search' className='w-full max-w-lg px-4 py-1 border-2 rounded-full text-md focus:outline-1' />
        <button className='material-icons ml-2'> &#xe8b6; </button>
      </div>

      <div className='flex items-center border rounded-3xl p-2 m-1 hover:bg-gray-100 hover:text' title='Create'>
        <div className='border-emerald-300 mx-1'>
          <button 
            onClick={handlePublishClick} 
            className='material-icons'
            >
            add_box
          </button>
        </div>
      </div>

      <div className='flex items-center border rounded-3xl p-2 m-1 hover:text-blue-600 shadow-md'>
        <div className='border-emerald-300 mx-2 '>
          <Link to='/Login'>
            <button className='font-semibold  text-xl tracking-tighter '>Login</button>
          </Link>
        </div>
      </div>

      {PublishPopup && <PublishVideo closePopup={() => setPublishPopup(false)} />}
    </div>
  );
}

export default Header;