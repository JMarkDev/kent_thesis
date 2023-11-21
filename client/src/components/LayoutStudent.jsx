import React from 'react'
import NavbarStudent from './NavbarStudent'

const LayoutStudent = ({ children }) => {
    return (
        <>
            <div className='w-auto flex flex-auto h-full bg-gradient-to-r from-cyan-600 to-transparent bg-gray-300 dark:bg-black'>
                <div className='grow'>
                    <NavbarStudent />
                    <div>{children}</div>
                </div>
            </div>
        </>
    )
}

export default LayoutStudent
