import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [gender, setGender] = useState("");
    const [recommended, setRecommended] = useState('');
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/students/${id}`);
                setName(response.data[0].name)
                setUsername(response.data[0].username)
                setGender(response.data[0].gender)
                setPassword(response.data[0].password)
                setRecommended(response.data[0].recommended)
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserData();
    }, [id]);

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }

    const handleUpdate = async function (e) {
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
            role: "student"
        }

        try {
            const response = await axios.put(`http://localhost:3001/students/update/${id}`, updateDetais);
            alert(response.data.message);
            setTimeout(() => {
                setIsEditing(false);
            }, 1000)
        } catch (err) {
            console.log(err.response);
            console.log(err);
        }
    }
    

    return (
        <div className='bg-gradient-to-b from-cyan-600 to-transparent  dark:bg-black h-[650px]'>
        <div className='flex justify-center items-center '>
            <div className='bg-white dark:bg-[#273242] mt-10 rounded shadow-md p-10 md:w-[550px]  lg:w-[550px]'>
                <h1 className='text-3xl font-bold text-center mb-4 dark:text-white'>Profile</h1>
                <div className=''>
                        <form>
                        <div className='mt-0 mx-3 mb-5'>
                        <div className='mt-0 mx-3 mb-5 flex flex-col justify-center items-center'>
                        </div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-white'>Full Name*</label>
                        <input type='text'
                        disabled 
                        value={name} 
                        className='dark:text-white mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                        </div>
                        <div className='mt-0 mx-3 mb-5'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-white'>Email*</label>
                        <input type='text' 
                            value={username}  
                            className='dark:text-white mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                            disabled
                        /> 
                        </div>
                        <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Gender*</label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === "male"}
                                onChange={handleGenderChange} 
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label htmlFor="male" className="ml-2 dark:text-white">Male</label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === "female"}
                                onChange={handleGenderChange} 
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out ml-3"
                            />
                            <label htmlFor="female" className="ml-2 dark:text-white">Female</label>
                        </div>
                        <div className='mt-0 mx-3 mb-5'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-white'>Recommended Strand:</label>
                        {
                            recommended ? <p className='text-sm text-gray-500 dark:text-white'>{recommended}</p> : 
                            <div className='flex'>
                            <p className='text-red-700 text-sm dark:text-white'>You have not taken the recommendation yet</p> 
                            <Link className='text-blue-700 ml-2 dark:text-white' to='/input'>Click here</Link> 
                            </div>
                        }
                        </div>
                        </form>
                        
                </div>
                <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>

                    {/* Modal for editing profile */}
                    {isEditing && (
                        <div className='px-5 fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50'>
                            <div className='w-[550px]  bg-white dark:bg-[#273242] rounded-lg p-8'>
                            <form onSubmit={handleUpdate} method="PUT" encType="multipart/form-data">
                            <div className='mt-0 mx-3 mb-5'>
                            <div className='mt-0 mx-3 mb-5 flex flex-col justify-center items-center'>
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Full Name*</label>
                            <input type='text'
                            name='name' 
                            value={name} 
                            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            onChange={(e) => setName(e.target.value)}
                            />
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Email*</label>
                            <input type='text' 
                                name='username'
                                value={username}  
                                className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                                onChange={(e) => setUsername(e.target.value)}    
                            />
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-white'>Gender*</label>
                                <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === "male"}
                                onChange={handleGenderChange}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label htmlFor="male" className="ml-2 dark:text-white">Male</label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === "female"}
                                onChange={handleGenderChange}
                                className="form-radio h-4 w-4 text-indigo-600  transition duration-150 ease-in-out ml-3"
                            />
                            <label htmlFor="female" className="ml-2 dark:text-white">Female</label>
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Password*</label>
                            <input
                            type="password"
                            name="password"
                            placeholder='********'
                            // value={password} 
                            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            </div>
                            <div className='mt-0 mx-3 mb-5'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-white'>Confirm Password*</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                placeholder='********'
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ' 
                            />
                            </div>
                            <div className='flex justify-end '>
                                    <button 
                                    onClick={() => setIsEditing(false)} 
                                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4'
                                    >
                                        Close
                                    </button>
                                    <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
                                    type='Submit'
                                    >
                                    Save
                                </button>
                                </div>
                            </form>
                                
                               
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
