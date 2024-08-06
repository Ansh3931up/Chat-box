// import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
// import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { isEmail, isPincodeValid } from "../Helpers/regexMatcher";
import { saveChanges } from "../Redux/Reducer"; // Assuming the Redux action is named `updateUserProfile`
import updateImage from "./update.jpg"

function EditProfile() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    fullname: state?.fullname,
    email: state?.email,
    // password: state?.password,
    // avatar: state?.avatar, // Use null to indicate no avatar initially
    Pincode: state?.Pincode,
    State: state?.State,
    address: state?.address
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

    // Basic form validation
    if (
      [signupData.email, signupData.fullname, signupData.Pincode, signupData.State, signupData.address].some(
        (field) => typeof field === "string" && field.trim() === ""
      )
    ) {
      toast.error("Please fill all details.");
      return;
    }
    if (!isPincodeValid(signupData.Pincode)) {
      toast.error("Pincode Invalid");
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

    // const formData = new FormData();
    // formData.append("fullname", signupData.fullname);
    // formData.append("email", signupData.email);
    // // formData.append("password", signupData.password);
    // // formData.append("avatar", signupData.avatar);
    // formData.append("Pincode", signupData.Pincode);
    // formData.append("State", signupData.State);
    // formData.append("address", signupData.address);
    // console.log(formData);
    // console.log(signupData);
    // Dispatch action to Redux store
    const response = await dispatch(saveChanges(signupData)); // Ensure this is the correct Redux action
    console.log(response);

    if (response?.payload?.statusCode === 200) navigate("/");

    setSignupData({
      fullname: "",
      email: "",
      // password: "",
      // avatar: null,
      Pincode: "",
      State: "",
      address: ""
    });
  };

  return (
    <div className="flex items-center justify-center py-4 bg-orange-100" style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form
        noValidate
        onSubmit={saveChange}
        className="flex flex-col bg-white text-orange-500 justify-center gap-3 rounded-lg p-4 w-96 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Registration Page</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="fullname" className="font-semibold">
            Name
          </label>
          <input
            type="text"
            required
            value={signupData.fullname}
            name="fullname"
            id="fullname"
            placeholder="Enter your Name..."
            className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
            onChange={handleUserInput}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            type="email"
            required
            value={signupData.email}
            name="email"
            id="email"
            placeholder="Enter your Email..."
            className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
            onChange={handleUserInput}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="Pincode" className="font-semibold">
            Pincode
          </label>
          <input
            type="number"
            required
            value={signupData.Pincode}
            name="Pincode"
            id="Pincode"
            placeholder="Enter your Pincode..."
            className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
            onChange={handleUserInput}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="State" className="font-semibold">
            State
          </label>
          <input
            type="text"
            required
            value={signupData.State}
            name="State"
            id="State"
            placeholder="Enter your State..."
            className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
            onChange={handleUserInput}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="font-semibold">
            Address
          </label>
          <textarea
            type="text"
            required
            value={signupData.address}
            name="address"
            id="address"
            placeholder="Enter your address..."
            className="bg-transparent px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
            onChange={handleUserInput}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-orange-50 py-2 rounded-md hover:bg-orange-600 transition-all ease-in-out duration-300"
        >
          Save Changes
        </button>

      </form>
    </div>
  );
}

export default EditProfile;
