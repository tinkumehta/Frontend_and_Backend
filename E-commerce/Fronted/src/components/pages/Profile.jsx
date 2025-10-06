import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'


function Profile() {
    const {user} = useContext(AuthContext);
   // console.log(user);
    
  return (
    <div>
        <h3 className='w-full flex justify-center m-5'>Email {user.email}</h3>
        <h2 className='w-full flex justify-center m-5'>Name {user.name}</h2>
        <h4 className='w-full flex justify-center m-5'>Role {user.role}</h4>
    </div>
  )
}

export default Profile