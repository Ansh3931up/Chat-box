import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "../Redux/Reducer";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  async function logintoAccount(e) {
    e.preventDefault();
    if ([loginData.email, loginData.password].some((field) => field.trim() === "")) {
      toast.error("Please fill all details.");
      return;
    }

    const response = await dispatch(loginAccount(loginData));
    if (response?.payload?.statusCode === 200) {
      navigate('/main');
    }
    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 shadow-lg rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-purple-300 hover:text-white mb-4 transition-colors duration-300"
        >
          ← Back
        </button>
        
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        <form noValidate onSubmit={logintoAccount} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={loginData.email}
                name="email"
                id="email"
                placeholder="Enter your email..."
                className="block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-gray-200"
                onChange={handleUserInput}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                  <path d="M16 7l-8 5-8-5v8h16V7z" />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={loginData.password}
                name="password"
                id="password"
                placeholder="Enter your password..."
                className="block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-gray-200"
                onChange={handleUserInput}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-purple-300 transition-colors duration-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-105"
          >
            Login
          </button>
          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:text-purple-500 hover:underline transition-colors duration-300">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
