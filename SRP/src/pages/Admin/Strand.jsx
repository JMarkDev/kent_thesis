import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StrandTable from './Strand/StrandTable'

function Strand() {
  const [strand, setStrand] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/strand/fetch')
    .then((res) => {
      setStrand(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    <div>
          <div className='my-10'>
          <Link to='/strand/add' className=' bg-purple-700 p-3 px-5 rounded-lg text-white'>
            Add Strand
          </Link>
        </div>
      <StrandTable strand={strand}/>
    </div>
  )
}

export default Strand