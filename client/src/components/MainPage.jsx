import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterbyfullname, logout } from '../Redux/Reducer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createsinglechat } from '../Redux/Blog';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [ChatList, setChatList] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message,setmessage]=useState("");
    const dispatch = useDispatch();
    const filteruser = useSelector((state) => state?.auth?.filteruser);
    const avatar = useSelector((state) => state?.auth?.avatar);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate=useNavigate();
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const ensureArray = (value) => Array?.isArray(value) ? value : [value];

    useEffect(() => {
        console.log("filteruser changed:", filteruser);
        console.log("Current ChatList:", ChatList);
        const normalizedFilterUser = ensureArray(filteruser);

        if (normalizedFilterUser.length !== 0) {
            const newUsers = normalizedFilterUser?.filter(fu => !ChatList.some(user => user._id === fu._id));
            if (newUsers?.length > 0) {
                setChatList(prevChatList => {
                    const updatedChatList = [...prevChatList, ...newUsers];
                    console.log("Updated ChatList:", updatedChatList);
                    return updatedChatList;
                });
            }
        }
        
    }, [filteruser]);
    const handleLogout=async(e)=>{
        e.preventDefault();
        await dispatch(logout());
        navigate('/');
        

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(searchTerm.length===0)return;
        await dispatch(filterbyfullname(searchTerm));
    };

    const handleChatClick = (user) => {
        // console.log("userid",user._id)
        setSelectedChat(user);
        dispatch(createsinglechat(user._id.toString()));
        
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };
    const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAdd = () => {
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`flex min-h-screen w-full flex-col bg-background text-foreground {isPopupOpen ? 'filter blur-sm' : ''} transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
            <header className="sticky top-0 bg-slate-50 dark:text-white dark:bg-black z-10 flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm transition-colors duration-300 dark:border-b-neutral-700 ">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="rounded-full p-2">
                        <i className="fas fa-bars h-6 w-6"></i>
                    </button>
                    <h1 className="text-lg font-semibold">Chat App</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleDarkMode} className="rounded-full p-2">
                        {isDarkMode ? <i className="fas fa-sun h-6 w-6"></i> : <i className="fas fa-moon h-6 w-6"></i>}
                    </button>
                    <div className="relative inline-block text-left">
      <div>
        <button onClick={toggleDropdown} className="flex items-center cursor-pointer">
          <Avatar src={avatar} alt="User" fallback="JP" />
          <span className="sr-only">Toggle user menu</span>
        </button>
      </div>
      {isDropdownOpen && (
        <DropdownMenu onClose={toggleDropdown}>
          <DropdownMenuItem onClicks={()=>navigate("user/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  className="text-destructive" onClicks={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenu>
      )}
    </div>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className={`fixed inset-y-0 left-0 z-20 flex w-full max-w-xs flex-col bg-background shadow-lg md:static md:z-auto md:w-auto md:shadow-none ${isSidebarOpen ? "" : "hidden"} md:flex`}>
                    <div className="flex h-14 items-center justify-between border-b px-4 shadow-2xl transition-colors bg-slate-400 duration-300 dark:border-b-neutral-700 border-gray-400 dark:border-slate-200 dark:bg-black dark:shadow-slate-500 dark:shadow-lg dark:text-white">
                        <h2 className="text-lg font-semibold">Chats</h2>
                       <div className='flex flex-row gap-2'>
                       <button className="flex items-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700" onClick={handleAdd}>
                        <FaPlus />
                        </button>
                       <button onClick={toggleSidebar} className="rounded-full p-2 md:hidden">
                            <i className="fas fa-times h-6 w-6"></i>
                        </button>
                       </div>
                       {isPopupOpen && <Popup onClose={handleClose} />}
                    </div>
                    <div className="flex-1 overflow-auto shadow-2xl p-4 bg-slate-100 dark:shadow-lg dark:shadow-slate-700 dark:bg-slate-900">
                        <form onSubmit={handleSubmit} className="relative mb-4">
                            <i className="fas fa-search absolute left-2 top-2 h-4 w-4 text-muted-foreground"></i>
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => setSearchTerm(e?.target?.value)}
                                className={`w-full rounded-lg bg-muted pl-8 pr-4 p-1 transition-colors bg-slate-500 duration-300 text-white focus:outline-none focus:ring-1 focus:ring-primary ${isDarkMode ? "dark:bg-neutral-700 dark:text-white" : ""}`}
                            />
                        </form>
                        <div className="grid gap-2">
                            
                                {filteruser?.length > 0 ? (
                                    <div
                                        className="flex rounded-md items-center gap-4 p-2 bg-slate-300 cursor-pointer hover:bg-muted dark:shadow-slate-800 dark:bg-slate-600 shadow-lg dark:text-white"
                                        key={filteruser?._id}
                                        onClick={() => handleChatClick(filteruser)}
                                    >
                                        <div className="w-8 h-8 border rounded-full overflow-hidden">
                                            <img src={filteruser?.avatar || "/placeholder-user.jpg"} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{filteruser?.fullname}</p>
                                            <p className="text-sm text-muted-foreground">hey what's going on? · 2h</p>
                                        </div>
                                    </div>
                                ) : null}
                            
                            
                                {ChatList.length > 0 && ChatList?.map((user, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex shadow-lg dark:shadow-slate-700 items-center gap-4 p-2 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-md cursor-pointer hover:bg-muted"
                                            onClick={() => handleChatClick(user)}
                                        >
                                            <div className="w-8 h-8 border rounded-full overflow-hidden">
                                                <img src={user?.avatar || "/placeholder-user.jpg"} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{user?.fullname}</p>
                                                <p className="text-sm text-muted-foreground">hey what's going on? · 2h</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            
                        </div>
                    </div>
                </div>
                {selectedChat ? (
                    <div className="flex flex-1 flex-col ">
                        <div className="flex h-14 items-center justify-between border-b px-4 shadow-sm transition-colors duration-300 bg-slate-400 dark:text-white dark:border-b-neutral-700 dark:bg-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border rounded-full overflow-hidden">
                                    <img src={selectedChat?.avatar || "/placeholder-user.jpg"} alt={selectedChat?.name} className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-lg font-semibold">{selectedChat?.fullname}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="rounded-full p-2">
                                    <i className="fas fa-paperclip h-5 w-5"></i>
                                </button>
                                <button className="rounded-full p-2">
                                    <i className="fas fa-video h-5 w-5"></i>
                                </button>
                                <button className="rounded-full p-2">
                                    <i className="fas fa-phone h-5 w-5"></i>
                                </button>
                                <button className="rounded-full p-2">
                                    <i className="fas fa-arrows-alt-h h-5 w-5"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-slate-200 dark:bg-gray-900 dark:text-white p-4">
                            <div className="grid gap-4">
                                <Chatmessage avatar={selectedChat.avatar} message={"Hey, how's it going?"} />
                                <LoginMessage avatar={avatar} message={"All good, thanks! How about you?"} />
                            </div>
                        </div>
                        <div className="sticky bottom-0 z-10 flex h-14 items-center border-t bg-background px-4 shadow-sm transition-colors duration-300 dark:border-t-neutral-700 bg-slate-400 dark:text-white dark:bg-neutral-800">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                onChange={(e)=>setmessage(e?.target?.value)}
                                className={`flex-1 rounded-full bg-muted px-4 py-2 text-sm transition-colors duration-300 focus:outline-none bg-slate-600 text-white dark:text-white focus:ring-1 focus:ring-primary ${isDarkMode ? "dark:bg-neutral-700 dark:text-foreground" : ""}`}
                            />
                            <button className="ml-2 rounded-full p-2">
                                <i className="fas fa-paper-plane h-5 w-5"></i>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-1 items-center dark:bg-slate-900 bg-slate-200 dark:text-slate-400 justify-center text-center">
                        <p className="text-lg font-semibold">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};
const Chatmessage = ({ avatar, message }) => {  
    return (
        <><div className="flex items-start gap-4">
    <div className="w-8 h-8 border rounded-full overflow-hidden">
        <img src={avatar} alt='no image' className="w-full h-full object-cover" />
    </div>
    <div className="grid gap-1 rounded-lg bg-muted p-3 bg-slate-400 text-black dark:text-white text-sm">
        <p>{message}</p>
    </div>
</div></>
    )
}

const LoginMessage = ({ avatar, message }) => {
    return (
        <div className="flex items-start gap-4 self-end">
            <div className="w-8 h-8 border rounded-full overflow-hidden">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="grid gap-1 rounded-lg bg-primary p-3 text-white text-sm text-primary-foreground">
                <p>{message}</p>
            </div>
        </div>
    );
};
const Popup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center dark:bg-gray-500 dark:text-white justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white p-8 rounded-lg dark:bg-black dark:text-white shadow-lg w-4/5 max-w-screen-lg h-4/5">
          <button className="absolute top-2 right-2 text-black dark:text-white" onClick={onClose}>
            Close
          </button>
          <h2 className="text-2xl mb-4">Create New Group</h2>
          <form className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="groupName">Group Name</label>
              <input
                id="groupName"
                placeholder="Enter group name"
                className="p-2 border border-gray-300 dark:bg-gray-700 rounded"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="searchParticipants">Search Participants</label>
              <input
                id="searchParticipants"
                placeholder="Search for participants"
                className="p-2 border border-gray-300 dark:bg-gray-700 rounded"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="selectedParticipants">Selected Participants</label>
              <div className="grid gap-2">
                {[1, 2, 3, 4, 5].map((participant) => (
                  <div key={participant} className="flex items-center gap-2">
                    <input type="checkbox" id={`participant${participant}`} />
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                      P{participant}
                    </div>
                    <div>Participant {participant}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 ">
              <button
                type="button"
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
   

  const Avatar = ({ src, alt, fallback }) => {
    return src ? (
        <img src={src} alt={alt} className="h-8 w-8 rounded-full object-cover" />
    ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {fallback}
        </div>
    );
};
  const DropdownMenu = ({ children, onClose }) => {
    return (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {children}
            </div>
        </div>
    );
};
  const DropdownMenuItem = ({ children, onClicks }) => {
    return (
        <a
            
            onClick={onClicks}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            role="menuitem"
        >
            {children}
        </a>
    );
};
  
  const DropdownMenuSeparator = () => {
    return <div className="border-t border-gray-100 dark:border-gray-700"></div>;
};

export default MainPage;
