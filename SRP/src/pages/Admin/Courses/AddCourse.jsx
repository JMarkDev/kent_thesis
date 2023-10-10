import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';

function AddCourse() {
  const [strands, setStrands] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    strand: 'STEM',
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const updatedFormData = { ...formData };

    if (name === 'image') {
      updatedFormData[name] = files[0];
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const submitData = async (e) => {
    e.preventDefault();
    const { title, description, image, strand } = formData;
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('image', image);
    data.append('strand', strand);

    try {
      const response = await axios.post('http://localhost:3001/course/upload', data);
      alert(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const strandOptions = async () => {
    try{
      const response = await axios.get('http://localhost:3001/strand/fetch');
      const strands = response.data.map((strand) => strand.name);
      setStrands(strands);
    }
    catch(error){
      console.log(error);
    }
  } 

  useEffect(() => {
    strandOptions();
  }, [])

  return (
    <>
      <Link
        to="/courses"
        className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"
      >
        <TbArrowBackUp />
        Back
      </Link>
      <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mt-4">Add Course</h2>
        <form onSubmit={submitData} method="POST" encType="multipart/form-data" className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
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
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            ></textarea>
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
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="strand" className="block text-gray-700 font-bold">
              Strand:
            </label>
            <select
              id="strand"
              name="strand"
              value={formData.strand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            >
              {
                strands.map((strand, index) => (
                  <option key={index} value={strand}>{strand}</option>
                ))
              }
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 w-full text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
           Save
          </button>
        </form>
      </div>
    </>
  );
}

export default AddCourse;
