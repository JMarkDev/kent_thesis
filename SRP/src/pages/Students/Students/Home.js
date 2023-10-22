import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [strand, setStrand] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [textColor, setTextColor] = useState('text-green-500');


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

      <footer className="bg-[#38bdf8] dark:bg-black p-2 text-center">
        <div className="container mx-auto">
          <p className="text-gray-700 dark:text-gray-100 opacity-70">
            &copy; {new Date().getFullYear()} Your Senior High School Strand Recommender
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
