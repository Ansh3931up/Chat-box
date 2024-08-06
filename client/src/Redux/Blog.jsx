import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axios";

const initialState = {
  BlogData: [], // Initialize blogs as an empty array
};

// Async thunk to fetch blog data
export const getblog = createAsyncThunk('blog/getall', async (data) => {
  try {
    const response = await axiosInstance.get('/blog', data);
    return response.data; // Return the actual data fetched
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to let Redux Toolkit handle it
  }
});

export const createblog=createAsyncThunk('blog/create',async(data)=>{
  try {
    const res = axiosInstance.post("blog/", data);
    toast.promise(res, {
        loading: "Wait! creating your account",
        success: (data) => {
            return data?.data?.message;
        },
        error: "Failed to create account"
    });
    return (await res).data;
} catch(error) {
    toast.error(error?.response?.data?.message);
}
});
export const removeBlog = createAsyncThunk('blog/remove', async (data) => {
  try { 
    // console.log("idata",data);
    const res = axiosInstance.delete(`/blog/${data.id}`);
    toast.promise(res, {
      loading: "Wait! removing your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to remove account"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
// Redux slice for blog state management
export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // You can add reducers here if needed
  },
  extraReducers: (builder) => {
    builder.addCase(getblog.fulfilled, (state, action) => {
      // Update state with fetched blog data when the promise is fulfilled
      // console.log("action",action.payload.data);
      state.BlogData = action.payload.data; // Assuming action.payload is an array of blog items
    }),
    builder.addCase(createblog.fulfilled, (state, action) => {
        state.BlogData.push(action.payload); // Assuming action.payload is the new blog item
    }),
    builder.addCase(removeBlog.fulfilled, (state, action) => {
      // console.log("blogdata",state.BlogData);
      if (Array.isArray(state.BlogData)) {
        console.log("blogdta", state.BlogData);
        state.BlogData = state.BlogData.filter((blog) => blog._id !== action.payload._id);
      } else {
        console.error('BlogData is not an array', state.BlogData);
      }
    })
  }
});

export default blogSlice.reducer;
