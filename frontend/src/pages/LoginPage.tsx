import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gray-50 text-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">Login to Manak AI</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          New here? <Link to="/signup" className="text-red-600 hover:text-red-800 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
