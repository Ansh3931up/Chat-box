import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardTitle } from "../components/CardComponent.jsx";
import { removePayCard } from '../Redux/Payment';

const PaymentCard = ({ data }) => {
  const navigate=useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
 
  
  // Local state to track if removal is in progress
  const [isRemoved, setIsRemoved] = useState(false);

  const handleRemove = async (id) => {
    try {
      // Dispatch remove action and wait for completion
      await dispatch(removePayCard({ id }));
      
      // Set removal status to true after successful removal
      setIsRemoved(true);
    } catch (error) {
      console.error('Failed to remove the item:', error);
    }
  };

  const handlePreview = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  useEffect(() => {
    // Trigger page refresh if removal was successful
    if (isRemoved) {
      window.location.reload();
    }
  }, [isRemoved]);

  return (
    <Card className="w-full max-w-sm rounded-lg border border-gray-200 overflow-hidden shadow-md">
      {/* Image */}
      {data?.thumbnail && (
        <img
          src={data?.thumbnail}
          alt="Card Thumbnail"
          className="w-full h-48 object-cover"
        />
      )}
      {/* Card Content */}
      <CardContent className="p-4">
        <div className="space-y-2">
          {data?.title && <CardTitle className="text-lg text-black font-semibold">{data?.title}</CardTitle>}
          {data?.description && <CardDescription className="text-gray-700">{data?.description}</CardDescription>}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xl text-black font-bold">₹{data.price}</div>
          <div className='flex gap-2'>
          <button 
              className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded transition-colors duration-300'
              onClick={()=>navigate("checkout",{ state: { ...data }},data)}
            >
              Buy Now
            </button>
            <button 
              className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded transition-colors duration-300'
              onClick={() => handlePreview(data.preview)}
            >
              Preview
            </button>
            {isLoggedIn && role === 'ADMIN' && (
              <button 
                className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition-colors duration-300'
                onClick={() => handleRemove(data._id)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
