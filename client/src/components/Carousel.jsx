import React from 'react';

function Carousel({ slide, image, totalslide, title, description }) {
  return (
    <div id={`slide${slide}`} className="carousel-item relative w-full">
      <div className="card lg:card-side bg-orange-50 text-orange-700 shadow-xl flex flex-col lg:flex-row">
        <figure className="w-full lg:w-1/3">
          <img src={image} alt="Album" className="w-full h-full object-cover" />
        </figure>
        <div className="card-body text-orange text-justify border-orange-500 lg:w-2/3">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end">
            {/* Additional actions if needed */}
          </div>
        </div>
      </div>
      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
        <a href={`#slide${slide === 1 ? totalslide : slide - 1}`} className="btn btn-circle">❮</a>
        <a href={`#slide${slide === totalslide ? 1 : slide + 1}`} className="btn btn-circle">❯</a>
      </div>
    </div>
  );
}

export default Carousel;
