import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isValidPassword } from "../Helpers/regexMatcher";
import { ChangePassword } from "../Redux/Reducer";
import updateImage from "./update.jpg";

function Editpassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",    
    oldPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function changePassword(e) {
    e.preventDefault();
    // Basic form validation
    if (!passwords.newPassword || !passwords.oldPassword) {
      toast.error("Please fill BOTH password fields.");
      return;
    }
   
    if (!isValidPassword(passwords.newPassword && passwords.oldPassword)) {
      toast.error(
        "Password should contain at least one number and one special character"
      );
      return;
    }
    
    // Dispatch action to Redux store
    const response = await dispatch(ChangePassword(passwords));
    console.log(response);
    if (response?.payload?.statusCode === 200) {
      toast.success(response?.payload?.data);
      navigate("/");
    }

    setPasswords({
      newPassword: "",
      oldPassword: "",
    });
    // Redirect or navigate after successful signup
    // Example redirection to login page
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center py-4 bg-orange-100" style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form
        noValidate
        onSubmit={changePassword}
        className="flex flex-col bg-white text-orange-500 justify-center gap-3 rounded-lg p-4 w-96 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Change Password</h1>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="oldPassword" className="font-semibold">
            Old Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={passwords.oldPassword}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter your Old Password..."
              className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500 w-full"
              onChange={handleUserInput}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-orange-500 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="font-semibold">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={passwords.newPassword}
              name="newPassword"
              id="newPassword"
              placeholder="Enter your New Password..."
              className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500 w-full"
              onChange={handleUserInput}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-orange-500 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
       
        <button
          type="submit"
          className="w-full bg-orange-500 text-orange-50 py-2 rounded-md hover:bg-orange-600 transition-all ease-in-out duration-300"
        >
          Change Password
        </button>
        
      </form>
    </div>
  );
}

export default Editpassword;

