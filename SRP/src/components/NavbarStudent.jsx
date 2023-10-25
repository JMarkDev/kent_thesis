import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toggle from "./ThemeToggle";
import HamburgerButton from "./HamburgerMenuButton/HamburgerButton";
import logo from "../../src/assets/images/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const showProfile = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getName = async () => {
    const name = localStorage.getItem("userId");
    try {
      const res = await axios.get(`http://localhost:3001/students/${name}`);
      const userName = res.data[0].name;
      setName(userName);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <header className="w-full h-auto sm:h-20 bg-sky-100 dark:bg-[#075985]">
      <div className="container flex flex-col sm:flex-row justify-between items-center m-auto mx-auto pt-4">
        <div className="flex justify-center items-center gap-3">
          <img src={logo} alt="logo" className="w-full h-[30px]" />
        </div>
        <div className="hidden sm:block">
          <ul className="flex items-center sm:gap-20">
            <li>
              <Link
                to="/Home"
                className={`flex items-center gap-x-2 p-2 sm:p-3 text-base font-semibold rounded-2xl cursor-pointer text-[#243e63]${
                  location.pathname === "/Home" ? "underline" : " dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/Strands"
                className={`flex items-center gap-x-2 p-2 sm:p-3 text-base font-semibold rounded-2xl cursor-pointer text-[#243e63] ${
                  location.pathname.includes("/Strands") ? "underline" : " dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200"
                }`}
              >
                Strands
              </Link>
            </li>
            <li>
              <Link
                to="/AboutUs"
                className={`flex items-center gap-x-2 p-2 sm:p-3 text-base font-semibold rounded-2xl text-[#243e63] cursor-pointer ${
                  location.pathname === "/AboutUs" ? "underline" : " dark:text-white hover-bg-sky-100 dark:hover:bg-gray-200"
                }`}
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="hover:opacity-50">
            <Toggle />
          </div>
          <div className="flex items-center gap-[15px] relative" onClick={showProfile}>
            <p className="dark:text-white text-[#243e63] font-medium">{name}</p>
            <div className="gap-10 h-[10px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40 hover:opacity-50 mr-5">
              <img
                className="w-7 h-7 rounded-full object-cover"
                src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                alt=""
              />
            </div>
            {open && (
              <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                <p className="cursor-pointer hover:text-blue-500 font-semibold">Profile</p>
                <p className="cursor-pointer hover:text-blue-500 font-semibold">Settings</p>
                <p className="cursor-pointer hover:text-blue-500 font-semibold" onClick={handleLogout}>
                  Log out
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-0">
        <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
      </div>
      <div className="sm:hidden">
        <div className="ml-6">
          <div
            className={`${mobileMenu ? "flex" : "hidden"} w-[90%] text-center absolute z-50 flex-col self-end py-8 mt-16 bg-gray-50 dark:bg-slate-800 drop-shadow rounded-xl`}
          >
            <ul>
              <li>
                <Link
                  to="/Home"
                  className={`block dark:text-white dark:hover:text-[#075985] p-2 text-xl font-semibold rounded-2xl cursor-pointer hover-bg-sky-100 dark:hover:bg-gray-200`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/Strands"
                  className={`block dark:text-white dark:hover:text-[#075985] p-2 text-xl font-semibold rounded-2xl cursor-pointer hover-bg-sky-100 dark:hover-bg-gray-200`}
                >
                  Strands
                </Link>
              </li>
              <li>
                <Link
                  to="/AboutUs"
                  className={`block dark:text-white dark:hover:text-[#075985] p-2 text-xl font-semibold rounded-2xl cursor-pointer hover-bg-sky-100 dark:hover-bg-gray-200`}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
