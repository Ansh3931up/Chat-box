// import React from 'react';
// import { Link } from 'react-router-dom';

function Photocomponent({ data }) {
  const handleClick = (e) => {
    e.preventDefault(); // Prevent default behavior
    window.open(data?.photo, '_blank');
  };
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
   
      <button className='hidden ' onClick={handleClick}></button><img
        onClick={handleClick}
        src={data?.photo}
        alt="Gallery Image"
        className="object-cover w-full h-64"
      /> 
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orange-500 to-transparent p-4 text-white">
      </div>
    </div>
  );
}

export default Photocomponent;
