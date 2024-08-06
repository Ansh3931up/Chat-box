import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getphotos } from "../Redux/gallery";
import Photocomponent from "./Photocomponent";
import updateImage from "./update.jpg"; // Import the background image

function PhotoGallery() {
    const dispatch = useDispatch();
    const photo = useSelector((state) => state?.photo?.photo.data);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 
    const role = useSelector((state) => state.auth.role); 
    console.log(photo,"phtots");
    useEffect(() => {
        dispatch(getphotos());
    }, [dispatch]);

    return (
        <div 
            className="min-h-[90vh] pt-12 pl-4 pr-4 md:pl-20 flex flex-col gap-10 text-white"
            style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <h1 className="text-3xl md:text-4xl font-bold">Gallery</h1>
         
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {photo?.map((element) => (
                    <Photocomponent key={element._id} data={element} />
                ))}
            </div>
            {isLoggedIn && role === "ADMIN" && (
                <Link 
                    to="/upload/image" 
                    className="text-white bg-orange-500 w-full md:w-1/3 lg:w-1/4 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mb-4"
                >
                    Upload Image
                </Link>
            )}
        </div>
    );
}

export default PhotoGallery;
