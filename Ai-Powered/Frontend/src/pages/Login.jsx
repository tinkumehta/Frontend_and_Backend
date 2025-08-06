import { useState } from 'react';
import axios from '../utils/axiosInstance';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('/auth/login', { email, password });
    login(data, data.token);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input border p-2 w-full rounded" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input border p-2 w-full rounded" />
      <button type="submit" className="btn mt-2 bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
