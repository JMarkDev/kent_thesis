import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { LiaEdit } from 'react-icons/lia';
import axios from 'axios';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

function CourseTable({ courses }) {
  const [courseList, setCourseList] = useState(courses);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (id) => {
    setDeleteUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteUserId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/course/delete/${id}`);
      setCourseList((prevCourseList) => prevCourseList.filter((course) => course.id !== id));
    } catch (error) {
      console.log(error);
    }
    closeDeleteDialog();
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th
            className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            style={{ backgroundColor: '#ADD8E6' }}
          >
            Image
          </th>
          <th
            className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            style={{ backgroundColor: '#ADD8E6' }}
          >
            Title
          </th>
          <th
            className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            style={{ backgroundColor: '#ADD8E6' }}
          >
            Description
          </th>
          <th
            className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            style={{ backgroundColor: '#ADD8E6' }}
          >
            Strand
          </th>
          <th
            className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            style={{ backgroundColor: '#ADD8E6' }}
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {
            courses.map((course) => {
                return (
                    <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-no-wrap">
                            <div className="relative group">
                                <img
                                src={`http://localhost:3001${course.image}`}
                                    alt=""
                                    className="h-100 w-100 rounded-lg transition-transform transform scale-100 group-hover:scale-150"
                                />
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">{course.title}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{course.description}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{course.strand}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                            <button className="text-red-600 hover:text-red-800"
                                onClick={() => openDeleteDialog(course.id)}
                            >
                                <MdDelete className="h-6 w-6" />
                            </button>
                            <button className="ml-5 text-red-600 hover:text-red-800">
                                <Link to="" className="text-decoration-none">
                                    <LiaEdit className="h-6 w-6" />
                                </Link>
                            </button>
                        </td>
                    </tr>
                );
            })            
        }
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
                onClick={() => handleDeleteCourse(deleteUserId)} // Pass deleteUserId here
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
    
      </tbody>
    </table>
  );
}

export default CourseTable;
