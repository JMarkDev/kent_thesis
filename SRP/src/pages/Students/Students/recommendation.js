import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Recommendation = () => {
  const [strand, setStrand] = useState('');
  const [userId, setUserId] = useState('');
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [strandId, setStrandId] = useState('');
  const [strandName, setStrandName] = useState([]);

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
  
          // Fetch strands after setting the strand state
          axios.get('http://localhost:3001/strand/fetch')
            .then((res) => {
              const matchStrand = res.data.find((strandItem) => strandItem.name === recommendedStrand);
              if (matchStrand) {
                setStrandId(matchStrand.id);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userId]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    axios.get(`http://localhost:3001/rank/${userId}`)
    .then((res) => {
      const ranking = res.data[0].strandRanking;
      const strandNames = ranking.split(', ')
      setStrandName(strandNames)
    })
    .catch((err) => {
      console.log(err);
    })
  }, [])
  



  const openWhyModal = () => {
    setIsWhyModalOpen(true);
  };

  const closeWhyModal = () => {
    setIsWhyModalOpen(false);
  };

  return (
    
    <div
      className="flex h-screen bg-no-repeat bg-cover bg-center text-black dark:text-white"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')`,
      }}
    >
      <div className="flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-40">
        <section className="bg-gray-300 dark:bg-gray-500 p-10 ml-10 mr-10 rounded-lg shadow-md flex flex-col items-center">
          <p className=" text-xl  text-center font-bold">Congratulations! Based on your inputs, your recommended strand {strand}</p>

          <p className="mb-5 text-center underline cursor-pointer ">
            <span onClick={openWhyModal}>Why?</span>
          </p>
      
          <Link to={`/strand/${strandId}`} className="bg-blue-400 text-white py-2 px-4 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
          About Strand
        </Link>
        
          
        </section>
      </div>

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isWhyModalOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="bg-gray-800 bg-opacity-70 absolute inset-0"></div>
        <div className="bg-blue-300 dark:bg-blue-400 p-4 md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-2xl mt-10 relative">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-200 mb-6">Strand Ranking Based on Your Input Grades:</h2>
        <ul className="list-none text-xl mb-4 text-gray-700 dark:text-gray-300">
          {
            strandName.map((strand, index) => (
              <li key={index} className="mb-4 flex items-center">
                <span className="text-2xl text-blue-600 dark:text-blue-300 mr-2">{index + 1}.</span>
                <span className="text-xl">{strand}</span>
              </li>
            ))
          }
        </ul>
                  
          <button
            onClick={closeWhyModal} // Close the modal
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
