import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import { TbArrowBackUp } from "react-icons/tb";

function Edit_admin() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [gender, setGender] = useState("");

    const navigate = useNavigate()
    let {id} = useParams()

    useEffect(() => {
          axios.get(`http://localhost:3001/students/${id}`)
        .then((response) => {
            const data = response.data
            setName(data[0].name);
            setUsername(data[0].username);
            // setPasswordConfirmation(data.password);
            setGender(data[0].gender);
          })
          .catch((error) => {
            console.error("Error fetching data", error)
          })

      }, [id]);
      

    const handleSubmit = async function (e) {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            alert("Password and password confirmation do not match");
            return;
          }

        const updateDetais = {
            name: name,
            username: username,
            password: password,
            gender: gender,
            role: "admin"
        }

        try{
            await axios.put(`http://localhost:3001/students/update/${id}`, updateDetais);
            navigate('/admin')
        }
        catch(error){
          console.error("Error updating admin", error);
          if (error.response) {
            // Handle server errors, including the case where the username already exists
            if (error.response.status === 400 && error.response.data.Error === "Username already exists") {
              alert("Username already exists. Please choose a different username.");
            } else {
              alert("An error occurred during admin update.");
            }
          } else {
            alert("An error occurred during admin update.");
          }
        }
    }
  return (
    <div>
      <Link to={'/admin'} className="py-2 rounded-lg bg-gray-700 text-white flex items-center justify-center w-20 text-center"><TbArrowBackUp />Back</Link>
      <div className="w-full m-auto px-6 py-4 mt-6 overflow-hidden bg-gradient-to-b from-cyan-600 to-transparent  dark:bg-black shadow-md sm:max-w-lg sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white undefined"
            >
              Name
            </label>
            <div className="flex flex-col items-start">
            <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            </div>
          </div>
          <div className="mt-4">
            
            <div className="flex items-start">
              <label className="inline-flex items-center mt-2 mr-4 ">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={e =>
                    setGender(e.target.value)
                  }
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 dark:text-white">Male</span>
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={e =>
                    setGender(e.target.value)
                  }
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 dark:text-white">Female</span>
              </label>
              
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 undefined dark:text-white"
            >
              Email
            </label>
            <div className="flex flex-col items-start">
              <input
                type="email"
                name="email"
                value={username} 
                onChange={e => setUsername(e.target.value)} // Update values.username
                className="block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
         
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 undefined dark:text-white"
            >
              Password
            </label>
            <div className="flex flex-col items-start">
              <input
                type="password"
                placeholder="Password"
                name="password"
                // value={password}
                onChange={e => setPassword(e.target.value )}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 undefined dark:text-white"
            >
              Confirm Password
            </label>
            <div className="flex flex-col items-start">
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                // value={passwordConfirmation}
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
              Update
            </button>
          </div>
        </form>
        </div>
    </div>
  )
}

export default Edit_admin