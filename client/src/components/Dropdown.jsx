import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dropdown(props) {
  const [selectedFilter, setSelectedFilter] = useState('Filter Courses');
  const [strands, setStrands] = useState([]);

  const handleMenuClick = (filter) => {
    setSelectedFilter(filter); // Update the selected filter text
    props.handleFilter(filter); // Call the parent component's filter function
  };

  useEffect(() => {
    const handleFilter = async () => {
      await axios.get('http://localhost:3001/strand/fetch', {
        params: {
          filter: selectedFilter
        }
      }).then((response) => {
        const name = response.data.map((strand) => strand.name);
    
        setStrands(name);
      })
    }
    
    handleFilter();
  }, [selectedFilter])
  


  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedFilter} {/* Display the selected filter text */}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleMenuClick('Default')} // Update selected filter and call parent's filter function
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 w-full text-left text-sm'
                  )}
                >
                  Default
                </button>
              )}
            </Menu.Item>
            {
              strands.map((strand, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <button
                        onClick={() => handleMenuClick(strand)} // Update selected filter and call parent's filter function
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 w-full text-left text-sm'
                        )}
                      >
                        {strand}
                      </button>
                    )}
                  </Menu.Item>
              ))
            }
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
