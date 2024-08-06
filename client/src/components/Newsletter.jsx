import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllPaycard } from "../Redux/Payment.jsx";
import PaymentCard from "./PaymentCard.jsx";
import updateImage from "./update.jpg"; // Import the background image

function Newsletter() {
    const dispatch = useDispatch();
    const PaymentData = useSelector((state) => state.PayCard.PaymentData.data);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    useEffect(() => {
        dispatch(getAllPaycard());
    }, [dispatch]);

    return (
        <div 
            className="min-h-screen pt-12 px-4 md:px-20 flex flex-col gap-10 text-white"
            style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <h1 className="text-3xl md:text-4xl font-bold text-center">Our Latest Magazine</h1>
            <span className="font-bold text-xl md:text-2xl text-center">By RSS</span>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PaymentData?.map((element) => (
                    <PaymentCard key={element._id} data={element} />
                ))}
            </div>
            {isLoggedIn && role === "ADMIN" && (
                <div className="text-center mt-8">
                    <Link 
                        to="/newsletter/create" 
                        className="text-white bg-orange-500 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                    >
                        Add New Magazine
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Newsletter;
