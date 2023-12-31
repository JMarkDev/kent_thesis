import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

function AddStrand() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    description: '',
    selectedSubjects: [], 
    recommendationConditions: {}, 
  });

  const subjects = [
    'math',
    'science',
    'english',
    'mapeh',
    'arpan',
    'filipino',
    'esp',
    'average'
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const updatedFormData = { ...formData };

    if (name === 'image') {
      const selectedFiles = []

      for(let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i])
      }

      updatedFormData[name] = selectedFiles;
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const handleSubjectChange = (selectedSubjects) => {
    const updatedFormData = { ...formData };
    updatedFormData.selectedSubjects = selectedSubjects;
    setFormData(updatedFormData);
  };

  const handleRecommendationChange = (subject, value) => {
    if (!/^(100|[1-9][0-9]?)$/.test(value)) {
      value = value.slice(0, 2);
    } else if (value === "1000") {
      value = "100";
    }
  
    const updatedFormData = { ...formData };
    updatedFormData.recommendationConditions[subject] = value;
    setFormData(updatedFormData);
  };
  

  const submitData = async (e) => {
    e.preventDefault();
    const { image, name, description, recommendationConditions } = formData;
    const data = new FormData();

    for(let i = 0; i < image.length; i++) {
      data.append('image', image[i]);
    }

    data.append('name', name);
    data.append('description', description);
    data.append('recommendationConditions', JSON.stringify(recommendationConditions));

    try {
      const response = await axios.post('http://localhost:3001/strand/add', data);
      alert(response.data.data);
      navigate('/strand')
    } catch (error) {
      alert(error.response.data.Error)
    }
  };

  return (
    <>
      <Link
        to="/strand"
        className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"
      >
        <TbArrowBackUp />
        Back
      </Link>
      <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mt-4">Add Strand</h2>
        <form onSubmit={submitData} method="POST" encType="multipart/form-data" className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold">
              Title:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-bold">
              Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
              multiple
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Select Subjects:</label>
            {subjects.map((subject) => (
              <div key={subject}>
                <label>
                  <input
                    type="checkbox"
                    value={subject}
                    checked={formData.selectedSubjects.includes(subject)}
                    onChange={(e) => {
                      const selectedSubjects = [...formData.selectedSubjects];
                      if (e.target.checked) {
                        selectedSubjects.push(e.target.value);
                      } else {
                        const index = selectedSubjects.indexOf(e.target.value);
                        if (index !== -1) {
                          selectedSubjects.splice(index, 1);
                        }
                      }
                      handleSubjectChange(selectedSubjects);
                    }}
                  />{' '}
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {/* Render input fields for subject-specific recommendations based on selected subjects */}
          {formData.selectedSubjects.map((subject) => (
            <div key={subject} className="mb-4">
              <label htmlFor={subject} className="block text-gray-700 font-bold">
                {subject.charAt(0).toUpperCase() + subject.slice(1)} Grade:
              </label>
              <input
                type="number"
                id={subject}
                name={subject}
                value={formData.recommendationConditions[subject] || ''}
                onChange={(e) => handleRecommendationChange(subject, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />    
            </div>
          ))}

          <button
            type="submit"
            className="bg-indigo-600 w-full text-white py-2 px-4 rounded-lg hover-bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}

export default AddStrand;
