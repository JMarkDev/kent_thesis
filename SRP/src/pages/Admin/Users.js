  import React, { useEffect, useState } from "react";
  import { Card, Typography } from "@material-tailwind/react";
  import axios from "axios";
  import { Dialog, Transition } from "@headlessui/react";
  import { Fragment } from "react";
  import { MdDelete } from "react-icons/md";
  import Dropdown from '../../../src/components/Dropdown'
  export function Users() {
    const [userData, setUserData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
      // Specify the role you want to fetch (in this case, "student")
      const roleToFetch = "student";
    
      axios
        .get(`http://localhost:3001/students/fetch?role=${roleToFetch}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
        });
    }, []);
    

    useEffect(() => {
      if (searchQuery === "") {
        setSuggestions([]);
        return;
      }
      // Filter user data based on the search query
      const filteredSuggestions = userData.filter((user) =>
        user.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    }, [searchQuery, userData]);

    const openDeleteDialog = (id) => {
      setDeleteUserId(id);
      setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
      setDeleteUserId(null);
      setIsDeleteDialogOpen(false);
    };

    const handleDeleteUser = async (id) => {
      try{
        await axios.delete(`http://localhost:3001/students/delete/${id}`);  
        setUserData((userData) => userData.filter((user) => user.id !== id));
      }
      catch(error){
        console.log(error);
      }
      closeDeleteDialog();
    };

    useEffect(() => {
      const handleFilterCards = async () => {
          try {
              const response = await axios.get('http://localhost:3001/filter/fetch/all');
              setFilterData(response.data);
          } catch (err) {
              console.log(err);
          }
      }
      handleFilterCards();
  }, [])


    const handleFilter = async (strand) => {
      if(strand === 'Default'){
        const response = await axios.get('http://localhost:3001/filter/fetch/all');
        setFilterData(response.data);
      }
      else{
        try {
          const response = await axios.get(`http://localhost:3001/filter/fetch/${strand}`);
          setFilterData(response.data);
        } catch (err) {
            console.log(err);
        }
      }
  
  };

    return (
      <div className="py-5 px-2 bg-gray-200 dark:bg-gray-900 min-h-screen w-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              className="block w-40 md:w-60 px-2 py-2 text-purple-700 bg-white border rounded-full focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="px-2 py-2 text-white bg-purple-600 w-10 rounded-full ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-5 rounded-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div>
            <Dropdown handleFilter={handleFilter}/>
          </div>
          
        </div>
        <Card className="w-full overflow-x-auto bg-white">
          <table className="w-full table-auto text-center">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    ID
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Name
                  </Typography>
                </th>
                 <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Username
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    GENDER
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    ROLE
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    RECOMMENDED
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    ACTION
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {suggestions.length === 0
                ? filterData.map(({ id, name, username, gender,role, recommended }) => (
                    <tr key={id}>
                    
                    <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {id}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {username}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {gender}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {role}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                          {recommended}
                      </td>
                    
                      <td className="p-4 md:table-cell">
                        {/* Add delete action with trashcan icon */}
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => openDeleteDialog(id)}
                        >
                        <MdDelete className="h-6 w-6"/>
                        </button>
                      </td>
                    </tr>
                  ))
                : suggestions.map(({ id, name, username, gender, role, recommended }) => (
                    <tr key={id}>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {id}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {username}
                      </Typography>
                    </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {gender}
                        </Typography>
                      </td>
                      <td className="p-4 md:table-cell">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {role}
                        </Typography>
                      </td>
                      {/* Add more columns for other user properties */}
                      <td className="p-4 md:table-cell">
                      {recommended}
                      </td>
                      <td className="p-4 md:table-cell">
                        {/* Add delete action with trashcan icon */}
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => openDeleteDialog(id)}
                        >
                        <MdDelete className="h-6 w-6"/>
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Transition show={isDeleteDialogOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeDeleteDialog}
          >
            <div className="min-h-screen px-4 text-center">
              {/* Use the appropriate element depending on your needs */}
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              {/* This is your modal container */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete User
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this user?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={() => handleDeleteUser(deleteUserId)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={closeDeleteDialog}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  }

  export default Users;
