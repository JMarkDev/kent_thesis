import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SingleStrand() {
  const [courses, setCourses] = useState([]);
  const [strand, setStrand] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios
      .get('http://localhost:3001/course/fetch')
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3001/strand/fetch/${id}`)
      .then((res) => {
        res.data.description = res.data.description.replace(/\n/g, '<br>');
        setStrand(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function filterCoursesByStrand(courses, strandName) {
    return courses.filter((course) => course.strand === strandName);
  }

  const filteredCourses = filterCoursesByStrand(courses, strand.name);

  return (
    <div className="p-5 lg:p-10 xl:p-20 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white p-5 lg:p-10 rounded-lg shadow-md">
          <img
            src={`http://localhost:3001/${strand.image}`}
            alt="Strand Img"
            className="mx-auto mb-8 lg:w-[50%] lg:h-[350px] rounded-lg"
          />
          <div
            className="text-2xl font-semi text-left"
            dangerouslySetInnerHTML={{ __html: strand.description }}
          ></div>

          <h1 className="text-2xl font-bold mt-5">
            {strand.name} Strand Courses:
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-5 lg:p-10 rounded-lg shadow-md"
              >
                <img
                  src={`http://localhost:3001/${course.image}`}
                  alt="Course Img"
                  className="mx-auto w-[100%] rounded-lg"
                />
                <h2 className="text-lg font-bold mt-3">{course.title}</h2>
                <p className="text-sm leading-snug mt-2">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleStrand;
