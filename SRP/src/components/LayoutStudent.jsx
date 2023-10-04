import React from 'react'
import NavbarStudent from './NavbarStudent'
import SidebarStudent from './SidebarStudent'

const LayoutStudent = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-full'>
                <div className='grow'>
                    <NavbarStudent />
                    <div>{children}</div>
                </div>
            </div>
        </>
    )
}

export default LayoutStudent
