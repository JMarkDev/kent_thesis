import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Input = () => {
  const [grades, setGrades] = useState({
    math: '',
    science: '',
    english: '',
    mapeh: '',
    tle: '',
    arpan: '',
    filipino: '',
    ict: '',
    esp: '',
  });

  const [selectedJob, setSelectedJob] = useState('');
  const [recommendedStrand, setRecommendedStrand] = useState(''); // Initialize recommendedStrand in state
  const navigate = useNavigate();
  const [hasInteracted, setHasInteracted] = useState(true);

  const calculateRecommendedStrand = (grades, selectedJob) => {
    let recommendedStrand = '';
  
    // Calculate the total grade average
    const totalGrade =
      (parseFloat(grades.math) + parseFloat(grades.science) + parseFloat(grades.english)+ parseFloat(grades.arpan)+ parseFloat(grades.mapeh)+ parseFloat(grades.tle)+ parseFloat(grades.filipino)+ parseFloat(grades.ict)+ parseFloat(grades.esp)) / 9;
  
      if (grades.math >= 85 && grades.science >= 85 && totalGrade >= 85) {
        recommendedStrand = 'STEM';
      } else if (totalGrade <= 79) {
        recommendedStrand = 'SMAW';
      } else {
      switch (selectedJob) {
        case 'Software Developer/Engineer':
        case 'Biomedical Engineer':
        case 'Data Scientist/Analyst':
        case 'Civil Engineer':
        case 'Mechanical Engineer':
        case 'Electrical Engineer':
        case 'Pharmacist':
        case 'Medical Doctor':
        case 'Computer Systems Analyst':
        case 'Statistician':
          recommendedStrand = 'STEM';
          break;
        case 'Psychologist':
        case 'Social Worker':
        case 'Lawyer':
        case 'Teacher/Educator':
        case 'Public Relations Specialist':
        case 'Writer/Content Creator':
        case 'Historian':
        case 'Human Resources Manager':
        case 'Market Research Analyst':
        case 'Event Planner':
          recommendedStrand = 'HUMSS';
          break;
        case 'Accountant':
        case 'Financial Analyst':
        case 'Marketing Manager':
        case 'Business Development Manager':
        case 'Entrepreneur':
        case 'Investment Banker':
        case 'Management Consultant':
        case 'Sales Manager':
        case 'Financial Manager':
          recommendedStrand = 'ABM';
          break;
        default:
          recommendedStrand = 'SMAW';
      }
    }

  // Save the recommendedStrand value to localStorage
  localStorage.setItem('recommendedStrand', recommendedStrand);

  console.log(recommendedStrand);

  return recommendedStrand; // Add this line to return the value
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrades({
      ...grades,
      [name]: value,
    });
  };

  const handleJobChange = (e) => {
    setSelectedJob(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate recommended strand here
    const calculatedStrand = calculateRecommendedStrand(grades, selectedJob);
  
    // Generate a unique key based on the current timestamp
    const uniqueKey = `recommendedStrand_${Date.now()}`;
  
    // Save the recommendedStrand value to localStorage with the unique key
    localStorage.setItem(uniqueKey, calculatedStrand);
  
    // Set the recommendedStrand in state
    setRecommendedStrand(calculatedStrand);
    navigate('/recommendation')
  };
  

  const jobOptions = [
    //STEM//
    'Software Developer/Engineer',
    'Biomedical Engineer',
    'Data Scientist/Analyst',
    'Civil Engineer',
    'Mechanical Engineer',
    'Electrical Engineer',
    'Pharmacist',
    'Medical Doctor',
    'Computer Systems Analyst',
    'Statistician',
    //HUMSS//
    'Psychologist',
    'Social Worker',
    'Lawyer',
    'Teacher/Educator',
    'Public Relations Specialist',
    'Writer/Content Creator',
    'Historian',
    'Human Resources Manager',
    'Market Research Analyst',
    'Event Planner',
    //ABM//
    'Accountant',
    'Financial Analyst',
    'Marketing Manager',
    'Business Development Manager',
    'Entrepreneur',
    'Investment Banker',
    'Management Consultant',
    'Sales Manager',
    'Bank Manager',
    'Financial Manager',
    //SMAW//
    'Welder',
    'Welding Inspector',
    'Welding Supervisor',
    'Pipefitter',
    'Boilermaker',
    'Fabricator',
    'Metalworker',
    'Structural Steel Worker',
    'Welding Engineer',
    'Maintenance Technician',

  ];

  const isSubmitDisabled =
    !grades.math ||
    !grades.science ||
    !grades.english ||
    !grades.mapeh ||
    !grades.tle ||
    !grades.arpan ||
    !grades.filipino ||
    !grades.ict ||
    !grades.esp ||
    !selectedJob;

  return (
    <div className="flex flex-col justify-center bg-[#99f6e4] dark:bg-[#14b8a6] items-center h-full">
      {hasInteracted && ( // Conditionally render the Aware component as a modal
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-70 absolute inset-0"></div>
          <div className="bg-blue-300 dark:bg-blue-300 p-4  md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-2xl mt-10  relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">Reminder:</h2>
            <p className="text-lg mb-4 text-center font-mono">
              "Your journey towards a successful future begins with an honest step. By providing your true grades and ambition,
              you are not only helping yourself but also forging the way for a brighter tomorrow."
            </p>
            <p className="text-lg mb-4 text-center">
              Don't worry; this will not be posted or seen by your classmates, so please do not hesitate or be shy
              about putting the true data needed in the blanks.
            </p>
            <button
              onClick={() => setHasInteracted(false)} // Close the modal
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
      )}  
      <section className="bg-blue-300 dark:bg-blue-400 p-4 md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-2xl mt-10 mb-10 ">
        <h2 className="text-2xl font-semibold mb-4 text-center">Enter Your Grades and Ambition</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-5  text-center">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-mono mb-2 text-center" htmlFor="math">
              Math
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="math"
              name="math"
              value={grades.math}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="science">
              Science
            </label>
            <input
             placeholder='Enter'
              type="number"
              id="science"
              name="science"
              value={grades.science}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="english">
              English 
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="english"
              name="english"
              value={grades.english}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="mapeh">
              MAPEH 
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="mapeh"
              name="mapeh"
              value={grades.mapeh}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="tle">
              TLE 
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="tle"
              name="tle"
              value={grades.tle}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="arpan">
              ArPan 
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="arpan"
              name="arpan"
              value={grades.arpan}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="filipino">
              Filipino 
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="filipino"
              name="filipino"
              value={grades.filipino}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="ict">
              ICT 
            </label>
            <input
              placeholder='Enter'
              type="number"
              id="ict"
              name="ict"
              value={grades.ict}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className="border  font-thin rounded-lg py-2 px-3 w-28 text-center  bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="esp">
              ESP 
            </label>
            <input
              
              placeholder='Enter'
              type="number"
              id="esp"
              name="esp"
              value={grades.esp}
              onChange={handleChange}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^(100|[1-9][0-9]?)$/.test(value)) {
                  e.target.value = value.slice(0, 2); // Only keep the first two characters
                } else if (value === "1000") {
                  e.target.value = "100"; // Correct "1000" to "100"
                }
              }}
              className=" font-thin border rounded-lg py-2 px-3 w-28 text-center bg-white dark:bg-black text-black dark:text-white"
              max="100"
              required
            />
          </div>
        </div>
        
          
          <div className="col-span-3 text-center">
            <label className="block text-gray-700 text-sm  font-mono mb-2 text-center" htmlFor="ambition">
              Ambition:
            </label>
            <select
              id="ambition"
              name="ambition"
              value={selectedJob}
              onChange={handleJobChange}
              className="border rounded-lg py-2 px-3 w-auto text-center appearance-none bg-white dark:bg-black text-black dark:text-white font-thin mx-20"
              required
            >
              <option value="" disabled>
                Choose Your Ambition
              </option>
              {jobOptions.map((job, index) => (
                <option key={index} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-center">
          <button
          type="submit"
          className={`bg-blue-500 dark:bg-white text-white  dark:text-black py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Input;