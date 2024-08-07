import { useEffect } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../Redux/Reducer';
import updateImage from './update.jpg';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const data = useSelector((state) => state?.auth?.data);
  const avatar = useSelector((state) => state?.auth?.avatar);
  
  async function logintoAccount() {
    const datas = await dispatch(getUserData());
    return datas;
  }

  useEffect(() => {
    logintoAccount(); 
  }, [dispatch]);

  return (
    <main className="profile-page">
      <section className="relative block h-96">
      <div
  className="absolute top-0 w-full h-full bg-center bg-cover bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600"
>
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-20">
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
              className="text-gray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-center bg-cover bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 lg:order-2 flex justify-center">
                  <div className="flex justify-center items-center">
                    {avatar ? (
                      <img
                        alt="..."
                        src={avatar}
                        className="shadow-xl rounded-full h-auto border-none max-w-[150px]"
                      />
                    ) : (
                      <BsPersonCircle className="shadow-xl rounded-full h-auto align-middle border-none max-w-[150px]" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                  {data ? data?.fullname : "Loading..."}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {data ? data?.email : "Loading..."}
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
                      onClick={() => navigate('editprofile', { state: { ...data } })}
                      className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('change-password', { state: { ...data } })}
                      className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </section>
    </main>
  );
};

export default Profile;
