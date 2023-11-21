  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
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
    const [rankings, setRankings] = useState({});
    const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
    const [strandData, setStrandData] = useState([]);

    const openWhyModal = () => {
      setIsWhyModalOpen(true);
    };
  
    const closeWhyModal = () => {
      setIsWhyModalOpen(false);
    };

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
    useEffect(() => {
      const handleRanking = async (id) => {
        try {
          const response = await axios.get(`http://localhost:3001/rank/${id}`);
          if (response.data && response.data.length > 0 && response.data[0].strandRanking) {
            const strandRankingArray = JSON.parse(response.data[0].strandRanking);
            console.log('Strand Ranking Array:', strandRankingArray);
            setRankings((prevRankings) => ({
              ...prevRankings,
              [id]: strandRankingArray,
            }));

            if (strandRankingArray.length > 0) {
              const strandData = strandRankingArray.map(({ strand, reason }) => ({ strand, reason }));
              setStrandData(strandData);
              console.log(strandData);
            } else {
              console.log('No ranking data found in the response');
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
    
      // Assuming you have an array of user IDs (replace [644] with your actual array)
      const userIds = userData.map((user) => user.id);
    
      // Fetch ranking for each user ID
      userIds.forEach((id) => {
        handleRanking(id);
      });
    }, [userData]);

    

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
      <div className="py-5 px-2 min-h-screen w-auto">
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
        <Card className="w-full overflow-x-auto bg-white  ">
        <table className="w-full table-auto text-center bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  ID
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Name
                </Typography>
              </th>
               <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Username
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  GENDER
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  ROLE
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  RECOMMENDED
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 mr-20" 
                >
                    Strand Ranking
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 md:table-cell bg-[#a8a29e] dark:bg-[#292524] text-black dark:text-white">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 "
                  >
                  ACTIONS
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black dark:divide-white">
            {suggestions.length === 0
              ? filterData.map(({ id, name, username, gender, role, recommended }) => (
                  <tr key={id}>
                    <td className="p-4 md:table-cell">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {id}
                      </Typography>
                    </td>
                    <td className="p-4 md:table-cell">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {name}
                      </Typography>
                    </td>
                    <td className="p-4 md:table-cell">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {username}
                      </Typography>
                    </td>
                    <td className="p-4 md:table-cell">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {gender}
                      </Typography>
                    </td>
                    <td className="p-4 md:table-cell">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {role}
                      </Typography>
                    </td>
                    <td className="p-4 md:table-cell">
                      {recommended}
                    </td>
                    <td className="p-4 md:table-cell" key={`${id}-strand`}>
                      
                    <td className="p-4 md:table-cell" key={`${id}-strand`}>
                  {/**
                {rankings[id] && rankings[id].map((data, index) => (
                      <div key={`${id}-strand-${index}`}>
                        <p>{index + 1}. {data.strand}</p>
                      </div>
                    ))}
                */}
                    {rankings[id] && rankings[id].length > 0 && (
                      <button  className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      onClick={() => openWhyModal()}>
                        View more
                      </button>
                    )}
                                 


                      <div
                  className={`fixed inset-0 flex items-center justify-center z-50 ${
                    isWhyModalOpen ? 'block' : 'hidden'
                  }`}
                  
                >
                        <div className="bg-gray-800 bg-opacity-70 absolute inset-0"></div>
                        <div className="bg-blue-300 dark:bg-blue-400 p-4 md:p-10 lg:p-20 rounded-lg shadow-md w-full max-w-2xl mt-10 relative">
                          <h2 className="text-3xl font-extrabold text-center text-blue-800 dark:text-blue-200 mb-6">Strand Ranking Based on Your Input Grades:</h2>
                          <ul className="list-none text-xl mb-4 text-gray-700 dark:text-gray-300">
                            {strandData.map((data, index) => (
                                                  <li key={index} className="mb-4 flex items-center">
                      <span className="text-2xl text-blue-600 dark:text-blue-300 mr-2">{index + 1}.</span>
                      <span className="text-xl">{`${data.strand}: "${data.reason}"`}</span>
                    </li>
                  ))}
                </ul>
                  
                              
                      <button
                        onClick={closeWhyModal} // Close the modal
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                            </td>
                              </td>

                    
                      <td className="p-4 md:table-cell">
                      <div className="flex items-center space-x-4">
                        <button
                          className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                          onClick={() => openDeleteDialog(id)}
                        >
                          <MdDelete className="h-6 w-6" />
                        </button>
                    
                        <Link
                          to={`/grades/${id}`}
                          className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                        View Inputs
                        </Link>
                      </div>
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
                     {/*} {rankings[id] && rankings[id].map((data, index) => (
                        <div key={`${id}-strand-${index}`}>
                          <p>{index + 1}. {data.strand}</p>
                        </div>
                      ))}
                     */}
                      {rankings[id] && rankings[id].length > 0 && (
                        <button  className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                         onClick={() => openWhyModal()}>
                          View more
                        </button>
                      )}
                            
                      </td>
                      <td className="p-4 md:table-cell">
                      <div className="flex items-center space-x-4">
                      <button
                        className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                        onClick={() => openDeleteDialog(id)}
                      >
                        <MdDelete className="h-6 w-6" />
                      </button>
                  
                      <Link
                        to={`/grades/${id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                      View Inputs  
                      </Link>
                    </div>
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
