import React from 'react'
import NavbarStudent from './NavbarStudent'

const LayoutStudent = ({ children }) => {
    return (
        <>
            <div className='w-[100vw] flex flex-auto h-full'>
                <div className='grow'>
                    <NavbarStudent />
                    <div>{children}</div>
                </div>
            </div>
        </>
    )
}

export default LayoutStudent
