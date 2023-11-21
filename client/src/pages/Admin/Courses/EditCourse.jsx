import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCourse() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(''); // Initialize image as null
  const [description, setDescription] = useState('');
  const [strand, setStrand] = useState('');
  const [strands, setStrands] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/course/${id}`)
      .then((response) => {
        const data = response.data;
        setTitle(data[0].title);
        setDescription(data[0].description);
        setStrand(data[0].strand);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, [id]);

  const handleImageChange = (e) => {
    // Handle image selection
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleUpdate = async function (e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('strand', strand);
    if (image) {
      formData.append('image', image); // Append the selected image to the formData
    }
  
    try {
      const response = await axios.put(`http://localhost:3001/course/edit/${id}`, formData);
      alert(response.data.data); // Log the success response data
      navigate('/courses');
    } catch (error) {
      console.error('Error updating course', error);
      if (error.response) {
        // Handle server errors, including the case where the title already exists
        if (error.response.status === 400 && error.response.data.Error === 'Title already exists') {
          alert('Title already exists. Please choose a different title.');
        } else {
          alert('An error occurred during course update.');
        }
      } else {
        alert('An error occurred during course update.');
      }
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
        className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center hover:bg-orange-500"
      >
        <TbArrowBackUp />
        Back
      </Link>
      <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mt-4 dark:text-white" >Edit Course</h2>
        <form onSubmit={handleUpdate} method="PUT" encType="multipart/form-data" className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold dark:text-white">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold dark:text-white">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-bold dark:text-white">
              Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="strand" className="block text-gray-700 font-bold dark:text-white">
              Strand:
            </label>
            <select
              id="strand"
              name="strand"
              value={strand}
              onChange={(e) => setStrand(e.target.value)}
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
            Update
          </button>
        </form>
      </div>
    </>
  );
}

export default EditCourse;
