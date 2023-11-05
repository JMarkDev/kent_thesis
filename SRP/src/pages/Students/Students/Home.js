import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../components/Footer';
import { AccordionCustomIcon } from '../../../components/Accordion'

const Home = () => {
  const [strand, setStrand] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [textColor, setTextColor] = useState('text-green-500');
  const [data, setData] = useState([]);

  useEffect(() => {
    const courseData = async () => {
      try{
        const response = await axios.get('http://localhost:3001/course/fetch');
        setData(response.data.slice(0, 3));
      } catch (err) {
        console.log(err)
      }
      
    }
    courseData();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTextColor((prevColor) => (prevColor === 'text-white' ? 'text-[#facc15]' : 'text-white'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3001/students/${userId}`)
        .then((res) => {
          const recommendedStrand = res.data[0].recommended;
          setStrand(recommendedStrand);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);
  return (
    <div className="bg-gray-100 h-screen flex flex-col ">
     
      <main
        className="flex-grow flex   items-center justify-center bg-cover bg-center  "
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1584697964400-2af6a2f6204c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
        }}
      >
        
        <section


          className={'text-center mb-36'}
        >
            <p className=" mt-5 text-4xl font-mono text-[#fcd34d] text-decoration-line: underline">
        Welcome to the Senior High School Strand Recommender
          </p>
        

          
          <p className= {` mt-40 text-4xl font-black ${textColor} transition-opacity duration-300 ease-in-out`}>
            Discover Your Path Now!
          </p>
          <Link
          to={isLoading ? '/loading' : strand ? '/recommendation' : '/input'}
          className="mt-6 mb-20 px-8 py-3 bg-blue-300 text-black hover:text-black rounded-full inline-block hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {!strand ? <span>Let's See</span> : <span>View Result</span>}
        </Link>
        </section>
      </main>

      <div className='  dark:bg-[#27374D] '>
        <div className='py-5 bg-[#f7fafc] dark:border-b-[1px] dark:border-b-white dark:bg-[#27374D]'>
          <h1 className="py-2 text-center text-4xl font-bold text-gray-700  dark:text-gray-100">
            Our <span className='text-[#6415ff] dark:text-white'>Courses</span> 
          </h1>
          <p className="text-center text-base pb-2 font-bold text-gray-700 dark:text-gray-100">
            There are many following courses that you can choose
          </p>
        </div>
        <div className='dark:bg-[#27374D] my-20 lg:mx-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 px-4'>
        {
          data.map((course) => (
            <div key={course.id} className='bg-[#f0f3f5] dark:bg-[#273242] rounded-lg shadow-md dark:shadow-lg'>
              <div className='m-5 card-body text-gray-700 dark:text-gray-100'>
                <img src={`http://localhost:3001/${course.image}`} alt={course.title} className='w-full h-[230px]' />
                <h2 className='text-xl font-semibold py-3 dark:text-white'>{course.title}</h2>
                <p className='text-base leading-6 mb-4 dark:text-white'>{course.description}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className='flex items-center justify-center mb-20'>
        <Link to='/course' className='px-8 py-3 bg-blue-300 text-black hover:text-black inline-block hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-blue-400'>
        Browse All Courses 
        </Link>
      </div>
        <div className='bg-[#f0f3f5]  dark:bg-[#27374D] dark:text-white '>
          <div className='p-10 lg:mx-20 mb-20'>
          <div className='p-5 text-center'>
          <span className='font-bold text-[#6415ff] dark:text-white'>FAQS</span> 
            <h1 className="py-2 text-center text-4xl font-bold text-[#273242]  dark:text-gray-100">
            You have <span className='text-[#6415ff] dark:text-white'>Questions ?</span> 
            </h1>
            <p className="text-center text-base font-bold text-gray-700 dark:text-gray-100">
            And we have got answers to all then.
            </p>
          </div>
          
            <AccordionCustomIcon />
          </div>
        </div>
      
      </div>

        <Footer/>
    </div>
  );
};

export default Home;
