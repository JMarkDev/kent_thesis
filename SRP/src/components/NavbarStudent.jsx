import React, { useState, useEffect } from "react";
import Toggle from './ThemeToggle'
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('')

  const showProfile = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    navigate("/");
  };

  const getName = async () => {
    const name = localStorage.getItem('userId')
    await axios.get(`http://localhost:3001/students/${name}`)
    .then((res) => {
      const name = res.data[0].name
      setName(name)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    getName()
  }, [])

  return (
    <header className="w-full h-auto sm:h-20 bg-[#38bdf8] dark:bg-[#075985]">
      <div className="container flex flex-col sm:flex-row justify-between items-center m-auto mx-auto pt-4">
        <div className="flex items-center gap-4 sm:gap-20 ml-10">
          <Link
            to="/Home"
            className={`flex items-center gap-x-2 p-2 sm:p-3 text-base font-semibold rounded-2xl cursor-pointer ${
              location.pathname === "/Home" ? " underline" : "text-gray-900 dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200"
            }`}
          >
            Home
          </Link>
          <Link
            to="/Strands"
            className={`flex items-center gap-x-2 p-2 sm:p-3 text-base font-semibold rounded-2xl cursor-pointer ${
              location.pathname.includes("/Strands") ? "underline" : "text-gray-900 dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200"
            }`}
          >
            Strands
          </Link>
          <Link
            to="/AboutUs"
            className={`flex items-center gap-x-2 p-2 sm:p-3 text-base font-semibold rounded-2xl cursor-pointer ${
              location.pathname === "/AboutUs" ? "underline" : "text-gray-900 dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200"
            }`}
          >
            About Us
          </Link>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Add hover effect to the Toggle */}
          <div className=" hover:opacity-50">
            <Toggle />
          </div>
          <div
            className="flex items-center gap-[15px] relative"
            onClick={showProfile}
          >
            <p className="dark:text-white text-black font-medium">{name}</p>
            <div className="gap-10 h-[10px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40 hover:opacity-50 mr-5">
              <img
                className="w-7 h-7 rounded-full object-cover"
                src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                alt=""
              />
            </div>

            {open && (
              <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                <p className="cursor-pointer hover:text-blue-500 font-semibold">
                  Profile
                </p>
                <p className="cursor-pointer hover:text-blue-500 font-semibold">
                  Settings
                </p>
                <p
                  className="cursor-pointer hover:text-blue-500 font-semibold"
                  onClick={handleLogout}
                >
                  Log out
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
