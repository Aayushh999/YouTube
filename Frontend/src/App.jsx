import { useState } from 'react'
import { Header, Sidebar } from './components'
import { Outlet } from 'react-router-dom'
import { PulseSphere, SimpleLoader , WaveFlow} from 'spinny-loader' 
import './App.css'

function App() {
  const [loader, setloader] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = ()=>{
    setIsSidebarOpen(!isSidebarOpen)
  }

  return loader ? <SimpleLoader/> : (
    <>
      <hr className="w-full border-t border-white fixed top-0 left-0 z-10 md:hidden" />

      <div className='w-full h-full bg-white text-gray-700'>
        <div>
          <Header toggleSidebar={toggleSidebar}/>
          <main>
            {/* <Outlet /> */}
          </main>
          {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar}/>}
        </div>
      </div>
      
      <hr className="w-full border-t border-white fixed top-0 left-0 z-10 md:hidden" />
    </>
  )
}

export default App
