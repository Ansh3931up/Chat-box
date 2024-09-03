import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { isEmail } from "../Helpers/regexMatcher";
import { saveChanges } from "../Redux/Reducer";
// import updateImage from "./update.jpg";

function EditProfile() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    fullname: state?.fullname || "",
    email: state?.email || "",
    
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const saveChange = async (e) => {
    e.preventDefault();

    if (
      [signupData.email, signupData.fullname].some(
        (field) => field?.trim() === ""
      )
    ) {
      toast.error("Please fill all details.");
      return;
    }
    
    if (signupData.fullname.length < 5) {
      toast.error("Name should be at least 6 characters");
      return;
    }
    if (!isEmail(signupData.email)) {
      toast.error("Invalid email");
      return;
    }

    const response = await dispatch(saveChanges(signupData));
    if (response?.payload?.statusCode === 200) {
      navigate("/");
    }

    setSignupData({
      fullname: "",
      email: "",
      
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
        <form noValidate onSubmit={saveChange} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              required
              value={signupData.fullname}
              name="fullname"
              id="fullname"
              placeholder="Enter your Name..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              onChange={handleUserInput}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={signupData.email}
              name="email"
              id="email"
              placeholder="Enter your Email..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              onChange={handleUserInput}
            />
          </div>
         
         
         
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
