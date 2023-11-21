import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import Footer from '../../../components/Footer';
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
    <>
    <div className="relative  bg-gradient-to-r  from-transparent via-cyan-600 to-transparent dark:bg-[#27374D] dark:text-white p-10  sm:py-16 md:py-20 lg:px-20 lg:py-24 xl:py-32 h-full flex flex-col">
      <div className="container mx-auto sm:px-6 lg:px-8 relative">
        <div className="text-center md:text-left ">
          <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black  text-#27374D mb-4">
            Explore <span className='text-[#6415ff] dark:text-white'>Strands</span> 
          </h2>
          <p className="text-lg lg:text-2xl font-semi text-justify py-5 px-5 rounded-2xl text-black dark:text-white dark:bg-slate-700 bg-sky-100">
            In the journey of education, discovering the right senior high school strand is like embarking on an exciting adventure a path that holds the key to unlocking your full potential. At our Senior High School Strands Recommender, we empower students to explore the myriad of opportunities available. Whether you're passionate about the sciences, arts, business, or beyond, our platform provides a personalized compass, guiding you toward the strand that aligns perfectly with your interests and aspirations. It's not just about choosing a path; it's about embracing a future where your unique talents and passions flourish. Start your exploration today and open the doors to a world of possibilities.
          </p>
        </div>

        <div className='flex flex-wrap justify-center items-center mt-10'>
        {
          strand.map((strand) => (
            // <div className='m-5 dark:bg-[#273242]'>
              <div key={strand.id}  className='my-5 dark:bg-[#273242] shadow-lg bg-gradient-to-b from-gray-400 to-transparent rounded p-5 flex flex-col lg:flex-row items-center'>
                <img className='w-full lg:w-[50%] h-96 rounded-lg' src={`http://localhost:3001/uploads/${strand.image.split(',')[0]}`} alt='strand img' />
                <div className='w-full lg:w-[50%]'>
                  <h1 className='text-2xl lg:ml-5 my-3 leading-normal'>{strand.name}</h1>
                  <p className='lg:ml-5 leading-normal text-justify pb-10'>{truncateText(strand.description, 500)}</p>
                  <Link to={`/strand/${strand.id}`} className='lg:ml-5 bg-slate-600 p-3 text-white rounded-lg transition duration-300 hover:bg-slate-800 hover:text-gray-100'>View more</Link>
                </div>
              </div>
            // </div>
          ))
        }
      </div>
      </div>
      </div>


    <Footer/>
  </>
  );
}
