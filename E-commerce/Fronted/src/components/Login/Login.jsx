import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'


function Login() {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlelogin = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate('/');
    };


  return (
    <div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Welcome Back 👋
        </h2>
      <form onSubmit={handlelogin} className='space-y-5'>
        <input
        type='email'
        placeholder='enter your email'
        onChange={(e) => setEmail(e.target.value)}
         className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
        />
        <input
        type='password'
        placeholder='enter your password'
        onChange={(e) => setPassword(e.target.value)}
         className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
        />
        <button 
         type='submit'
         className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
         >
            Log In
         </button>
      </form>
        </div>
  )
}

export default Login