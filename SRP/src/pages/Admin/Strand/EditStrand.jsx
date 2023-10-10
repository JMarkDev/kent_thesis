import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditStrand() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  let { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/strand/fetch/${id}`)
      .then((response) => {
        const data = response.data;
        setName(data.name);
        setDescription(data.description);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, [id]);

  const handleUpdate = async function (e) {
    e.preventDefault();

    const updateDetais = {
      name: name,
      description: description,
    };

    try {
      const response = await axios.put(`http://localhost:3001/strand/edit/${id}`, updateDetais);
      alert(response.data.data); // Log the success response data
      navigate('/strand');
    } catch (error) {
      alert(error.response.data.data); // Log the error response data
    }
  };

  return (
    <div>
      <Link
        to="/strand"
        className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"
      >
        <TbArrowBackUp />
        Back
      </Link>
      <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mt-4">Edit Strand</h2>
        <form onSubmit={handleUpdate} method="PUT" encType="multipart/form-data" className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold">
              Title:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 w-full text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditStrand;
