import { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'

import Login from './components/Login/Login'
import Register from './components/Login/Register'
import Home from './components/pages/Home'

function App() {
  

  return (
    <BrowserRouter>
      {/* header */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
