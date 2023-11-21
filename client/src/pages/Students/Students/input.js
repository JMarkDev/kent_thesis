import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../index.css';
import Loading from '../../../components/loading/loading'
// import { use } from '../../../../../server/src/Routes/Students';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Input = () => {
  const [strandData, setStrandData] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qualification, setQualification] = useState([])
  const [reasonData, setReasonData] = useState({})
  const [strand, setStrand] = useState('');
  const [meetsConditions, setMeetsConditions] = useState(false);
  const [selectedStrandName , setSelectedStrand] = useState('');
  const [data, setData] = useState([])
  const [conditionData, setConditionsData] = useState([])
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
    arpan: '',
    filipino: '',
    esp: '',
  });

  useEffect(() => {
    const getAverage = (grades) => {
      const subjectGrades = Object.values(grades).map((grade) => parseFloat(grade) || 0);
      const sum = subjectGrades.reduce((acc, grade) => acc + grade, 0);
      const average = sum / subjectGrades.length;
      console.log(average)
      setAverage(average);
    }

    getAverage(grades)
  }, [grades])

  const strandRanking = useCallback(async () => {
    try{
      const reasonDataString = JSON.stringify(strandData);
      const studentId = localStorage.getItem('userId')
      
      const response = await axios.post('http://localhost:3001/rank/add', {
        studentId: studentId, 
        strandRanking: reasonDataString  
      })
      console.log(response.data)
    } 
    catch(err) {
      console.log(err)
    }
  }, [strandData]);

  useEffect(() => {
    strandRanking(); 
  }, [strandRank, strandRanking]);

    const topStrand = useCallback(async () => {
    const topStrand = strandData[0]?.strand;
  
    try {
      const studentId = localStorage.getItem('userId');
      const response = await axios.put(`http://localhost:3001/students/update-recommended/${studentId}`, {
        recommended: topStrand,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  
    return topStrand;
  }, [strandData, ]);
  
  useEffect(() => {
    topStrand().then((recommendedStrand) => {
      // Do something with recommendedStrand if needed
      console.log("Recommended Strand:", recommendedStrand);
    });
  }, [strandData, topStrand]);
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrades({
      ...grades,
      [name]: value,
    });
  };

  const recommendationConditions = async () => {
  try {
    const response = await axios.get('http://localhost:3001/strand/recommendation-conditions/all');
    const data = response.data;

    setData(data)
    setConditionsData(data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  recommendationConditions();
}, []);

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

  setStrand(selectedStrand);

  const allStrands = courseOption.map((course) => course.strand);

  const arrRanking = [];
  const addedStrands = [];

  allStrands.forEach((strand, index) => {
    if (addedStrands.includes(strand)) {
      return; 
    }

    const conditionsData = getConditionsForStrand(strand);

    const checkCondition = (subject, requiredGrade) => {
      if (subject !== 'average') {
        const grade = parseInt(grades[subject]);
        return grade >= requiredGrade;
      }
      return true;
    };

    const averageCondition = parseInt(conditionsData.average);
    const averageConditionMet = average >= averageCondition;

    const meetsConditions = Object.entries(conditionsData).every(([subject, requiredGrade]) => {
      if (subject === 'average') {
        return true; // Skip the 'average' subject in the condition check
      }

      const conditionMet = checkCondition(subject, parseInt(requiredGrade));
      return conditionMet && average >= averageCondition;
    });

    const gradesConditionMet = Object.entries(conditionsData).every(([subject, requiredGrade]) => {
      const conditionMet = checkCondition(subject, parseInt(requiredGrade));
      return conditionMet;
    });

    
  if(averageConditionMet || gradesConditionMet) {
    setRecommendedCourse(selectedStrand)
  }

    switch (true) {
      case meetsConditions && strand === selectedStrand:
        arrRanking.unshift({ strand, reason: "Your grades qualify you for this strand, and it matches perfectly to the course you’ve selected.", average: averageCondition });
        addedStrands.push(strand);
        break;  
      case averageConditionMet && strand === selectedStrand:
        arrRanking.unshift({ strand, reason: `(Your average are qualified for this strand , and the course you’ve selected is related to ${strand}`, average: averageCondition });
        addedStrands.push(strand);
        break;
      case gradesConditionMet && strand === selectedStrand:
        arrRanking.unshift({ strand, reason: `(Your grades are qualified for this strand, and the course you’ve selected is related to ${strand}`, average: averageCondition });
        addedStrands.push(strand);
        break;
      case averageConditionMet && gradesConditionMet:
        arrRanking.push({ strand, reason: `Your grades and average are qualified for this strand, but your desired course is not related to ${strand}.`, average: averageCondition });
        addedStrands.push(strand);
        break;
      case !averageConditionMet && gradesConditionMet:
        arrRanking.push({ strand, reason: `Your grades are good enough for this strand, but your desired course is not related to ${strand}.`, average: averageCondition });
        addedStrands.push(strand);
        break;
      case averageConditionMet && !gradesConditionMet:
        arrRanking.push({ strand, reason: `Your grades are good enough for this strand, but your desired course is not related to ${strand}.`, average: averageCondition });
        addedStrands.push(strand);
        break;
      case !meetsConditions && strand === selectedStrand:
        arrRanking.splice(1, 0, { strand, reason: `Your grades did not reach the set conditions for this strand, but your desired course is related to ${strand}`, average: averageCondition });
        addedStrands.push(strand);
        break;      
      default:
        arrRanking.push({ strand, reason: `Your grades do not meet the conditions for this strand.`, averageCondition });
        addedStrands.push(strand);
    }    
  });

  setRanking(arrRanking);
};

const finalRanking = () => {
  const selectedCourse = "Your grades qualify you for this strand, and it matches perfectly to the course you’ve selected.";
  const reason1 = 'Your grades did not reach the set conditions for this strand, but your desired course is related to';
  const reason2 = 'Your grades and average are qualified for this strand, but your desired course is not related to';
  const meetAllCondition = 'Your grades and average are qualified for this strand, but your desired course is not related to';
  const metOneCondition = 'Your grades is good enough for this strand, but your desired course is not related to';
  const notMetAll = 'Your grades do not meet the conditions for this strand.';

  const notMet = ranking.some((strand) => strand.reason.includes(reason1));


  const metConditionsStrands = ranking.filter((strand) => {
  return (
    strand.reason.includes(selectedCourse) ||
    strand.reason.includes(meetAllCondition) ||
    strand.reason.includes(metOneCondition)
  );
});

  const notChoseStrands = ranking
    .filter((strand) => strand.reason.includes(reason2))
    .sort((a, b) => (b.average || 0) - (a.average || 0)); 

  const sortedStrandsArray = notChoseStrands.map((strand) => {
    return { strand: strand.strand, average: strand.average };
  });

  // Log the sorted strands array
  console.log(sortedStrandsArray);

  const meetAllStrands = ranking.filter((strand) => strand.reason.includes(meetAllCondition));

  // Sort meetAllStrands based on average in descending order
  meetAllStrands.sort((a, b) => b.average - a.average);

  const getHighAverage = (meetAllStrands) => {
    const highAverage = meetAllStrands[0]?.strand;
    return highAverage;
  };

  getHighAverage(meetAllStrands);

  if (notMet) {

  const highAverageStrand = getHighAverage(meetAllStrands);
  const indexToSwap = ranking.findIndex((strand) => strand.strand === highAverageStrand);

  if (indexToSwap !== -1 && indexToSwap !== 0) {
    const meetOneCondition = 'Your grades is good enough for this strand, but your desired course is not related to';
    const meetAllCondition = 'Your grades and average are qualified for this strand, but your desired course is not related to';
  
    const meetOneStrands = ranking.filter((strand) => strand.reason.includes(meetOneCondition));
    const meetAllStrands = ranking.filter((strand) => strand.reason.includes(meetAllCondition));
    const notMetSelectedCourseStrands = ranking.filter((strand) => strand.reason.includes(reason1));
  
    // Custom sort function
    const customSort = (a, b) => {
      if (meetAllStrands.includes(a) && !meetAllStrands.includes(b)) {
        return -1; 
      } else if (!meetAllStrands.includes(a) && meetAllStrands.includes(b)) {
        return 1; 
      } else if (meetOneStrands.includes(a) && !meetOneStrands.includes(b)) {
        return -1; 
      } else if (!meetOneStrands.includes(a) && meetOneStrands.includes(b)) {
        return 1; 
      } else if (notMetSelectedCourseStrands.includes(a) && !notMetSelectedCourseStrands.includes(b)) {
        return -1;
      } else if (!notMetSelectedCourseStrands.includes(a) && notMetSelectedCourseStrands.includes(b)) {
        return 1; 
      } else {
        return 0; 
      }
    };
  
    let updatedStrandData = [...ranking].sort(customSort);
    setStrandData(updatedStrandData);
    console.log('meetOne', updatedStrandData);

    const notMetSelectedCourse = ranking.some((strand) => strand.reason.includes(notMetAll));
     updatedStrandData = [...ranking];

    if (notMetSelectedCourse) {
      const notMetAllStrands = ranking.filter((strand) => strand.reason.includes(notMetAll));
      const remainingStrands = ranking.filter((strand) => !notMetAllStrands.includes(strand));
    
      const humssStrand = remainingStrands.find((strand) => strand.strand === 'HUMSS');
      const remainingStrandsWithoutHumss = remainingStrands.filter((strand) => strand !== humssStrand);
      const updatedStrandData = [humssStrand, ...remainingStrandsWithoutHumss, ...notMetAllStrands];
    
      setStrandData(updatedStrandData);
      console.log('Updated Strand Data:', updatedStrandData);
    } 
  }

  } else {
    const notMetSelectedCourseStrands = ranking.filter((strand) => strand.reason.includes(reason1));

// Custom sort function
  const customSort = (a, b) => {
    if (metConditionsStrands.includes(a) && !metConditionsStrands.includes(b)) {
      return -1; // a comes first
    } else if (!metConditionsStrands.includes(a) && metConditionsStrands.includes(b)) {
      return 1; // b comes first
    } else if (notMetSelectedCourseStrands.includes(a) && !notMetSelectedCourseStrands.includes(b)) {
      return -1; // a comes first
    } else if (!notMetSelectedCourseStrands.includes(a) && notMetSelectedCourseStrands.includes(b)) {
      return 1; // b comes first
    } else {
      return 0; // no change in order
    }
};

const updatedStrandData = ranking.sort(customSort);
setStrandData(updatedStrandData);

  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const studentId = localStorage.getItem('userId');

  const formDataObject = {
    studentId: studentId,
    math: grades.math,
    science: grades.science,
    english: grades.english,
    mapeh: grades.mapeh,
    arpan: grades.arpan,
    filipino: grades.filipino,
    esp: grades.esp,
    average: average,
    course: selectedCourseTitle,
  };

  try {
    await axios.post('http://localhost:3001/grades/add', formDataObject);

    await finalRanking()

    setTimeout(function () {
      navigate('/recommendation');
    }, 2000);
  } catch (error) {
    setLoading(false);
    console.error('Error updating recommended course:', error);
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
    !grades.arpan ||
    !grades.filipino ||
    !grades.esp ||
    !selectedCourseTitle ;


  return (
    <>
    {loading && 
      <div>
       <Loading />
      </div>
      }
    <div className="flex flex-col justify-center bg-gradient-to-r from-cyan-600 to-transparent bg-gray-300 dark:bg-black items-center h-full">
      {hasInteracted && ( // Conditionally render the Aware component as a modal
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-70 absolute inset-0"></div>
          <div className=" bg-gradient-to-b from-cyan-600 to-rose-200 p-4  md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-2xl mt-10  relative">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reminder:</h2>
          <p className="text-lg mb-4 text-center font-mono">
          Your input plays a crucial role in the accuracy of the system's recommendations. If false data is provided, the system's recommendation may become unreliable and ineffective.
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
      <section className="
border bg-gradient-to-b from-cyan-800 to-red-400  cursor-pointer dark:bg-black p-4 md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-2xl mt-10 mb-10 ">
        <h2 className="text-2xl font-semibold mb-4 text-center dark:text-orange-300 text-black">Enter Your Grades and Ambition</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 p-5  text-center">
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm font-base mb-2 text-center" htmlFor="math">
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
              className="border  font-thin rounded-lg py-2 px-3 w-full text-center  bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm  font-base mb-2 text-center" htmlFor="science">
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
              className="border  font-thin rounded-lg py-2 px-3 w-full text-center  bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm  font-base mb-2 text-center" htmlFor="english">
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
              className="border  font-thin rounded-lg py-2 px-3 w-full text-center  bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm  font-base mb-2 text-center" htmlFor="mapeh">
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
              className="border  font-thin rounded-lg py-2 px-3 w-full text-center  bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm  font-base mb-2 text-center" htmlFor="arpan">
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
              className="border  font-thin rounded-lg py-2 px-3 w-full text-center  bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm  font-base mb-2 text-center" htmlFor="filipino">
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
              className="border  font-thin rounded-lg py-2 px-3 w-full text-center  bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              max="100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block dark:text-orange-300 text-black text-sm  font-base mb-2 text-center" htmlFor="esp">
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
              className=" font-thin border rounded-lg py-2 px-3 w-full text-center bg-white dark:bg-black dark:text-orange-300 text-black dark:text-white"
              max="100"
              required
            />
          </div>
        </div>
        
          
        <div className="col-span-3 text-center">
        <label className="block dark:text-orange-300 text-black text-sm font-base mb-2 text-center" htmlFor="ambition">
          Course Option:
        </label>
 
      </div>

      <Listbox value={selectedCourseTitle} onChange={handleCourseSelectChange}>
      {({ open }) => (
        <div className="relative mt-2 px-4">
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
    </>
  );
};

export default Input;