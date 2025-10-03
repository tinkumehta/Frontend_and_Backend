import { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'

import Login from './components/Login/Login'
import Register from './components/Login/Register'

import { Footer, Header, ProtectedRoute, ProductDetails, Products } from './components'
import CreateProduct from './components/Products/ProductCreate'
import TopRatedProducts from './components/review/TopReview'
import CheckoutPage from './components/payment/CreatePayment'


function App() {
  

  return (
    <BrowserRouter>
     <Header />
      <Routes>
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
       
        <Route 
          path="/product/:id"
          element={
          <ProtectedRoute>
             <ProductDetails />
          </ProtectedRoute>
        }
           />
        <Route 
          path='/createproduct'
          element={
            <ProtectedRoute>
              <CreateProduct/>
            </ProtectedRoute>
          }
          />
        <Route 
          path='/productReview'
          element={
            <ProtectedRoute>
              <TopRatedProducts/>
            </ProtectedRoute>
          }
          />
        <Route 
          path='/create-payment'
          element={
            <ProtectedRoute>
              <CheckoutPage/>
            </ProtectedRoute>
          }
          />
        <Route 
          path='/'
          element={
            <ProtectedRoute>
              <Products/>
            </ProtectedRoute>
          }
          />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
