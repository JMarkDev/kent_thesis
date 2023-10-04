import React from 'react';
import { Link } from 'react-router-dom';

export default function Strands() {
  return (
    <div className="relative  p-10  sm:py-16 md:py-20 lg:px-20 lg:py-24 xl:py-32 h-full flex flex-col">
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
        alt=""
        className="absolute inset-0 z-0 min-h-full w-full object-cover object-right md:object-center "
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black  text-white">
            Explore Strands
          </h2>
          <p className="mt-20 text-base sm:text-lg md:text-xl font-mono text-gray-300 md:text-left text-center">
            In the journey of education, discovering the right senior high school strand is like embarking on an exciting adventure—a path that holds the key to unlocking your full potential. At our Senior High School Strands Recommender, we empower students to explore the myriad of opportunities available. Whether you're passionate about the sciences, arts, business, or beyond, our platform provides a personalized compass, guiding you toward the strand that aligns perfectly with your interests and aspirations. It's not just about choosing a path; it's about embracing a future where your unique talents and passions flourish. Start your exploration today and open the doors to a world of possibilities.
          </p>
        </div>
        <div className=" max-w-md sm:max-w-2xl md:max-w-4xl mx-auto mt-20 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Link to="/stem" className="text-center">
              <button className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                STEM
              </button>
            </Link>
            <Link to="/abm" className="text-center">
              <button className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                ABM
              </button>
            </Link>
            <Link to="/humss" className="text-center">
              <button className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                HUMSS
              </button>
            </Link>
            <Link to="/smaw" className="text-center">
              <button className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                SMAW
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
