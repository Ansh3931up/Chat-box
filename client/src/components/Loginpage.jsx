import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "../Redux/Reducer";
import updateImage from "./update.jpg"; 

function Loginpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);  
  const toggleShowPassword = () => {    
    setShowPassword(!showPassword); 
  };

  const [LoginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...LoginData,
      [name]: value,
    });
  };

  async function logintoAccount(e) {
    e.preventDefault();
    if ([LoginData.email, LoginData.password].some((field) => field.trim() === "")) {
      toast.error("Please fill all details.");
      return;
    }

    const response = await dispatch(loginAccount(LoginData));
    if (response?.payload?.statusCode === 200) {
      navigate('/main');
    }
    setLoginData({
      email: "",
      password: ""
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r dark:bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Login Page</h2>
        <form noValidate onSubmit={logintoAccount} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={LoginData.email}
              name="email"
              id="email"
              placeholder="Enter your Email..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary dark:focus:ring-primary"
              onChange={handleUserInput}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={LoginData.password}
                name="password"
                id="password"
                placeholder="Enter your Password..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-primary dark:focus:ring-primary"
                onChange={handleUserInput}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-600"
          >
            Login Account
          </button>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Do not have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline dark:text-blue-400">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
