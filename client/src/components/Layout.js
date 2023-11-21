import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-full w-auto bg-[#737373] dark:bg-[#030712] '>
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
