import React, { useEffect, useState } from "react";
import Toggle from './ThemeToggle'
import { FaUser } from "react-icons/fa"
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import axios from "axios";
import userImg from ".././assets/images/user.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/users': 'Users',
    '/admin': 'Admin',
    '/add-admin': 'Add Admin',
    [`/update/${id}`]: 'Update Admin',
    '/course-stem': 'STEM',
    '/course-abm': 'ABM',
    '/course-humss': 'HUMSS',
    '/course-smaw': 'SMAW',
    '/courses/add': 'Add Course',
    '/courses': 'Courses',
    [`/course/edit/${id}`]: 'Edit Course',
    '/strand': 'Strand'
  }

  const pageTitle = pageTitles[location.pathname];

  const showProfile = (e) => {
    const isToggle = e.target.classList.contains('toggle-button');
    const isProfileIcon = e.target.classList.contains('profile-icon');

    // If the click is on the profile icon or toggle button, toggle the profile dropdown
    if (isProfileIcon || isToggle) {
      setOpen(!open);
    } else {
      // If the click is outside the profile icon and toggle button, close the profile dropdown
      setOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    navigate("/");
  };

  const getName = async () => {
    const name = localStorage.getItem('userId');
    await axios.get(`http://localhost:3001/students/${name}`)
      .then((res) => {
        const name = res.data[0].name;
        setName(name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getName();
  }, []);

  return (
      <nav className=' bg-[#14b8a6] dark:bg-[#042f2e] mx-4 px-3 py-2 rounded-xl  mt-3 border-x-4 border-y-2 border-black dark:border-white'>
        <div className='container flex justify-between items-center mx-auto pt-3 mb-2'>
          <div className='flex justify-start'>
          <h1 className="ml-10  font-bold dark:text-white text-left sm:text-xs md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
      Central Command for Students Recommendations and System Management
    </h1>
        </div>

        <div
          className="flex items-center gap-[15px] relative"
          onClick={showProfile}
        >
          <div className='flex justify-end pr-4 hover:opacity-50'>
            {/* Add the 'toggle-button' class to your Toggle component */}
            <Toggle className="toggle-button " />
          </div>

          <p className="dark:text-white text-black font-medium">
            {/* Add the 'profile-icon' class to your profile icon */}
            {name}
          </p>

          <div className=" gap-10 h-[10px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
            {/* Add the 'profile-icon' class to your profile icon */}
            <img
              className="w-7 h-7 rounded-full object-cover hover:opacity-50 dark:bg-white profile-icon"
              src={userImg}
              alt=""
            />
          </div>

          {open && (
            <div className="bg-white border h-[40px] w-[100px] absolute bottom-[-50px] z-20 right-0 pt-[8px] pl-[15px] space-y-[15px]">
              <p className="cursor-pointer hover:text-blue-500 font-semibold" onClick={handleLogout}>
                Log out
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
