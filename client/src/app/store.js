import { configureStore } from "@reduxjs/toolkit";

import {  chatSlice } from "../Redux/Chat";

import { authSlice } from "../Redux/Reducer";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, // Define your slice reducer here
    chats:chatSlice.reducer,
   
   
  },
});
