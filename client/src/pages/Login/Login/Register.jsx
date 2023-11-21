import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../../assets/images/logo.png'

export default function Register() {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    username: "", // Assuming username maps to email
    password: "",
    gender: "", // Change to gender
    role: "student", // Set a default role
  });

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (values.password !== passwordConfirmation) {
      console.error("Password and password confirmation do not match");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3001/register", values);
  
      if (response.data.status === "success") {
        setRegistrationStatus("success");
        setTimeout(() => {
          navigate("/Log-in");
        }, 2000);
      } else if (response.data.status === "error") {
        setRegistrationStatus("error");
        alert(response.data.message);
      } else {
        setRegistrationStatus("error");
        // Handle other error cases here if needed.
        alert("An error occurred during registration.");
      }
    } 
    catch (error) {
      console.error(error); // Log the error
      setRegistrationStatus("error");
      alert(error.response ? error.response.data.message : "An error occurred during registration.");
    }
  };
  

  return (
    <div>
      {registrationStatus === "success" && (
        <div
          className="flex w-1/2 mx-auto rounded-lg bg-green-100 px-6 py-5 text-base text-green-500 justify-center items-center"
          role="alert"
        >
          Registration successful! Redirecting to the login page...
        </div>
      )}
      {registrationStatus === "error" && (
        <div
          className="mb-4 rounded-lg bg-error-100 px-6 py-5 text-base text-error-700"
          role="alert"
        >
          Registration failed. Please try again.
        </div>
      )}
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
        <div className="p-5 m-auto flex justify-center items-center">
          <img src={logo} className="w-[200px] h-[30px] " alt="logo"/>
        </div>
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
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Gender
              </label>
              <div className="flex items-start">
                <label className="inline-flex items-center mt-2 mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={values.gender === "male"}
                    onChange={(e) =>
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
                    onChange={(e) =>
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
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <button
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        
          <div className="mt-4 text-gray-600">
            Already have an account?{" "}
            <span>
              <Link to="/Log-in" className="text-purple-600 hover:underline">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
