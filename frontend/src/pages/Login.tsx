import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Code size={40} className="text-white" strokeWidth={2.5} />
            <h1 className="text-5xl font-bold text-white">Py1</h1>
          </div>
          <p className="text-[#888888] text-sm">
            Computational Thinking Learning Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-950/30 border border-red-900 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-[#888888] text-sm mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-white transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#888888] text-sm mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-white transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-[#121212] font-semibold py-3 rounded-lg hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                <span>{isLogin ? 'Logging in...' : 'Registering...'}</span>
              </>
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-[#888888] text-sm hover:text-white transition-colors"
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
