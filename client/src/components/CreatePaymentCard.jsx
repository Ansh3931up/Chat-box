import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createCard } from "../Redux/Payment";
import updateImage from "./update.jpg";

function CreatePayCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
    thumbnail: null,
    pdf: null,
    price: "",
    previewImage: "",
    preview: "",
  });

  const saveFile = async (file, uploadPreset) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);
    data.append('cloud_name', 'dxueqphl3');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dxueqphl3/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || 'Error uploading file');
      }

      const cloudData = await res.json();
      toast.success(`${file.type.includes('image') ? 'Image' : 'PDF'} uploaded successfully`);
      return cloudData.secure_url;
    } catch (error) {
      toast.error(`Error uploading file: ${error.message}`);
      console.log(error);
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type.includes('image')) {
          setUserInput((prevInput) => ({
            ...prevInput,
            thumbnail: file,
            previewImage: reader.result,
          }));
        } else if (file.type.includes('pdf')) {
          setUserInput((prevInput) => ({
            ...prevInput,
            pdf: file,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.title || !userInput.description || !userInput.thumbnail || !userInput.pdf || !userInput.price) {
      toast.error("All fields are mandatory");
      return;
    }

    const imageUrl = await saveFile(userInput.thumbnail, 'paycard'); // Save image and get URL
    const pdfUrl = await saveFile(userInput.pdf, 'paycard'); // Save PDF and get URL

    if (!imageUrl || !pdfUrl) {
      toast.error("Failed to upload image or PDF");
      return;
    }

    const response = await dispatch(createCard({
      title: userInput.title,
      price: userInput.price,
      description: userInput.description,
      thumbnail: imageUrl, // Use the returned image URL
      preview: pdfUrl, // Use the returned PDF URL
    }));

    console.log("response of createpay", response);

    if (response?.payload?.statusCode===200) {
      console.log("enter back nav")
      navigate(-1);
      setUserInput({
        title: "",
        description: "",
        thumbnail: null,
        pdf: null,
        price: "",
        previewImage: "",
        preview: "",
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

        <h1 className="text-center text-2xl font-bold">Create New Product</h1>
        <main className="grid grid-cols-2 gap-x-10">
          <div className="col-span-1">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer mx-auto w-full h-full rounded-sm overflow-hidden border-2 border-orange-500"
            >
              {userInput.previewImage ? (
                <img
                  src={userInput.previewImage}
                  className="object-cover w-full h-44 border"
                  alt="Preview"
                />
              ) : (
                <div className="w-full h-44 m-auto flex items-center justify-center border">
                  <h1 className="font-bold text-lg">Upload your Thumbnail</h1>
                </div>
              )}
            </label>
            <input
              type="file"
              id="imageUpload"
              accept=".jpg,.jpeg,.png"
              className="hidden cursor-pointer bg-white text-orange-500"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="pdfUpload"
              className="cursor-pointer mx-auto w-full h-full rounded-sm overflow-hidden border-2 border-orange-500"
            >
              {userInput.pdf ? (
                <img
                  src={userInput.pdf}
                  className="object-cover w-full h-44 border"
                  alt="Preview"
                />
              ) : (
                <div className="w-full h-44 m-auto flex items-center justify-center border">
                  <h1 className="font-bold text-lg">Upload your PDF</h1>
                </div>
              )}
            </label>
            <input
              type="file"
              id="pdfUpload"
              accept=".pdf"
              className="hidden cursor-pointer bg-white text-orange-500"
              onChange={handleFileChange}
            />
          </div>
        </main>

        <input
          type="text"
          name="title"
          value={userInput.title}
          onChange={handleUserInput}
          placeholder="Title"
          className="border rounded p-2 bg-white text-orange-500"
        />

        <textarea
          name="description"
          value={userInput.description}
          onChange={handleUserInput}
          placeholder="Description"
          className="border rounded p-2 bg-white text-orange-500"
        />
        <input
          type="number"
          name="price"
          value={userInput.price}
          onChange={handleUserInput}
          placeholder="Price"
          className="border rounded p-2 bg-white text-orange-500"
        />

        <button type="submit" className="bg-orange-500 p-2 rounded text-white">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreatePayCard;
