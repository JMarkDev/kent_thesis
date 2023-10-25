
import React, { useState, useEffect, useCallback } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import SpinnerTemp from '../../../components/SpinnerTemp'

function CarouselComponent({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [strandImages, setStrandImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);

  useEffect(() => {
    setStrandImages(images);
  }, [images]);

  useEffect(() => {
    if (images.length > 0) {
      setIsLoading(false);
      if (images.length === 1) {
        setAutoSlideEnabled(false);
      }
    }
  }, [images]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto slide every 5 seconds if autoSlideEnabled is true
  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === strandImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, strandImages]);

  useEffect(() => {
    if (autoSlideEnabled) {
      const interval = setInterval(() => {
        if (!isLoading) {
          nextSlide();
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, isLoading, autoSlideEnabled, nextSlide]);


  if (isLoading) {
    return <div>
    <SpinnerTemp />
    </div>; // Display a loading indicator
  }

  return (
    <div className="mx-auto p-10 bg-white dark-bg-black">
      <div
        style={{
          backgroundImage: `url(http://localhost:3001/uploads/${strandImages[currentIndex]})`,
        }}
        className="w-auto h-96 rounded-2xl bg-center bg-cover duration-500 mt-10"
      ></div>
      {/* Left Arrow */}
      <div
        className="hover:opacity-50 absolute top-[60%] -translate-x-0 left-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={prevSlide}
      >
        <BsChevronCompactLeft size={30} />
      </div>
      {/* Right Arrow */}
      <div
        className="hover:opacity-50 absolute top-[60%] -translate-x-0 right-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={nextSlide}
      >
        <BsChevronCompactRight size={30} />
      </div>
      <div className="flex top-4 justify-center py-2">
        {strandImages.map((image, slideIndex) => (
          <RxDotFilled
            key={slideIndex}
            active={slideIndex === currentIndex ? 'true' : 'false'}
            onClick={() => goToSlide(slideIndex)}
          />
        ))}
      </div>
    </div>
  );
}

export default CarouselComponent;
