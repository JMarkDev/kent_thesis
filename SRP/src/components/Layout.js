import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-full w-auto '>
                <Sidebar />
                <div className='grow'>
                    <Navbar />
                    <div className='m-4 mt-5'>{children}</div>
                </div>
            </div>
        </>
    )
}

export default Layout
