import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axios";

const initialState = { 
    key: "",
    order_id: "",
    isPaymentVerified: false,
    allPayments: {},
    monthlySalesRecord: []
};

export const getpaymentkey = createAsyncThunk('payment/getkey', async () => {
    try {
        const response = await axiosInstance.get('payments/razorpay-key');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response.data;
    }
});

export const orderPayment = createAsyncThunk('payment/order', async (data) => {
    try {
        const response = await axiosInstance.post('payments/order-payment', data);
        console.log("response", response)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response.data;
    }
});

export const verifyPayment = createAsyncThunk('payment/verify', async (data) => {
    try {
        const response = await axiosInstance.post('payments/verify', data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response.data;
    }
});

export const allPayments = createAsyncThunk('payment/allPayments', async () => {
    try {
        const response = await axiosInstance.get('payments/');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response.data;
    }
});

export const RazorPaySlice = createSlice({  
    name: 'RazorPay',
    initialState,
    reducers: {
        // Add any additional reducers if needed
    },
    extraReducers: (builder) => {
        builder.addCase(getpaymentkey.fulfilled, (state, action) => {
            console.log("action--",action)
            state.key = action.payload.data;
        });
        builder.addCase(orderPayment.fulfilled, (state, action) => {
            // console.log("orderPayment fulfilled action", action.payload);
            state.order_id = action.payload.data.id;
        });
        builder.addCase(verifyPayment.fulfilled, (state, action) => {
            // console.log(action);
            toast.success(action.payload.message);
            state.isPaymentVerified = action.payload.success;
        });
        builder.addCase(allPayments.fulfilled, (state, action) => {
            // console.log("allPayments fulfilled action", action.payload);  
            state.allPayments = action.payload.allPayments;
            state.monthlySalesRecord = action.payload.monthlySalesRecord;
        });
    }
});

export default RazorPaySlice.reducer;
