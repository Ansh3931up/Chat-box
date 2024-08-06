import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axios";

const initialState = {
  PaymentData: [], // Initialize PaymentData as an empty array
};

// Async thunk to fetch payment data
export const getAllPaycard = createAsyncThunk('PayCard/getall', async (data) => {
  console.log("Fetching payment data");
  try {
    const response = await axiosInstance.get('/payment', data);
    console.log("Fetched response", response);
    return response.data; // Return the actual data fetched
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to let Redux Toolkit handle it
  }
});

export const removePayCard = createAsyncThunk('PayCard/remove', async (data) => {
  try { 
    console.log("Removing payment card", data);
    const res = axiosInstance.delete(`/payment/${data.id}`);
    toast.promise(res, {
      loading: "Removing your card",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to remove card"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to remove card");
    throw error;
  }
});

export const createCard = createAsyncThunk('PayCard/create', async (data) => {
  try {
    console.log("this data",data);
    const res = axiosInstance.post("/payment", data);
    toast.promise(res, {
      loading: "Creating your card",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create card"
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create card");
    throw error;
  }
});

// Redux slice for payment state management
export const PayCardSlice = createSlice({
  name: 'PayCard',
  initialState,
  reducers: {
    // You can add reducers here if needed
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPaycard.fulfilled, (state, action) => {
     
        state.PaymentData = action.payload;
    
       
      
    });

    builder.addCase(removePayCard.fulfilled, (state, action) => {
    
        state.PaymentData = state.PaymentData.filter((item) => item._id !== action.payload._id);
      
    });

    builder.addCase(createCard.fulfilled, (state, action) => {
      console.log("Action payload for createCard:", action.payload);
        state.PaymentData.push(action.payload);
  });
  }
});

export default PayCardSlice.reducer;
