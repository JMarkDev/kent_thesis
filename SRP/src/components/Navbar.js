import React, {useEffect, useState} from "react";
import Toggle from './ThemeToggle'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import  axios  from "axios";


const Navbar = () => {
  
const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('')

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

  const showProfile = () => {
    // alert("helloo")
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
    <nav className=' border-gray-200 mx-2  px-3 py-3 rounded dark:bg-gray-800 bg-neutral-400 mt-3'>
      <div className='container flex justify-between items-center mx-auto pt-3 mb-2'>
        <div className='flex justify-start'>
          <h1 className="ml-5 text-xl font-bold dark:text-white">{pageTitle}</h1>
        </div>

        
        <div
          className="flex items-center gap-[15px] relative"
          onClick={showProfile}
        >
        <div className='flex justify-end pr-4 hover:opacity-50'>
          <Toggle />
        </div>
          <p className="dark:text-white text-black font-medium">{name}</p>
          <div className=" gap-10 h-[10px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
            <img className="w-7 h-7 rounded-full object-cover hover:opacity-50"
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
    </nav>
  )
}

export default Navbar;

