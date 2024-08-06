import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterbyfullname } from '../Redux/Reducer';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        console.log("filteruser changed:", filteruser);
        console.log("Current ChatList:", ChatList);
        if (filteruser?.length!==0 && !ChatList?.find(user => user?._id === filteruser?._id)) {
            setChatList(prevChatList => {
                const updatedChatList = [...prevChatList, filteruser];
                console.log("Updated ChatList:", updatedChatList);
                return updatedChatList;
            });
            
        }
    }, [filteruser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(searchTerm.length===0)return;
        await dispatch(filterbyfullname(searchTerm));
    };

    const handleChatClick = (user) => {
        setSelectedChat(user);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`flex min-h-screen w-full flex-col bg-background text-foreground transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
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
                    <div className="w-8 h-8 border rounded-full overflow-hidden">
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className={`fixed inset-y-0 left-0 z-20 flex w-full max-w-xs flex-col bg-background shadow-lg md:static md:z-auto md:w-auto md:shadow-none ${isSidebarOpen ? "" : "hidden"} md:flex`}>
                    <div className="flex h-14 items-center justify-between border-b px-4 shadow-2xl transition-colors bg-slate-50 duration-300 dark:border-b-neutral-700 dark:bg-black dark:shadow-slate-500 dark:shadow-lg dark:text-white">
                        <h2 className="text-lg font-semibold">Chats</h2>
                        <button onClick={toggleSidebar} className="rounded-full p-2 md:hidden">
                            <i className="fas fa-times h-6 w-6"></i>
                        </button>
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
                    <div className="flex flex-1 items-center dark:bg-slate-900 bg-slate-100 dark:text-slate-400 justify-center text-center">
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

export default MainPage;
