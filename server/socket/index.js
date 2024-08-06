
import { User } from "../module/user.model.js";
import ApiError from "../utilities/ApiError.js";
import {  ChatEventEnum } from "../src/constant.js";   
import jwt from "jsonwebtoken";
import cookie from "cookie"



const mountJointChatEvent=(socket)=>{
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT,async (chatId)=>{
    console.log("User joined the chat",chatid);
    socket.join(chatId);     
});
};

const mountParticipantTypingEve=(socket)=>{
    socket.on(ChatEventEnum.TYPING_EVENT,async (chatId)=>{
    console.log("User is typing",chatid);
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT,chatId);
}); 
}

const mountParticipantStopTypingEve=(socket)=>{
    socket.on(ChatEventEnum.STOP_TYPING_EVENT,async (chatId)=>{
    console.log("User stopped typing",chatid);
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT,chatId);
}); 
}

const initializeSocketIO=(io)=>{
    return io.on("connection",async(socket)=>{
        try {
            const cookies=cookie.parse(socket.handshake.headers?.cookie||"");

            let token=cookies?.accessToken;

            if(!token){
                token=socket.handshake.auth?.token;
            }
            if (!token) {
                // Token is required for the socket to work
                throw new ApiError(401, "Un-authorized handshake. Token is missing");
              }
              const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
                const user=await User.findById(decodedToken?._id).select(
                    "-password -refreshToken"
                );
                if(!user){
                    throw new ApiError(404,"no user found")
                }
                socket.user=user;
                socket.join(user,_id.toString());
                socket.emit(ChatEventEnum.CONNECTED_EVENT);
                console.log("user connected",user._id.toString());
                mountJointChatEvent(socket)
                // mountParticipantStopTypingEve();
                mountParticipantTypingEve(socket)
                mountParticipantStopTypingEve(socket)

                socket.on(ChatEventEnum.DDISCONNECT_EVENT, () => {
                    console.log("user has disconnected 🚫. userId: " + socket.user?._id);
                    if (socket.user?._id) {
                      socket.leave(socket.user._id);
                    }
                  });
                    } catch (error) {
            socket.emit(
                ChatEventEnum.SOCKET_ERROR_EVENT,
                error?.message || "Something went wrong while connecting to the socket."
              );
            
        }
    })
}
const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
  };
  export {emitSocketEvent,initializeSocketIO}