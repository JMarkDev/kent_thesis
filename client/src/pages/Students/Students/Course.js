import React, { useEffect, useState } from "react";
import axios from 'axios'; 
import Footer from "../../../components/Footer";
import Dropdown from "../../../components/Dropdown"
export default function CoursePage() {
  const [courses, setCourses] = useState([])
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/course/fetch')
      .then((res) => {
        setCourses(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleFilter = (strand) => {
    if (strand === 'Default') {
      // Load all courses
      axios
        .get('http://localhost:3001/course/fetch')
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // Load courses based on the selected strand
      axios
        .get(`http://localhost:3001/course/fetch/${strand}`)
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
    <div className="bg-gradient-to-r  from-transparent via-cyan-600 to-transparent dark:bg-[#27374D]">
    <div className=' flex justify-between items-center lg:px-20'>
    <h2 className='text-4xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl p-10 font-bold'>All <span className='text-[#6415ff] dark:text-white'>Courses</span> </h2>
    <div className="p-10">
      <Dropdown handleFilter={handleFilter} />
    </div>
    </div>
      <div className=' mb-20 lg:mx-20 '>
        <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 px-4'>
          {
            courses.map((course) => (
              <div key={course.id} className='bg-gradient-to-b from-green-300 to-transparent dark:bg-black rounded-lg shadow-md dark:shadow-lg'>
                <div className='m-5 card-body text-gray-700 dark:text-gray-100'>
                  <img src={`http://localhost:3001/${course.image}`} alt={course.title} className='w-full h-[230px]' />
                  <h2 className='text-xl font-semibold py-3 dark:text-white'>{course.title}</h2>
                  <p className='text-base text-justify leading-6 mb-4 dark:text-white'>{course.description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
