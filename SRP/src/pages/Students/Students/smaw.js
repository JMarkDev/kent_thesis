import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { Carousel } from "@material-tailwind/react";
import { Link} from "react-router-dom";


function CarouselComponent() {
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1581093577421-f561a654a353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className=' mx-auto  p-10 bg-blue-300 dark:bg-black'>
      <Link to="/Strands" className=" p-2 md:p-4 text-center">
        <button className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-2 rounded-md absolute top-20 mt-3">
          BACK
        </button>
      </Link>
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="w-auto h-96 rounded-2xl bg-center bg-cover duration-500"
      ></div>
      {/* Left Arrow */}
      <div className=" hover:opacity-50 absolute top-[60%] -translate-x-0  left-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={prevSlide}>
        <BsChevronCompactLeft size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hover:opacity-50 absolute top-[60%] -translate-x-0    right-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={nextSlide}>
        <BsChevronCompactRight size={30} />
      </div>
      <div className="flex top-4 justify-center py-2">
        {slides.map((slide, slideIndex) => (
          <RxDotFilled key={slideIndex} active={slideIndex === currentIndex} onClick={() => goToSlide(slideIndex)} />
        ))}
      </div>
    </div>
  );
}

function TextComponent() {
  return (
    <div className="dark:bg-black bg-blue-300 h-auto p-4 ">
      <h2 className="text-4xl font-bold tracking-tight text-blue-600 sm:text-4 text-center mt-5">Shielded Metal Arc Welding (SMAW)</h2>
      <p className="mt-10 lg:px-20   text-lg leading-10 text-blue-600 text-justify p-10">
  The STEM strand typically includes a curriculum that emphasizes subjects such as:
  <br />
  <br />
  <ul>
    <li>1. Science: This can include courses in biology, chemistry, physics, environmental science, and other scientific disciplines.</li>
    <li>2. Technology: Courses related to computer science, programming, information technology, and the use of technology in various fields.</li>
    <li>3. Engineering: Subjects related to engineering principles, design, and problem-solving.</li>
    <li>4. Mathematics: Advanced mathematics courses, including algebra, calculus, statistics, and other math-related topics.</li>
  </ul>
  <br />
  The STEM strand aims to prepare students for careers and further education in STEM-related fields. It equips them with critical thinking, problem-solving, and analytical skills that are highly valued in today's technological and scientific industries. Additionally, STEM education often encourages hands-on learning through experiments, projects, and research.
  <br />
  <br />
  The following are some STEM strand courses:
<ul style={{ listStyleType: 'circle' }}>
  <li>Physics.</li>
  <li>Biochemistry.</li>
  <li>Biotechnology.</li>
  <li>Civil engineering.</li>
  <li>Computer science.</li>
  <li>Information science.</li>
  <li>Chemical engineering.</li>
  <li>Aerospace engineering.</li>
</ul>

</p>

    </div>
  );
}

function App() {
  return (
    <div>
      <CarouselComponent />
      <TextComponent />
    </div>
  );
}

export default App;
