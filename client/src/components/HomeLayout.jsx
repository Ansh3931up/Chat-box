import React from 'react';
import { Link } from 'react-router-dom';

import Footer from './Footer.jsx';
import logo from './logo.jpeg'; // Import logo image
import NavBar from './NavBar.jsx';

export default function HomeLayout() {
  return (
    <>
    <NavBar/>
    <section className="w-full py-10 md:py-20 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Connect with friends and family like never before.
          </h1>
          <p className="text-base md:text-lg">
            Our chat app offers seamless communication, real-time updates, and a secure platform to keep your
            conversations private.
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-transparent px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-transparent px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto max-w-[70%] rounded-lg shadow-lg"
            style={{ aspectRatio: "5 / 4", objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}
