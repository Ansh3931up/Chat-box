import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { filterbyfullname } from '../Redux/Reducer.jsx';
import { useDebounce } from './Hook/useDebounce';
import logo from './logo.png'; //

const menuItems = [
  { name: 'Chats', to: '/' },
  { name: 'Login', to: '/login' },
  { name: 'Signup', to: '/signup' }
];

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedCallBack = useDebounce((e) => setSearchTerm(e.target.value));
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(filterbyfullname(searchTerm));
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-background dark:bg-background-dark w-full border-b border-border dark:border-border-dark">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary dark:text-primary-dark">
          <img src={logo} alt="no image" className='h-20' />
         
        </Link>
        <div className="flex items-center gap-4">
          <form className="relative hidden md:block" onSubmit={handleSubmit}>
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
            <input
              type="search"
              placeholder="Search chats..."
              onChange={(e) => debouncedCallBack(e)}
              className="h-9 pl-8 pr-4 text-sm text-text dark:text-text-dark bg-background dark:bg-background-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
            />
          </form>
          <nav className="hidden items-center gap-4 md:flex">
            {menuItems.map(item => (
              <Link
                key={item.name}
                to={item.to}
                className="text-sm font-medium text-text dark:text-text-dark hover:underline underline-offset-4"
              >
                {item.name}
              </Link>
            ))}
            
          </nav>
        </div>
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black shadow-lg md:hidden">
          <div className="p-4">
            <button
              className="absolute top-4 right-4"
              onClick={toggleMenu}
            >
              <CloseIcon className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-lg font-bold text-primary dark:text-primary-dark" onClick={toggleMenu}>
                <WebcamIcon className="h-6 w-6" />
                <span>Chats</span>
              </Link>
              <form className="relative" onSubmit={handleSubmit}>
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
                <input
                  type="search"
                  placeholder="Search chats..."
                  onChange={(e) => debouncedCallBack(e)}
                  className="h-9 pl-8 pr-4 text-sm text-text dark:text-text-dark bg-background dark:bg-background-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
                />
              </form>
              {menuItems.map(item => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-sm font-medium text-text dark:text-text-dark hover:underline underline-offset-4"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function WebcamIcon(props) {
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
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 22h10" />
      <path d="M12 22v-4" />
    </svg>
  );
}

function CloseIcon(props) {
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
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

export default NavBar;
