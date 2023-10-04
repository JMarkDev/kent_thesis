import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TbArrowBackUp } from "react-icons/tb";

function Add_admin() {
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    username: "", // Assuming username maps to email
    password: "",
    gender: "",
    role: "admin", // Set a default role
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (values.password !== passwordConfirmation) {
      console.error("Password and password confirmation do not match");
      return;
    }

    try {
      // Set the role to "admin" before sending the POST request
      values.role = "admin";
    
      const response = await axios.post("http://localhost:3001/register", values);
    
      console.log("Response from server:", response); // Add this line for debugging
    
      if (response.data.status === "success") {
        setRegistrationStatus("success");
        alert("Added Successfully");
        navigate('/admin');
      } else {
        setRegistrationStatus("error");
      }
    } catch (error) {
      setRegistrationStatus("error");
      alert(error.response ? error.response.data.message : "An error occurred during registration.");
    }
    };

  return (
    <div>
    <Link to={'/admin'} className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"><TbArrowBackUp />Back</Link>
        <div className="w-full m-auto px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
        <form onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Name
            </label>
            <div className="flex flex-col items-start">
              <input
                type="text" 
                name="name"
                value={values.name}
                onChange={e =>
                  setValues({ ...values, name: e.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-4">
            
            <div className="flex items-start">
              <label className="inline-flex items-center mt-2 mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={values.gender === "male"}
                  onChange={e =>
                    setValues({ ...values, gender: e.target.value })
                  }
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={values.gender === "female"}
                  onChange={e =>
                    setValues({ ...values, gender: e.target.value })
                  }
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2">Female</span>
              </label>
              
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Email
            </label>
            <div className="flex flex-col items-start">
              <input
                type="email"
                name="email"
                value={values.username} // Use values.username
                onChange={e => setValues({ ...values, username: e.target.value })} // Update values.username
                className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
         
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Password
            </label>
            <div className="flex flex-col items-start">
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={e => setValues({ ...values, password: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Confirm Password
            </label>
            <div className="flex flex-col items-start">
              <input
                type="password"
                name="password_confirmation"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
        </div>
    </div>
  )
}

export default Add_admin