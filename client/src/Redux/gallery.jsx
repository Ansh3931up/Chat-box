import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axios";


const initialState={
    photo:[],
}
export const uploadImage=createAsyncThunk('photo/uploadImage',async(data)=>{
    try {
        // console.log(data);
        const res=axiosInstance.post('photo/uploadphoto',data);
        toast.promise(
            res,{
                loading:"Wait! uploading your photo",
                success:(data)=>{
                    return data?.data?.message;
                },
                error:"Failed to upload photo"
            }
        );
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        
    }

}
)
export const getphotos=createAsyncThunk('phot/getphotos',async()=>{
    try {
        const response=axiosInstance.get('photo/getgalleries');
        return (await response).data;
    } catch (error) {
        console.log(error);
        
    }

})
export const photoSlice=createSlice({
    name:'photo',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(uploadImage.fulfilled,(state,action)=>{
            // console.log(action.payload);
            state.photo=action.payload;
        })
        builder.addCase(getphotos.fulfilled,(state,action)=>{
            // console.log(action.payload);
            state.photo=action.payload;
        })
    }

        
    
})


export default photoSlice.reducer;