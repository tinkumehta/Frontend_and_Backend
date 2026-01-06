import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Queue from './pages/Queue';
import CreateShop from './pages/shop/CreateShop';
import ShopList from './pages/shop/ShopList';


function App() {
 

  
  return (
   <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={<ProtectedRoute><ShopList /></ProtectedRoute>}
          />
          <Route
            path="/queue/:shopId"
            element={<ProtectedRoute><Queue /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
