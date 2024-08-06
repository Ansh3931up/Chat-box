// Css import
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
// Library import
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { store } from './app/store';
import Aboutpage from './components/Aboutpage';

import BlogDescriptionpage from './components/BlogDescriptionpage';
import BlogList from './components/BlogPages/BlogList';
import Contactpage from './components/Contactpage';
import CreateBlog from './components/CreateBlog';
import CreatePayCard from './components/CreatePaymentCard';
import Deniedpage from './components/Deniedpage';
import Editpassword from './components/Editpassword';
import EditProfile from './components/EditProfile';
import HomeLayout from './components/HomeLayout';
import Layout from './components/Layout';
import Loginpage from './components/Loginpage';
import Newsletter from './components/Newsletter';
import Notfoundpage from './components/Notfoundpage';
import PhotoGallery from './components/PhotoGallery';
import Profile from './components/Profile';
import RequireAuth from './components/RequireAuth';
import Signup from './components/Signup';
// import uploadPhoto from './components/UploadPhoto';
import UploadPhoto from './components/UploadPhoto';
import CheckoutPage from './components/CheckoutPage';
import CheckoutSuccess from './components/CheckoutSuccess';
import CheckoutFailure from './components/CheckoutFailure';
import MainPage from './components/MainPage';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<HomeLayout />} />
      <Route path="about" element={<Aboutpage />} />
     
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Loginpage />} />
      {/* <Route path="updates" element={<BlogList />} /> */}
      {/* <Route path="contact" element={<Contactpage />} /> */}
      <Route path="denied" element={<Deniedpage />} />
      <Route path="user/profile/change-password" element={<Editpassword />} />
      {/* <Route path="newsletter/checkout" element={< CheckoutPage/>} /> */}
      {/* <Route path='checkout/success' element={<CheckoutSuccess />} /> */}
      {/* <Route path='checkout/fail' element={<CheckoutFailure />} /> */}
      <Route path='main' element={<MainPage />} />
      <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="user/profile" element={<Profile />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="user/profile/editprofile" element={<EditProfile />} />
        </Route>
      {/* <Route path="newsletter" element={<Newsletter/>}/> */}
      {/* <Route path="gallery" element={<PhotoGallery />} /> */}
      {/* <Route path="upload/image" element={<UploadPhoto />} />       */}
      {/* <Route path="updates/description" element={<BlogDescriptionpage />} /> */}
      {/* <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
        <Route path="newsletter/create" element={<CreatePayCard />} />
      </Route> */}
      {/* <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
        <Route path="updates/create" element={<CreateBlog />} />
      </Route> */}
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
