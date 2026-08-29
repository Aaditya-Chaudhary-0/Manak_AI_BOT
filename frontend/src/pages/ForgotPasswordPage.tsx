
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 bg-charcoal rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-500">Reset Password</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Send Reset Link
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Remembered your password? <Link to="/login" className="text-red-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
