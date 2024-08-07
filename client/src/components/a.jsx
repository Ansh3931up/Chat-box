import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SearchSection from "../SearchSection";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import Loader from "../Loader";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";


import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ENDPOINT = 'http://localhost:8000'; // Replace with your backend server URL

const MainPage = ({ user }) => {
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChatCompare, setSelectedChatCompare] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const transferData = {
                    "userId": user.id,
                };
                const { data } = await axios.post(`${ENDPOINT}/api/fetchchat`, transferData);
                setChats(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchChats();
    }, [user.id]);

    useEffect(() => {
        const newsocket = io(ENDPOINT);
        setSocket(newsocket);
        newsocket.emit("setup", user);
        newsocket.on('connected', () => setSocketConnected(true));
        newsocket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // Handle the new message
            }
        });

        return () => {
            newsocket.disconnect();
        };
    }, [user, selectedChatCompare]);

    return (
        <div>
            {/* Your component JSX here */}
        </div>
    );
};

export default MainPage;.messages, data]);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const isLoggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        if (!isLoggedInUser) {
            navigate("/users/sign_in");
        }

        myChats();



    }, [])






    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    // console.log(chats, 'userdetails');

    return (
        <div className="w-screen flex">
            <div className="w-[30%] border h-screen bg-secondary flex flex-col ">
                <div className="flex items-center justify-center my-8">
                    <img src={user?.imageUrl} alt="" className="rounded-full w-[20%]" />
                    <div className="ml-8">
                        <h3 className=" text-2xl">{user?.fullName}</h3>
                        <p className="text-lg font-light">My Account</p>
                        <p className="text-primary font-semibold cursor-pointer" onClick={() => userLogout()}>Logout</p>
                    </div>

                </div>


                <div className="flex flex-col gap-[0.2rem]">
                    {chats?.map((chat) => (
                        <>
                            <div className={`bg-${selectedChat === chat ? "[#1476ff]" : "[#E8E8E8]"} cursor-pointer  text-${selectedChat === chat ? "white" : "black"} px-2 py-3 rounded-lg `} key={chat._id} onClick={() => setSelectedChat(chat)}   >
                                <h3>{!chat.isGroupChat ? getSender(user.id, chat.users) : chat.chatName}</h3>
                            </div>
                        </>
                    ))
                    }
                </div >


            </div>
            <div className="w-[75%] border h-screen bg-white flex flex-col items-center">
                {selectedChat ? (
                    <>
                        {chatLoading ? (<div className="h-[100%] w-[100%] flex items-center justify-center"><Loader /></div>) : (<>
                            <ShowChat otherUserInfo={getSenderFull(user.id, selectedChat.users)} />

                            <div className="w-full flex gap-[1rem]">
                                <input
                                    type="text"

                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[75%] ml-[2rem] my-[1.2rem] outline-none border-none px-6 py-4 '
                                    placeholder="Enter your text"
                                    value={sendNewMessage}
                                    onChange={(e) => setSendNewMessage(e.target.value)}


                                />

                                <div className="flex items-center justify-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => sendMessageFunc()} className="icon icon-tabler icon-tabler-send cursor-pointer" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M10 14l11 -11" />
                                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus cursor-pointer" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                        <path d="M9 12h6" />
                                        <path d="M12 9v6" />
                                    </svg>
                                </div>
                            </div>
                        </>)}

                    </>

                ) : (<>
                    <div className="h-screen flex  items-center justify-center">

                        <h3 className="font-semibold">Select a user to start conversation.</h3>
                    </div>
                </>)}
            </div >
            <div className="w-[20%] border h-screen ">
                <h3 className="text-[1.5rem] font-bold text-center mt-[1rem]">Search Users:</h3>
                <SearchSection />
                {/* <h3 className="text-[1.5rem] font-bold text-center mt-[1rem]">Create Group:</h3> */}
            </div>
        </div >

    )
}

export default Dashboard