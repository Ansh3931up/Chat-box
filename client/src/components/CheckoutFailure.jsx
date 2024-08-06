import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";

function CheckoutFailure() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-orange-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-orange-500">
            <RxCrossCircled size={48} />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-orange-500 sm:text-4xl">
            Payment Unsuccessful
          </h1>
          <p className="mt-4 text-orange-500">
            We're sorry, but your payment was not successful. Please try again or contact customer support if you need
            assistance.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/newsletter"
            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-orange-50 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            prefetch={false}
          >
            Try Again
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-orange-50 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            prefetch={false}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutFailure;
