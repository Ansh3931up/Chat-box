import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getpaymentkey, orderPayment, verifyPayment } from "../Redux/RazorPaySlice";

function Checkout() {
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const razorpayKey = useSelector((state) => state.RazorPay.key);
    const order_id = useSelector((state) => state?.RazorPay?.order_id);

    const newData = {
        amount: state.price,
        receipt: generateReceipt()
    };

    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_order_id: "",
        razorpay_signature: "",
        paycardid: state._id
    };

    async function handlePayment(e) {
        e.preventDefault();
        if (!razorpayKey || !order_id) {
            toast.error("Something went wrong");
            return;
        }

        const options = {
            key: razorpayKey,
            amount: newData.amount,
            currency: "INR",
            name: "RSS",
            description: "Order Payment",
            order_id: order_id,
            handler: async function (response) {
                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;
                paymentDetails.razorpay_order_id = response.razorpay_order_id;

                toast.success("Payment successful");
                const res = await dispatch(verifyPayment(paymentDetails));
                res?.payload?.statusCode === 200 ? navigate("/checkout/success") : navigate("/checkout/fail");
            },
            theme: {
                color: '#F37254'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    async function load() {
        try {
            await dispatch(getpaymentkey());
            const orderResponse = await dispatch(orderPayment(newData));
            newData.order_id = orderResponse.payload.data.order_id; // Store the order ID from response
        } catch (error) {
            toast.error("Failed to load payment details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [dispatch]);

    return (
        <form onSubmit={handlePayment} className="min-h-[90vh] flex items-center justify-center bg-orange-100 text-orange-50">
            <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                <h1 className="bg-orange-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">Order Payment</h1>
                <div className="px-4 space-y-5 text-center">
                    <p className="text-[17px] text-orange-500">
                        This purchase will allow you to access our magazine hard copy on our platform 
                        <span className="text-orange-500 font-bold"><br /></span> 
                        All the existing and new launched magazine will be also available for sale too.
                    </p>
                    <p className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-500">
                        <BiRupee /><span>{state?.price}</span> only
                    </p>
                    <div className="text-orange-400">
                        <p>100% refund on cancellation</p>
                        <p>* Terms and conditions applied *</p>
                    </div>
                    <button 
                        type="submit" 
                        className={`bg-orange-500 text-orange-50 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        Buy now
                    </button>
                </div>
            </div>
        </form>
    );
}

function generateReceipt() {
    return `receipt_${Math.random().toString(36).substr(2, 9)}`;
}

export default Checkout;
