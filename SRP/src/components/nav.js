import React, {useState, Fragment} from "react";
import Toggle from './ThemeToggle'
import { useNavigate } from 'react-router-dom'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';


const Navbar = () => {
  
const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showProfile = () => {
    // alert("helloo")
    setOpen(!open);
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className='w-full h-20 bg-gray-100 dark:bg-gray-800 '>
        <div className='container flex justify-between items-center mx-auto pt-4'>
        <div className='flex items-center mx-auto'>
        
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12 items-center">
            {/* Add Popover content here */}
            <Link to="/Home" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-400">
              Home
            </Link>
            <Link to="/Strands" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-400">
              Strands
            </Link>
            <Link to="/AboutUs" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-orange-400">
              About Us
            </Link>
          </Popover.Group>

        <div className='flex justify-end pr-4'>
          <Toggle />
        </div>
        <div
          className="flex items-center gap-[15px] relative"
          onClick={showProfile}
        >
          <p className="dark:text-white text-black font-medium">Kentoy</p>
          <div className=" gap-10 h-[10px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
            <img className="w-7 h-7 rounded-full object-cover"
              src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
              alt=""
            />
          </div>

          {open && (
            <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
              <p className="cursor-pointer hover:text-[blue] font-semibold">
                Profile
              </p>
              <p className="cursor-pointer hover:text-[blue] font-semibold">
                Settings
              </p>
              <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleLogout}>
                Log out
              </p>
            </div>
          )}
        </div>
      </div>
  </header>
  )
}

export default Navbar
