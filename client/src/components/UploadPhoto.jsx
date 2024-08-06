import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// import { createblog } from '../Redux/Blog.jsx';
import { uploadImage } from "../Redux/gallery.jsx";
import updateImage from "./update.jpg";

const UploadPhoto=()=> {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    photo: null,
    previewImage: "",
  });

  const saveImage = async () => {
    if (!userInput.photo) {
      toast.error('Please select an image');
      return null;
    }

    const data = new FormData();
    data.append('file', userInput.photo);
    data.append('upload_preset', 'photogallery');
    data.append('cloud_name', 'dxueqphl3');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dxueqphl3/image/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || 'Error uploading image');
      }

      const cloudData = await res.json();
      toast.success('Image uploaded successfully');
      return cloudData.secure_url;
    } catch (error) {
      toast.error(`Error uploading image: ${error.message}`);
      console.log(error);
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInput({
        ...userInput,
        photo: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInput((prevInput) => ({
          ...prevInput,
          previewImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

 

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.photo) {
      toast.error("All fields are mandatory");
      return;
    }

    const imageUrl = await saveImage(); // Save image and get URL

    if (!imageUrl) {
      toast.error("Failed to upload image");
      return;
    }

    const response = await dispatch(uploadImage({
    
      photo: imageUrl, // Use the returned image URL
    }));

    if (response?.payload?.success) {
      navigate("/updates");
      setUserInput({
        previewImage: "",
        photo: null,
      });
      
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]" style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col justify-center gap-5 rounded-lg p-4 text-orange-500 bg-orange-100 w-[700px] my-10"
      >
        <Link to="/" className="absolute top-8 text-2xl text-accent cursor-pointer">
          <AiOutlineArrowLeft />
        </Link>

        <h1 className="text-center text-2xl font-bold">Create New Blog</h1>
        <main className="grid grid-cols-2 gap-x-10">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer  mx-auto w-full h-full rounded-sm overflow-hidden border-2 border-orange-500"
          >
            {userInput.previewImage ? (
              <img
                src={userInput.previewImage}
                className="w-full h-44 m-auto border"
                alt="Preview"
              />
            ) : (
              <div className="w-full h-44 m-auto flex items-center justify-center border">
                <h1 className="font-bold text-lg">Upload your Blog Thumbnail</h1>
              </div>
            )}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept=".jpg,.jpeg,.png"
            className="hidden cursor-pointer bg-white text-orange-500 "
            onChange={handleImageChange}
          />
        </main>
        <button type="submit" className="bg-orange-500 p-2 rounded text-white">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UploadPhoto;
