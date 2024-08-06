import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getblog } from "../../Redux/Blog";
import BlogCard from "../BlogCard";
import updateImage from "./update.jpg"; // Import the background image

function BlogList() {
    const dispatch = useDispatch();
    const BlogData = useSelector((state) => state.blog.BlogData);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 
    const role = useSelector((state) => state.auth.role); 

    useEffect(() => {
        dispatch(getblog());
    }, [dispatch]);

    return (
        <div 
            className="min-h-screen pt-12 px-4 md:px-20 flex flex-col gap-10 text-white"
            style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <h1 className="text-3xl md:text-4xl font-bold text-center">Latest Updates</h1>
            <span className="font-bold text-xl md:text-2xl text-center">By RSS</span>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BlogData?.map((element) => (
                    <BlogCard key={element._id} data={element} />
                ))}
            </div>
            {isLoggedIn && role === "ADMIN" && (
                <div className="text-center mt-8">
                    <Link 
                        to="/updates/create" 
                        className="text-white bg-orange-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                    >
                        Create New Blog
                    </Link>
                </div>
            )}
        </div>
    );
}

export default BlogList;
