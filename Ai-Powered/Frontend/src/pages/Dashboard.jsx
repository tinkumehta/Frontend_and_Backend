import { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

export default function Dashboard() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const generate = async () => {
    const { data } = await axios.post('/content/generate', { prompt });
    setResult(data.response);
    setPrompt('');
    fetchHistory();
  };

  const fetchHistory = async () => {
    const { data } = await axios.get('/content/history');
    setHistory(data);
  };

  const deleteItem = async (id) => {
    await axios.delete(`/content/${id}`);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full p-2 border rounded" placeholder="Type your prompt..." />
      <button onClick={generate} className="btn mt-2">Generate</button>

      {result && <div className="mt-4 p-4 bg-gray-100 rounded">{result}</div>}

      <h3 className="text-xl mt-6 mb-2">Saved History</h3>
      <ul>
        {history.map((item) => (
          <li key={item._id} className="border-b py-2 flex justify-between">
            <span>{item.prompt}</span>
            <button onClick={() => deleteItem(item._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
