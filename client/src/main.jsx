// Css import
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
// Library import
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { store } from './app/store';


// import Deniedpage from './components/Deniedpage';
import Editpassword from './components/Editpassword';
import EditProfile from './components/EditProfile';
import HomeLayout from './components/HomeLayout';
import Layout from './components/Layout';
import Loginpage from './components/Loginpage';
import MainPage from './components/MainPage';
// import Newsletter from './components/Newsletter';
import Notfoundpage from './components/Notfoundpage';
import Profile from './components/Profile';
import Signup from './components/Signup';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<HomeLayout />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Loginpage />} />
      <Route path="user/profile/change-password" element={<Editpassword />} />
      <Route path='main' element={<MainPage />} />
        <Route path="main/user/profile" element={<Profile />} />
    
          <Route path="main/user/profile/editprofile" element={<EditProfile />} />
       
      <Route path="*" element={<Notfoundpage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <Toaster />
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
