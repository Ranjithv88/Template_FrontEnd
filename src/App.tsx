import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Loading from './components/Loading'
import HomePage from './components/HomePage'

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/Loading" element={<Loading/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

