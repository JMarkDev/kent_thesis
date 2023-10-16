import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

export default function Strands() {
  const [strand, setStrand] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/strand/fetch')
    .then((res) => {
      setStrand(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

    const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

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

        <div className='flex flex-wrap justify-center items-center mt-10'>
            {
              strand.map((strand) => (
                <div key={strand.id} className=''>
                <div className='m-5 lg:flex bg-white justify-center items-center rounded lg:p-10 p-5'>
                  <img className='lg:w-[50%] lg:h-[350px] rounded-lg' src={`http://localhost:3001/${strand.image}`} alt='strand img' />  
                  <div className='lg:w-[50%]'>
                    <h1 className='text-2xl lg:ml-5 leading-normal'>{strand.name}</h1>
                    <p className='lg:ml-5 leading-normal pb-10'>{truncateText(strand.description, 350)}</p>
                    <Link to={`/strand/${strand.id}`} className='lg:ml-5 bg-slate-600 p-3 text-white rounded-lg transition duration-300 hover:bg-slate-800 hover:text-gray-100'>View more</Link>
                  </div>
                </div>
              </div>              
              ))
            }
          </div>
      </div>
    </div>
  );
}
