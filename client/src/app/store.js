import { configureStore } from "@reduxjs/toolkit";

import { blogSlice } from "../Redux/Blog";
// import { filterSlice } from "../Redux/Filter";
import { photoSlice } from "../Redux/gallery";
import { PayCardSlice } from "../Redux/Payment";
import { RazorPaySlice } from "../Redux/RazorPaySlice";
import { authSlice } from "../Redux/Reducer";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, // Define your slice reducer here
    blog:blogSlice.reducer,
    photo:photoSlice.reducer,
    PayCard:PayCardSlice.reducer,
    RazorPay:RazorPaySlice.reducer
   
  },
});
