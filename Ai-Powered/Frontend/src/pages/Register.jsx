import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border p-2 w-full rounded" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full rounded" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 w-full rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Register</button>
    </form>
  );
}
