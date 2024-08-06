import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isEmail, isPincodeValid, isValidPassword } from "../Helpers/regexMatcher";
import { createAccount } from "../Redux/Reducer";
import updateImage from "./update.jpg"

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    avatar: null,
    Pincode: 0,
    State: "",
    address: ""
  });

  const [previewImage, setPreviewImage] = useState("");

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSignupData({
        ...signupData,
        avatar: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function createNewAccount(e) {
    e.preventDefault();
    if (
      [signupData.email, signupData.password, signupData.fullname, signupData.Pincode, signupData.State, signupData.address].some(
        (field) => field.trim() === ""
      )
    ) {
      toast.error("Please fill all details.");
      return;
    }
    if (!isPincodeValid(signupData.Pincode)) {
      toast.error("Pincode Invalid");
    }
    if (signupData.fullname.length < 5) {
      toast.error("Name should be at least 6 characters");
      return;
    }

    if (signupData.password.length < 8) {
      toast.error("Password should be at least 8 characters");
      return;
    }
    if (!isValidPassword(signupData.password)) {
      toast.error("Password should contain at least one number and one special character");
      return;
    }
    if (!isEmail(signupData.email)) {
      toast.error("Invalid email");
      return;
    }
    const formData = new FormData();
    formData.append("fullname", signupData.fullname);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);
    formData.append("Pincode", signupData.Pincode);
    formData.append("State", signupData.State);
    formData.append("address", signupData.address);

    const response = await dispatch(createAccount(formData));
    if (response?.payload?.statusCode === 200) navigate("/");

    setSignupData({
      fullname: "",
      email: "",
      password: "",
      avatar: null,
      Pincode: "",
      State: "",
      address: ""
    });
    setPreviewImage("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
      <form
        noValidate
        onSubmit={createNewAccount}
        className="flex flex-col space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 w-full max-w-md shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Registration Page</h1>
        
        <div className="flex flex-col items-center">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer w-24 h-24 rounded-full overflow-hidden border-4 border-primary flex items-center justify-center"
          >
            {previewImage ? (
              <img
                src={previewImage}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <BsPersonCircle className="w-full h-full text-4xl text-gray-500" />
            )}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            name="imageUploads"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="fullname" className="font-semibold">Name</label>
          <input
            type="text"
            required
            value={signupData.fullname}
            name="fullname"
            id="fullname"
            placeholder="Enter your Name..."
            className="bg-transparent px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            onChange={handleUserInput}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">Email</label>
          <input
            type="email"
            required
            value={signupData.email}
            name="email"
            id="email"
            placeholder="Enter your Email..."
            className="bg-transparent px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            onChange={handleUserInput}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={signupData.password}
              name="password"
              id="password"
              placeholder="Enter your Password..."
              className="bg-transparent px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              onChange={handleUserInput}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-primary focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
       
       

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-all ease-in-out duration-300"
        >
          Create Account
        </button>
        <p className="text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
