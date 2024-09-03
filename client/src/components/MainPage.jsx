window.global = window;
import 'global';
import Draggable from 'react-draggable';

import '@fortawesome/fontawesome-free/css/all.min.css';
import { useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';


// import { useDebugValue } from 'react';
import { FaArrowCircleDown } from "react-icons/fa";
// import { useEffect,useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';

import { createsinglechat, deleteMessage, getAllMessages, sendmessage } from '../Redux/Chat';
import { filterbyfullname, logout, senduser, usersslide } from '../Redux/Reducer';


const MainPage = () => {
  
    const chatContainerRef = useRef(null);
    const socket = io('https://chat-box-8p3h.onrender.com');
    const [me, setMe] = useState('');
const [stream, setStream] = useState();
const [receivingCall, setReceivingCall] = useState(false);
const [caller, setCaller] = useState('');
const [callerSignal, setCallerSignal] = useState();
const [callAccepted, setCallAccepted] = useState(false);
const [callEnded, setCallEnded] = useState(false);
const [name, setName] = useState('');
const [callType, setCallType] = useState(''); // 'video' or 'audio'

const myVideo = useRef();
const userVideo = useRef();
const connectionRef = useRef();

    const [searchTerm, setSearchTerm] = useState("");
    const SinglesMessageData=useSelector((state)=>state?.chats?.SinglesMessageData);
    // console.log("sme",SinglesMessageData)
    const PrevChats=useSelector((state)=>state?.auth?.PreChats);
    // console.log("PrevChat",PrevChats);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message,setmessage]=useState([]);
    const [loading,setLoading]=useState(false);
    const [newmessage,setNewmessage]=useState('');  
    const dispatch = useDispatch();
    const filteruser = useSelector((state) => state?.auth?.filteruser);
    // console.log("filteruser",filteruser)
    const avatar = useSelector((state) => state?.auth?.avatar);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate=useNavigate();  
    const singlechatdata=useSelector((state)=>state?.chats?.SinglesChatData);
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    
    // useEffect(() => {
    //     scrollToBottom();
    // }, [message]);
    


    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
              setStream(stream);
              if (myVideo.current) {
                  myVideo.current.srcObject = stream;
              }
          })
          .catch((error) => {
              console.error("Error accessing media devices.", error);
          });
  
      socket.on('me', (id) => setMe(id));
  
      socket.on('call-user', ({ from, name: callerName, signal, callType }) => {
          setReceivingCall(true);
          setCaller(from);
          setCallerSignal(signal);
          setName(callerName);
          setCallType(callType);
      });
  }, []);
  
    const callUser = (id, type) => {
      setCallType(type);
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: type === 'video' ? stream : null,  // Ensure stream is correctly set
      });
  
      peer.on('signal', (data) => {
          socket.emit('call-user', {
              userToCall: id,
              signalData: data,
              from: me,
              name,
              callType: type,
          });
      });
  
      peer.on('stream', (stream) => {
          if (userVideo.current) {
              userVideo.current.srcObject = stream;
          }
      });
  
      socket.on('call-accepted', (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
      });
  
      connectionRef.current = peer;
  };
  
  const answerCall = () => {
      setCallAccepted(true);
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: callType === 'video' ? stream : null,  // Ensure stream is correctly set
      });
  
      peer.on('signal', (data) => {
          socket.emit('answer-call', { signal: data, to: caller });
      });
  
      peer.on('stream', (stream) => {
          if (userVideo.current) {
              userVideo.current.srcObject = stream;
          }
      });
  
      peer.signal(callerSignal);
      connectionRef.current = peer;
  };
  
    const leaveCall = () => {
      setCallEnded(true);
      connectionRef.current.destroy();
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
    async function fetchdata(){
        await dispatch(usersslide());
    }
    const ensureArray = (value) => Array?.isArray(value) ? value : [value];
    useEffect(()=>{
        fetchdata();
    },[dispatch])
    // useEffect(() => {
    //     const normalizedFilterUser = ensureArray(filteruser);
    //     if (normalizedFilterUser.length !== 0) {
    //         const newUsers = normalizedFilterUser.filter(fu => !ChatList.some(user => user._id === fu._id));
    //         if (newUsers.length > 0) {
    //             setChatList(prevChatList => {
    //                 const updatedChatList = [...prevChatList, ...newUsers];
    //                 console.log("Updated ChatList:", updatedChatList);
    //                 return updatedChatList;
    //             });
    //         }
    //     }
    // }, [filteruser]);
    
    useEffect(() => {
        const normalizedFilterUser = ensureArray(SinglesMessageData);
        if (normalizedFilterUser.length !== 0) {
            const newUsers = normalizedFilterUser?.filter(fu => Array.isArray(message) &&
                !message?.some(user => user._id === fu._id));
            if (newUsers?.length > 0) {
                setmessage(prevMessages => {
                    const updatedMessage = [...prevMessages, ...newUsers];
                    console.log("Updated ChatList:", updatedMessage);
                    return updatedMessage;   
            });
          }
        }
    }, [SinglesMessageData]);
    useEffect(() => {
        const fetchMessages = async () => {
            if (singlechatdata?._id) {
                await dispatch(getAllMessages(singlechatdata._id));
            }
        };
    
        const intervalId = setInterval(fetchMessages, 2000); // fetch messages every 5 seconds
    
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [singlechatdata, dispatch]);
    const handleDelete=async(data)=>{
        console.log(data,"data")
        await dispatch(deleteMessage(data));
        await dispatch(getAllMessages(singlechatdata?._id));
        
    }
    useEffect(() => {   
        setmessage(SinglesMessageData);
    }, [SinglesMessageData]);
    
    // useEffect(()=>{
    //     dispatch(getAllMessages(singlechatdata?._id));
    // },[singlechatdata,dispatch])
    const handleLogout=async(e)=>{
        e.preventDefault();
        await dispatch(logout());
        navigate('/');
        

        }
        const handleInputSubmit = async (e) => {
            e.preventDefault();
            if (newmessage && singlechatdata) {
              const formData = new FormData();
              formData.append('content', newmessage);
              formData.append('chatId', singlechatdata?._id);
          
              await dispatch(sendmessage(formData));
              setNewmessage("");
            } else {
              if (!newmessage) console.error('Message content is missing');
              if (!singlechatdata) console.error('SelectedChat is missing');
            }
          };
          
   
          const handleAttachment = async (e) => {
            e.preventDefault();
            const file = e.target.files[0];
        
            if (file && singlechatdata) {
                const formData = new FormData();
                formData.append('attachment', file); // Ensure field name matches the backend's expectation
                formData.append('chatId', singlechatdata?._id);
                try {
                    await dispatch(sendmessage(formData));
                } catch (error) {
                    console.error('Error sending message with attachment:', error);
                }
            } else {
                if (!file) console.error('File is missing');
                if (!singlechatdata) console.error('SelectedChat is missing');
            }
        };
        
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchTerm.length === 0) return;
        await dispatch(filterbyfullname(searchTerm));
        // Assuming filteruser is a list of filtered users, store it in senduser
        // dispatch(senduser(filteruser));
    };
    
    const handleChatClick = async (user) => {
        setLoading(true);
        setSelectedChat(user);
        console.log(user)
        await dispatch(createsinglechat(user._id.toString()));
        // Ensure the selected user is sent to the chat setup
        await dispatch(senduser({userId:user._id.toString()}));
        await dispatch(usersslide());
        
        if (isMobile) {
            setIsSidebarOpen(false);
        }
        setSearchTerm(()=>"");
        setLoading(false);
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
        <header className="sticky top-0 bg-purple-500 dark:text-white dark:bg-black z-10 flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm transition-colors duration-300 dark:border-b-neutral-700 ">
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
                            <DropdownMenuItem onClicks={() => navigate("user/profile")}>Profile</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClicks={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>

        {/* Draggable video windows */}
        <Draggable>
            <div className="video-container absolute top-20 left-20">
                <video playsInline muted ref={myVideo} autoPlay style={{ width: '150px', cursor: 'move' }} />
            </div>
        </Draggable>

        {callAccepted && !callEnded && (
            <Draggable>
                <div className="video-container absolute top-20 right-20">
                    <video playsInline ref={userVideo} autoPlay style={{ width: '150px', cursor: 'move' }} />
                </div>
            </Draggable>
        )}

        <div className="flex flex-1 overflow-hidden">
            <div className={`fixed inset-y-0 left-0 z-20 flex w-full max-w-xs flex-col bg-background shadow-lg md:static md:z-auto md:w-auto md:shadow-none ${isSidebarOpen ? "" : "hidden"} md:flex`}>
                <div className="flex h-14 items-center justify-between border-b px-4 shadow-2xl transition-colors bg-purple-400 duration-300 dark:border-b-neutral-700 border-purple-400 dark:border-slate-200 dark:bg-black dark:shadow-slate-500 dark:shadow-lg dark:text-white">
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full rounded-lg bg-muted pl-8 pr-4 p-1 transition-colors bg-purple-500 duration-300 text-white focus:outline-none focus:ring-1 focus:ring-primary ${isDarkMode ? "dark:text-white" : ""}`}
                        />
                    </form>
                    <div className="grid gap-2">
                        {filteruser !== null && searchTerm.length > 0 ? (
                            <div
                                className="flex rounded-md items-center gap-4 p-2 bg-purple-300 cursor-pointer hover:bg-muted dark:shadow-lg transition-all shadow-md dark:bg-slate-700"
                                onClick={() => handleChatClick(filteruser)}
                            >
                                <Avatar src={filteruser.avatar} alt="User" fallback="JP" />
                                <div>
                                    <p className="text-sm font-semibold">{filteruser.firstname} {filteruser.lastname}</p>
                                    <p className="text-xs text-muted-foreground">{filteruser.email}</p>
                                </div>
                            </div>
                        ) : Array.isArray(PrevChats) && PrevChats.length > 0 && searchTerm.length === 0 ? (
                            PrevChats.map((chat) => (
                                <div
                                    key={chat._id}
                                    className="flex rounded-md items-center gap-4 p-2 text-black bg-purple-300 cursor-pointer hover:bg-muted dark:shadow-lg transition-all shadow-md dark:bg-slate-700 dark:text-white"
                                    onClick={() => handleChatClick(chat)}
                                >
                                    <Avatar src={chat.avatar} alt="User" fallback="JP" />
                                    <div>
                                        <p className="text-sm font-semibold">{chat.fullname} </p>
                                        <p className="text-xs text-muted-foreground">{chat.email}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No recent chats</p>
                        )}
                    </div>
                </div>
            </div>
            {selectedChat ? (
                loading ? (
                    <div className='m-auto'>
                        <Loader />
                    </div>
                ) : (
                    <div className="flex flex-1 h-[92vh] flex-col">
                        <div className="flex h-14 items-center justify-between border-b px-4 shadow-sm transition-colors duration-300 bg-purple-800 dark:text-white dark:border-b-neutral-700 dark:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <label className="rounded-full p-2 cursor-pointer">
                                    <i className="fas fa-paperclip h-5 w-5"></i>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleAttachment}
                                    />
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="rounded-full p-2"
                                        onClick={() => callUser(selectedChat._id, 'video')}
                                    >
                                        <i className="fas fa-video h-5 w-5"></i>
                                    </button>
                                    <button
                                        className="rounded-full p-2"
                                        onClick={() => callUser(selectedChat._id, 'audio')}
                                    >
                                        <i className="fas fa-phone h-5 w-5"></i>
                                    </button>

                                    {receivingCall && !callAccepted && (
                                        <div>
                                            <h1>{name} is calling...</h1>
                                            <button onClick={answerCall}>Answer</button>
                                        </div>
                                    )}

                                    {callAccepted && !callEnded && (
                                        <button onClick={leaveCall}>End Call</button>
                                    )}
                                </div>

                                <button className="rounded-full p-2 self-end" onClick={scrollToBottom}>
                                    <FaArrowCircleDown size={24} />
                                </button>
                            </div>
                        </div>
                        <div ref={chatContainerRef} className='h-screen overflow-auto'>
                            <div className="flex-1 bg-purple-200 dark:bg-gray-900 dark:text-white p-4">
                                <div className="flex flex-col gap-4">
                                    {message.length > 0 && message.map((content) => (
                                        content.sender._id !== selectedChat._id ? (
                                            <LoginMessage
                                                key={content._id}
                                                avatar={avatar}
                                                message={content.content}
                                                attachment={content.attachment}
                                                onClick={() => handleDelete({ chatId: content.chat, messageId: content._id })}
                                            />
                                        ) : (
                                            <ChatMessage
                                                key={content._id}
                                                avatar={selectedChat.avatar}
                                                message={content.content}
                                                attachment={content.attachment}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleInputSubmit} className="sticky bottom-0 z-10 flex h-14 items-center border-t bg-background px-4 shadow-sm transition-colors duration-300 dark:border-t-neutral-700 bg-purple-400 dark:text-white dark:bg-neutral-800">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newmessage}
                                onChange={(e) => setNewmessage(e?.target?.value)}
                                className={`flex-1 rounded-full bg-muted px-4 py-2 text-sm transition-colors duration-300 focus:outline-none bg-purple-600 text-white dark:text-white focus:ring-1 focus:ring-primary ${isDarkMode ? "dark:bg-neutral-700 dark:text-foreground" : ""}`}
                            />
                            <button className="ml-2 rounded-full p-2" onClick={handleInputSubmit}>
                                <i className="fas fa-paper-plane h-5 w-5"></i>
                            </button>
                        </form>
                    </div>
                )
            ) : (
                <div className="flex flex-1 items-center text-purple-950 dark:bg-slate-900 bg-purple-200 dark:text-slate-400 justify-center text-center">
                    <p className="text-lg font-semibold">Select a chat to start messaging</p>
                </div>
            )}
        </div>
    </div>
);

};
const ChatMessage = ({ avatar, message, attachment }) => {
    return (
      <div className="flex items-start gap-4 self-end w-full">
        <div className="w-8 h-8 border rounded-full overflow-hidden">
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="grid gap-1 rounded-lg bg-muted p-3 bg-slate-400 text-white dark:text-white text-sm">
          {attachment && attachment.length > 0 && (
            <div className="flex items-center gap-2">
              {attachment.map((att, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img
                    src={att.url}
                    alt="Attachment"
                    className=" max-w-64 max-h-60 object-cover" // Increased width and height
                  />
                
                </div>
              ))}
            </div>
          )}
  
          <p>{message}</p>
          
        </div>
      </div>
    );
  };
  
  const LoginMessage = ({ avatar, message, attachment,onClick }) => {
    return (
      <div className="flex items-start gap-4 self-start w-full justify-end">
        <div className="grid gap-1 rounded-lg bg-primary p-3 text-white text-sm text-primary-foreground">
          {attachment && attachment.length > 0 && (
            <div className="flex items-center gap-2">
              {attachment.map((att) => (
                <div key={att._id} className="flex items-center gap-2">
                  <img
                    src={att.url}
                    alt="Attachment"
                    className=" max-w-64 max-h-60 object-cover" // Maintained original size
                  />
                
                </div>
              ))}
            </div>
          )}
  
          <p>{message}</p>
          <span onClick={onClick} className=' cursor-pointer'><MdDelete/></span>
        </div>
        <div className="w-8 h-8 border rounded-full overflow-hidden">
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  };



const Loader=()=> {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent" />
      </div>
    )
  }
  const Popup = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const filteruser = useSelector((state) => state?.auth?.filteruser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchTerm.length === 0) return;
        await dispatch(filterbyfullname(searchTerm));
        // Update senduser if needed
        dispatch(senduser(filteruser));
    };

    return (
        <div className="fixed inset-0 flex items-center dark:bg-gray-500 dark:text-white justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-white p-8 rounded-lg dark:bg-black dark:text-white shadow-lg w-4/5 max-w-screen-lg h-4/5">
                <button className="absolute top-2 right-2 text-black dark:text-white" onClick={onClose}>
                    Close
                </button>
                <h2 className="text-2xl mb-4">Create New Group</h2>
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    {/* Other form elements */}
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
