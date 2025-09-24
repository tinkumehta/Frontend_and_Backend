import React,{useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

function Register() {
    const navigate = useNavigate();
    const {register} = useContext(AuthContext);

    const [form, setForm] = useState({
        name: '',
        username: '',
        email :'',
        password: ''
    })

    const handleChange = (e) => 
        setForm({...form, [e.target.name] : e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) =>  formData.append(key, value))

        await register(formData);
        navigate('/');
    }
  return (
    <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
             name='name'
             placeholder='Name'
             onChange={handleChange}
             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
             required
             />
            <input
             name='username'
             placeholder='username'
             onChange={handleChange}
             required
             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
             />
            <input
             name='email'
             type='email'
             placeholder='Email'
             onChange={handleChange}
             required
             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
             />
            <input
             name='password'
             type='password'
             placeholder='password'
             onChange={handleChange}
             required
             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
             />
            <button
            type='submit'
            className="bg-green-600 hover:bg-green-700 transition text-white py-3 px-4 rounded-lg font-semibold">
                Register
            </button>
        </form>
    </div>
  )
}

export default Register