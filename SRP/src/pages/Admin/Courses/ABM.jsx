import React, { useEffect, useState } from 'react';
import CourseTable from '../../../components/CourseTable';
import axios from 'axios';

function ABM() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/course/fetch')
      .then(res => {
        // Filter the courses with strand "STEM"
        const stemCourses = res.data.filter(course => course.strand === 'ABM');
        setCourses(stemCourses);
        // console.log(stemCourses)
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      {/* Pass the filtered courses to CourseTable */}
      <CourseTable courses={courses} />
    </div>
  );
}

export default ABM;
