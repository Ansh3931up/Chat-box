
// import { Link } from 'lucide-react';
import { useEffect } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getUserData } from '../Redux/Reducer';
import updateImage from './update.jpg';

const Profile = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  
  const data=useSelector((state)=>state?.auth?.data);
  const avatar=useSelector((state)=>state?.auth?.avatar);
  const role=useSelector((state)=>state?.auth?.role);
  // console.log(data,avatar,role);
  
  
  async function logintoAccount() {
    const datas=await dispatch(getUserData());
    return datas;
  }

  useEffect(()=>{
    logintoAccount(); 
  },[dispatch])
  return (
    <main className="profile-page">
      <section className="relative block h-[500px]">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-yellow-900">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-orange-100 text-orange-500 w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    {avatar?(<img
                      
                      alt="..."
                      src={avatar}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                    />):<BsPersonCircle className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]" />}
                  </div>
                </div>
              
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{data?data?.Pincode:"loading..."}</span>
                      <span className="text-sm text-blueGray-400">Pincode</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{data?data?.State:"loading..."}</span>
                      <span className="text-sm text-blueGray-400">State</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{data?data?.role:"loading..."}</span>
                      <span className="text-sm text-blueGray-400">Role</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                 {data ? data?.fullname : "Loading..."}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {data?data?.email:"loading..."}
                </div>
               <div className="mb-2 text-blueGray-600 mt-10">
    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
    Subscribed Magazine: {data && data.isSubscribed && data.isSubscribed.length > 0 ? 
        data.isSubscribed.map((item) => (
            <div key={item._id}>{item.title}</div>
        )) :
        <span>No magazines subscribed</span>
    }
</div>

                
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                     {data?.address}
                    </p>
                     <button 
                            type="button" 
                            onClick={()=>navigate('editprofile',{state:{...data}})}
                            className="text-white bg-orange-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                        >
                            Edit Profile
                        </button>
                        <button 
                            type="button" 
                            onClick={()=>navigate('change-password',{state:{...data}})}
                            className="text-white bg-orange-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                        >
                            Change Password
                        </button>
                        
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="relative bg-blueGray-200 pt-8 pb-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                  Made with <a href="https://www.creative-tim.com/product/notus-js" className="text-blueGray-500 hover:text-gray-800" target="_blank" rel="noopener noreferrer">Respect</a> <a href="https://www.creative-tim.com" className="text-blueGray-500 hover:text-blueGray-800" target="_blank" rel="noopener noreferrer">By RSS</a>.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
};

export default Profile;
