// import './globals.css';

// import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import aboutimg from "../assets/aboutimg.jpg";
import { getblog } from '../Redux/Blog';
import { getphotos } from '../Redux/gallery';
import BlogCard from './BlogCard';
import Photocomponent from './Photocomponent';
import updateImage from "./update.jpg"; 

export default function Homecomponent() {
    const dispatch = useDispatch();
    const BlogData = useSelector((state) => state?.blog?.BlogData);
    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 
    // const role = useSelector((state) => state.auth.role); 
    // const page="home";
    const photo = useSelector((state) => state?.photo?.photo?.data);
    
    useEffect(() => {
        dispatch(getblog());
        dispatch(getphotos());
    }, [dispatch]);
    const latestphoto = photo?.slice(-6);
    const latestBlogs = BlogData?.slice(-3);
    // console.log(latestBlogs,"blog");
    // console.log(latestphoto,"photo");
  return (
    <div className="bg-orange-100 text-orange-500"  style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/updates"><h2 className="text-3xl text-orange-50 font-bold mb-8">Latest Updates</h2></Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs?.map((element) => (
                    <BlogCard key={element._id} data={element}  />
                ))}
        
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/gallery"><h2 className="text-3xl font-bold mb-8">Photo Gallery</h2></Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestphoto?.map((element) => (
                    <Photocomponent key={element._id} data={element}  />
                ))}
        
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-gray-600 mb-4">
              Rashtriya Sewa Sangh is a non-profit organization dedicated to serving the community and promoting social
              welfare. Our mission is to empower individuals and communities through various initiatives and programs.
            </p>
            <p className="text-gray-600 mb-4">
            Welcome to the official page of Rastriya Swayamsevak Sangh (RSS). Established with a profound vision to foster a united and resilient society, RSS has been a stalwart in promoting cultural nationalism, social harmony, and selfless service for decades. Rooted in the principles of Hindutva and dedicated to the welfare of the nation, RSS is committed to nurturing individuals to become disciplined, responsible citizens who contribute positively to the fabric of our diverse nation. Explore our journey, initiatives, and the values that drive us as we continue to strive for a prosperous and inclusive India.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-md bg-orange-500 text-white px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Learn More
            </Link>
          </div>
          <div>
            <img src={aboutimg} alt="About Us" className="w-full h-auto rounded-lg shadow-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
