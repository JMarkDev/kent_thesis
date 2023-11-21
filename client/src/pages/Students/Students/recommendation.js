import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Recommendation = () => {
  const [recommendedStrand, setRecommendedStrand] = useState(''); 
  const [userId, setUserId] = useState('');
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [strandId, setStrandId] = useState('');
  const [strandData, setStrandData] = useState([]);

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
          setRecommendedStrand(recommendedStrand);

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
  
      if (ranking) {
        const strandData = JSON.parse(ranking).map(({ strand, reason }) => ({ strand, reason }));
        setStrandData(strandData);
        console.log(strandData);
      } else {
        console.log('No ranking data found in the response');
      }
    })
    .catch((err) => {
      console.error(err);
    });
  
  }, []);





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
      <section className="bg-gradient-to-b from-cyan-500 to-blue-200 dark:bg-black p-10 ml-10 mr-10 rounded-lg shadow-md flex flex-col items-center">

  
          <h1 className="text-3xl font-extrabold text-center text-blue-800 dark:text-black mb-6">
          Congratulations! Based on your inputs, your recommended strand is <span className="text-blue-600">{recommendedStrand}</span>
        </h1>
          
        <p className="mb-5 text-center underline text-black hover:opacity-70 font-bold text-lg cursor-pointer ">
        <span onClick={openWhyModal}>View Strand Ranking Result</span>
      </p>
  
      <Link to={`/strand/${strandId}`} className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
      About <span className=''>{recommendedStrand}</span>
    </Link>
        
          
        </section>
      </div>

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isWhyModalOpen ? 'block' : 'hidden'
        }`}
      >
      <div className="bg-gradient-to-b from-cyan-500 to-rose-200 dark:bg-black p-4 md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-4xl mt-10 relative text-black dark:text-black ">
        <h2 className="text-3xl font-extrabold text-center text-black  mb-6">Strand Ranking Based on Your Inputs:</h2>
        <h1 className='font-bold text-xl text-center mb-3'>Reasons:</h1>
        <ul className="list-none text-xl mb-4 text-gray-700 dark:text-gray-300">
      
        {strandData.map((data, index) => (
          <li key={index} className="mb-4 flex items-center">
              <p className='font-bold mr-1 text-black  '>Top</p>
            <span className="text-xl text-black  mr-3">{index + 1}-</span>
            <span className="text-xl text-black " >{`${data.strand}: "${data.reason}"`}</span>
          </li>
        ))}
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
