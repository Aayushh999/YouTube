import { useState } from 'react'
import { Header, Footer } from './components'
import { Outlet } from 'react-router-dom'
import { PulseSphere, SimpleLoader , WaveFlow} from 'spinny-loader' 
import './App.css'

function App() {
  const [loader, setloader] = useState(true)



  return loader ? <SimpleLoader/> : (
    <>
      <div>
        <div>
          <Header />
          <main>
            {/* <Outlet /> */}
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
