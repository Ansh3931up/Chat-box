import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axios";

const initialState = {
  SinglesChatData: [], // Initialize blogs as an empty array
  SinglesMessageData:[]
};

// Async thunk to fetch blog data
export const createsinglechat = createAsyncThunk("chat-app/createsinglechat", async (data) => {
  
  try {
    
    const response = await axiosInstance.post(`/chat-app/chat/c/${data}`);
    return response.data; // Return the actual data fetched
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to let Redux Toolkit handle it
  }
});
export const deleteMessage=createAsyncThunk('chat-app/deleteMessage',async(data)=>{
  try {
    console.log("data",data.chatId,"data2",data.messageId);
    const res=axiosInstance.delete(`/chat-app/message/${data.chatId}/${data.messageId}`);
    return (await res).data;
  } catch (error) {
    console.log(error);
  }
}
);

export const sendmessage = createAsyncThunk('chat-app/sendmessage', async (formData) => {
  try {
    const res = await axiosInstance.post(`/chat-app/message/${formData.get('chatId')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error; // Ensure to propagate the error
  }
});

export const getAllMessages = createAsyncThunk('chat-app/getmessage', async (data) => {
  try { 
    // console.log("idata",data);
    const res = axiosInstance.get(`/chat-app/message/${data}`);
   
    return (await res).data;
  } catch (error) {
    
    console.log(error)
  }
});
// Redux slice for blog state management
export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    // You can add reducers here if needed
  },
  extraReducers: (builder) => {
    builder.addCase(createsinglechat.fulfilled, (state, action) => {
      // Update state with fetched blog data when the promise is fulfilled
      // console.log("action",action.payload.data);
      state.SinglesChatData = action.payload.data; // Assuming action.payload is an array of blog items
    }),
    builder.addCase(sendmessage.fulfilled, (state, action) => {
      // Update state with fetched blog data when the promise is fulfilled
      // console.log("action1",action.payload.data);

      state.SinglesMessageData = action.payload.data; // Assuming action.payload is an array of blog items
    }),
    builder.addCase(getAllMessages.fulfilled, (state, action) => {
      // console.log("action2",action.payload.data);
      state.SinglesMessageData = action.payload.data.slice().reverse(); // Assuming action.payload is an array of blog items

    })
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      // console.log("action",action.payload.data);
      state.SinglesMessageData = action.payload.data; // Assuming action.payload is an array of blog items

    })
  }
});

export default chatSlice.reducer;
