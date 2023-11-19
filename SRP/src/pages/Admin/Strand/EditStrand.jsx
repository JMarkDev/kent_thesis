import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ImCancelCircle } from 'react-icons/im';

function EditStrand() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: [],
    selectedSubjects: [],
    recommendationConditions: {}
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  

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

  useEffect(() => {
    axios.get(`http://localhost:3001/strand/fetch/${id}`)
      .then((response) => {
        const data = response.data;
        const imageData = data.image.split(',');
        const recommendationConditions = JSON.parse(data.recommendationConditions || '{}');

        setFormData((prevFormData) => ({
          ...prevFormData,
          name: data.name,
          description: data.description,
          image: imageData,
          selectedSubjects: Object.keys(recommendationConditions),
          recommendationConditions: {
            ...prevFormData.recommendationConditions,
            ...recommendationConditions,
        },
        }));
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, [id, setFormData]);

  const handleInputChange = (e) => {
    const { name, files } = e.target;
    if (name === 'image') {
      const newImages = Array.from(files).map(file => file.name); // Convert FileList to an array of file names
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: [...prevFormData.image, ...newImages],
      }));
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const updatedFormData = new FormData();
  
    updatedFormData.append('name', formData.name);
    updatedFormData.append('description', formData.description);
    updatedFormData.append('recommendationConditions', JSON.stringify(formData.recommendationConditions));
  
    // Append the image filenames as a JSON string with the key 'image'
    updatedFormData.append('image', JSON.stringify(formData.image));
    if(e.target.type === "submit" ) {
      try {
        const response = await axios.put(`http://localhost:3001/strand/edit/${id}`, updatedFormData);
        alert(response.data.data);
        navigate('/strand');
      } catch (error) {
        console.error('Error updating strand', error);
      }
    } 
    
  }

  const removeImage = (index) => {
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.image];
      updatedImages.splice(index, 1);
      
      return {
        ...prevFormData,
        image: updatedImages,
      };
    });
  };

  const handleSubjectChange = (selectedSubjects) => {
    setFormData((prevFormData) => {
      const updatedRecommendationConditions = { ...prevFormData.recommendationConditions };
  
      // Remove subjects that are unchecked
      for (const subject in updatedRecommendationConditions) {
        if (!selectedSubjects.includes(subject)) {
          delete updatedRecommendationConditions[subject];
        }
      }
  
      return {
        ...prevFormData,
        selectedSubjects,
        recommendationConditions: updatedRecommendationConditions,
      };
    });
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
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value })}
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
    // required
    multiple
  />
      <div className="flex flex-wrap">
        {formData.image?.map((image, index) => (
          <div key={index} className="relative mt-4 ml-3">
            <img
              src={`http://localhost:3001/uploads/${image}`}
              alt="strand"
              className="w-[100px] h-[100px] object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 text-red-500 bg-gray-400 rounded-full cursor-pointer text-2xl"
            >
              <ImCancelCircle className='text-2xl'/>
            </button>
          </div>
        ))}
      </div>
        
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value})}
              rows="6"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            ></textarea>
          </div>

          <label className="block text-gray-700 font-bold">Select Subjects:</label>
          {
            subjects?.map((subject, index) => (
              <div key={index}>
                <label>
                <input
                type="checkbox"
                value={subject}
                //value={formData.recommendationConditions[subject] || ''}
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
            
            ))
          }
             {formData.selectedSubjects.map((subject) => (
              <div key={subject} className="mb-4">
                <label htmlFor={subject} className="block text-gray-700 font-bold">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)} Grade:
                </label>
                <input
                  type="number"
                  id={subject}
                  name={subject}
                  // value={formData.selectedGrades[formData.selectedSubjects.indexOf(subject)]}
                  value={formData.recommendationConditions[subject] || ''}
                  onChange={(e) => handleRecommendationChange(subject, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
            ))}
      
          <button
            onClick={handleUpdate}
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
