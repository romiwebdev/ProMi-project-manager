import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      alert(data.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-96 border border-blue-100 backdrop-blur-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FiLogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Login</h1>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiUser className="h-5 w-5 text-blue-400" />
          </div>
          <input
            className="border border-blue-200 p-4 pl-12 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 placeholder-blue-400 transition-all duration-200"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-blue-400" />
          </div>
          <input
            className="border border-blue-200 p-4 pl-12 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 placeholder-blue-400 transition-all duration-200"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-4 w-full rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}