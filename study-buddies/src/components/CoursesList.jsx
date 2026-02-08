import React, { useState, useEffect } from "react";
import api from "../api/api"; // the axios instance

function CoursesList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data.courses))
      .catch(err => console.error(err));
  }, []);

  return (
  <div>
    <h1>Courses</h1>
    {courses.map(course => (
      <div key={course.id}>
        <h2>{course.title}</h2>
        <p>Code: {course.courseCode}</p>
      </div>
    ))}
  </div>
);
}


export default CoursesList;
