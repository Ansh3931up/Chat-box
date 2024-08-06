import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { orderPayment } from "../Redux/RazorPaySlice";

function CheckoutSuccess() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(orderPayment());
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-orange-50 p-4">
            <div className="max-w-md w-full space-y-4 text-center">
                <CircleCheckIcon className="mx-auto h-16 w-16 text-orange-500" />
                <h1 className="text-3xl font-bold text-orange-500">Order Confirmed</h1>
                <p className="text-muted-foreground">
                    Thank you for your order! We're processing your purchase and will send you a confirmation email shortly.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-orange-50 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
}

function CircleCheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

export default CheckoutSuccess;
