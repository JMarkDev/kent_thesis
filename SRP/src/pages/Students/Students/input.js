import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../index.css';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Input = () => {
  // const [conditionStrandName, setConditionStrandName] = useState([])
  const [conditionData, setConditionsData] = useState({})
  const [strandRank, setStrandRank] = useState([]);
  const [courseOption, setCourseOption] = useState([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [recommendedCourse, setRecommendedCourse] = useState('');
  const navigate = useNavigate();
  const [hasInteracted, setHasInteracted] = useState(true);
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

  useEffect(() => {
    const strands = [
      { name: 'STEM', grade: (parseFloat(grades.math) + parseFloat(grades.science)) / 2 },
      { name: 'ABM', grade: (parseFloat(grades.math) + parseFloat(grades.tle)) / 2 },
      { name: 'HUMSS', grade: (parseFloat(grades.science) + parseFloat(grades.arpan)) / 2 },
    ];

    const sortedStrands = strands.sort((a, b) => b.grade - a.grade);
    setStrandRank(sortedStrands);
    
  }, [grades])

  const strandRanking = async () => {
    const strandNames = strandRank.map((strand) => strand.name)
    const strandRankingString = strandNames.join(', ');
    const studentId = localStorage.getItem('userId')

    await axios.post('http://localhost:3001/rank/add', {
      studentId: studentId, 
      strandRanking: strandRankingString  
    })

    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrades({
      ...grades,
      [name]: value,
    });
  };

  function calculateStrandAverage(grades, subjectsForStrand) {
    const subjectGrades = subjectsForStrand.map(subject => parseFloat(grades[subject]) || 0);
    const sum = subjectGrades.reduce((acc, grade) => acc + grade, 0);
    const average = sum / subjectGrades.length;
    return average;
  }
  useEffect(() => {
  const recommendationConditions = async () => {
  try {
    const response = await axios.get('http://localhost:3001/strand/recommendation-conditions/all');
    const data = response.data;
    console.log(data)

    const strandSubjects = {}

    for (const strand in data) {
      const subjects = data[strand];
      const subjectNames = Object.keys(subjects);
      strandSubjects[strand] = subjectNames;
    }

    console.log(strandSubjects)

    const strandAverages = {};

    for (const strand in strandSubjects) {
      const subjectsForStrand = strandSubjects[strand];
      const average = calculateStrandAverage(grades, subjectsForStrand);
      strandAverages[strand] = average;
    }

    const sortAverages = Object.entries(strandAverages).sort((a, b) => b[1] - a[1]);

    console.log(sortAverages);


    
    // const strandAverages = {};

    // for (const strand in data) {
    //   const subjects = data[strand];
    //   const average = Object.values(subjects).reduce((total, grade) => total + parseInt(grade), 0) / Object.keys(subjects).length;
    //   strandAverages[strand] = average;
    // }

    // console.log(strandAverages)
    // const sortAverages = Object.entries(strandAverages).sort((a, b) => b[1] - a[1]);
    // console.log(sortAverages)

    setConditionsData(data);
  } catch (err) {
    console.log(err);
  }
};

  recommendationConditions()
}, [grades, strandRank])

  const handleSubmit = async (e) => {
  e.preventDefault();

  const studentId = localStorage.getItem('userId')

  try {
    const response = await fetch(`http://localhost:3001/students/update-recommended/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommended: recommendedCourse }),
    });

    if (!response.ok) {
      throw new Error('Failed to update recommended course');
    }

    navigate('/recommendation');
  } catch (error) {
    console.error('Error updating recommended course:', error);
  }

  strandRanking()
};

const getConditionsForStrand = (strandName) => {
  const conditionsData = conditionData;

  if (conditionsData && conditionsData[strandName]) {
    return conditionsData[strandName];
  } else {
    return null;
  }
};


const handleCourseSelectChange = (selectedTitle) => {
  setSelectedCourseTitle(selectedTitle);

  const selectedCourse = courseOption.find((course) => course.title === selectedTitle);
  const selectedStrand = selectedCourse.strand;
  const conditionsData = getConditionsForStrand(selectedStrand);

  if (conditionsData) {
    const checkCondition = (subject, requiredGrade) => {
      if (grades[subject] >= requiredGrade) {
        return true;
      }
      return false;
    };

    const meetsConditions = Object.entries(conditionsData).every(([subject, requiredGrade]) => {
      return checkCondition(subject, parseInt(requiredGrade));
    });

    if (meetsConditions) {
      setRecommendedCourse(selectedStrand);
    } else {
      setRecommendedCourse('DefaultRecommendation');
    }
  } else {
    setRecommendedCourse(selectedStrand);
  }
};

    
    useEffect(() => {
      axios.get('http://localhost:3001/course/fetch')
      .then((res) => {
         setCourseOption(res.data)
      })
      .catch((err) => {
         console.log(err)
      })
   }, [])

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
    !selectedCourseTitle ;

    // const canSelectCourse = (strandName) => {
    //   const conditionsData = getConditionsForStrand(strandName);
      
    //   // Define a function to check conditions for a given subject and grade
    //   const checkCondition = (subject, requiredGrade) => {
    //     return grades[subject] >= requiredGrade;
    //   };
    
    //   // Check the conditions for each subject in the conditions data
    //   return Object.entries(conditionsData).every(([subject, requiredGrade]) => {
    //     return checkCondition(subject, parseInt(requiredGrade));
    //   });
    // };

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
        <label className="block text-gray-700 text-sm font-mono mb-2 text-center" htmlFor="ambition">
          Course Option:
        </label>
 
      </div>

      <Listbox value={selectedCourseTitle} onChange={handleCourseSelectChange}>
      {({ open }) => (
        <div className="relative mt-2">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
            <span className="block truncate">{selectedCourseTitle ? selectedCourseTitle : 'Choose Course'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
    
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute z-10 mt-1 w-full -top-48">
              <Listbox.Options className="max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {courseOption.map((course) => (
                  <Listbox.Option
                    key={course.id}
                    // title={!canSelectCourse(course.strand) ? "This course doesn't meet the requirements" : null}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        
                      )
                    }
                    value={course.title}
                    onClick={() => {
                      // Call the parent's handleCourseSelectChange function
                      handleCourseSelectChange(course.title);
                    }}
                    // disabled={!canSelectCourse(course.strand)}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {course.title}
                          </span>
                        </div>
    
                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Transition>
        </div>
      )}
    </Listbox>
    


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
