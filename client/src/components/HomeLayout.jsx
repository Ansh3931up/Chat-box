import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import Landing from "./logo.jpeg";
import logo from "./logo.png";
// import './index.css';  // Ensure your CSS imports are correct for styling

const MovingStars = () => {
  const starVariants = {
    animate: {
      y: ['0%', '100%'],
      x: ['0%', '100%'],
      opacity: [0, 1, 0],
      transition: {
        y: { duration: 10, repeat: Infinity, ease: 'linear' },
        x: { duration: 10, repeat: Infinity, ease: 'linear' },
        opacity: { duration: 5, repeat: Infinity, ease: 'linear' },
      },
    },
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          variants={starVariants}
          animate="animate"
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    });
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <MovingStars />
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Chat App Logo"
            width="50"
            height="50"
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-purple-300">TransLingo</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-300 hover:text-purple-300 transition-colors">Home</Link>
          <Link href="/login" className="text-gray-300 hover:text-purple-300 transition-colors">Login</Link>
          <Link href="/signup" className="text-gray-300 hover:text-purple-300 transition-colors">Signup</Link>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-purple-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-gray-800 shadow-lg rounded-b-lg mx-4 relative z-20"
        >
          <nav className="flex flex-col space-y-4 p-4">
            <Link href="/" className="text-gray-300 hover:text-purple-300 transition-colors">Home</Link>
            <Link href="/login" className="text-gray-300 hover:text-purple-300 transition-colors">Login</Link>
            <Link href="/signup" className="text-gray-300 hover:text-purple-300 transition-colors">Signup</Link>
          </nav>
        </motion.div>
      )}

      <main className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Connect with friends and family like never before.
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Our chat app offers seamless communication, real-time updates, and a secure platform to keep your conversations private.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent hover:bg-purple-600 text-purple-300 font-semibold hover:text-white py-3 px-6 border border-purple-500 hover:border-transparent rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => window.location.href = '/login'}
            >
              Log In
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="md:w-1/2"
        >
          <img
            src={Landing}
            alt="Chat App Illustration"
            width="600"
            height="400"
            className="rounded-lg shadow-2xl"
          />
        </motion.div>
      </main>
      <footer className="bg-muted p-4 md:p-6 w-full">
      <div className="container max-w-7xl flex flex-col items-center justify-between gap-10 md:flex-row">
        <p className="text-sm text-muted-foreground">&copy; 2024 Chat App. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link to="/privacy" className="text-sm hover:underline">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm hover:underline">
            Terms
          </Link>
          <Link to="/about" className="text-sm hover:underline">
            About
          </Link>
          <div className="flex items-center gap-2">
            <Link to="#" className="text-muted-foreground hover:text-primary">
              <TwitterIcon className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary">
              <FacebookIcon className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary">
              <InstagramIcon className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </nav>
      </div>
    </footer>

    </div>
  );
}
function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

