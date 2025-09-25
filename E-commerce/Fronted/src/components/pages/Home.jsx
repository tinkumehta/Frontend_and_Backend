import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

function Home() {
  const {user, logout} = useContext(AuthContext);
  //console.log(user);
  
  return (
    <div>
       <h1 className='m-5 flex justify-center'>Product Sections</h1>
    </div>
    
  )
}

export default Home