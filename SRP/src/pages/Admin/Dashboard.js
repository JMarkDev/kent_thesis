import React, { useEffect, useState } from 'react'
import { FaRegCalendarMinus, FaEllipsisV, FaUser } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from './PieComponent';
// import { Progress } from 'antd';
import axios from 'axios';


const datas = [
    {
        id: 1,
        name: '2023',
        STEM: 300,
        ABM: 180,
        HUMMS: 100,
        SMAW: 500,
        amt: 400,
    },
    {
        id: 2,
        name: '2024',
        STEM: 300,
        ABM: 200,
        HUMMS: 100,
        SMAW: 250,
        amt: 450,
    },
    {
        id: 3,
        name: '2025',
        STEM: 500,
        ABM: 300,
        HUMMS: 100,
        SMAW: 150,
        amt: 350,
    },
    {
        id: 4,
        name: '2026',
        STEM: 300,
        ABM: 50,
        HUMMS: 150,
        SMAW: 200,
        amt: 500,
    },
    {
        id: 5,
        name: '2027',
        STEM: 250,
        ABM: 150,
        HUMMS: 80,
        SMAW: 200,
        amt: 550,
    },
    {
        id: 6,
        name: '2028',
        STEM: 300,
        ABM: 200,
        HUMMS: 110,
        SMAW: 250,
        amt: 600,
    },
    {
        id: 7,
        name: '2029',
        STEM: 250,
        ABM: 300,
        HUMMS: 100,
        SMAW: 200,
        amt: 800,
    },
    
];




const Dashboard = () => {
    const COLORS = ['#e88245', '#8daa3b', '#1f82c1', '#9333ea'];
    const [strand, setStrand] = useState([]);
    const handleData = async () => {
        try{
            const response = await axios.get('http://localhost:3001/strand/fetch');
            setStrand(response.data);
        } catch(err) {
            console.log(err);
        }
    }
    useEffect(() => {
        handleData();
    }, [])


    return (
        <div className='dash min-h-screen'>
            
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 '>
            
                <div className=' dark:bg-[#fdba74] border-2 h-[150px]  rounded-[20px] bg-white border-l-[6px] border-[#fdba74] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-emerald-200">
                    <FaUser fontSize={28} color="" />
             
                {/*    <div>
                    <h2 className='text-[#030712] text-[11px] leading-[17px] px-[10px] font-bold'>Total</h2>
                    <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px] px-[10px] dark:text-white'>100</h1>
                </div>
               
                {
                    strand.map((strand) => (
                        <div key={strand.id}>

                            <div className='dark:bg-[#9333ea] border-2 h-[150px] rounded-[20px] bg-white border-l-[6px] border-[#9333ea] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-emerald-200">
                                <FaUser fontSize={28} color="" />
            
                            </div>
                                <div>
                                    <h2 className='text-[#030712] text-[11px] leading-[17px] px-[10px] font-bold'>{strand.name}</h2>
                                    <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{strand.value}</h1>
                                </div>
                            </div>
                            
                        </div>

                        
                    ))
                }
            */}
				</div>
                    <div>
                        <h2 className='text-[#030712] text-[11px] leading-[17px] px-[10px] font-bold'>ABM</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px] px-[10px] dark:text-white'>100</h1>
                    </div>
                </div>
                <div className='dark:bg-[#bef264] border-2 h-[150px]  rounded-[20px] bg-white border-l-[6px] border-[#bef264] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-emerald-200">
                    <FaUser fontSize={28} color="" />

				</div>
                    <div>
                        <h2 className='text-[#030712] text-[11px] leading-[17px] px-[10px] font-bold'>
                            STEM</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>150</h1>
                    </div>
                </div>
                <div className='dark:bg-[#38bdf8] border-2 h-[150px] rounded-[20px] bg-white border-l-[6px] border-[#38bdf8] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-emerald-200">
                    <FaUser fontSize={28} color="" />

				</div>
                    <div>
                        <h2 className='text-[#030712] text-[11px] leading-[17px] px-[10px] font-bold'>HUMMS</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>100</h1>
                    </div>
                </div>
                <div className='dark:bg-[#9333ea] border-2 h-[150px] rounded-[20px] bg-white border-l-[6px] border-[#9333ea] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-emerald-200">
                    <FaUser fontSize={28} color="" />

				</div>
                    <div>
                        <h2 className='text-[#030712] text-[11px] leading-[17px] px-[10px] font-bold'>SMAW</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>100</h1>
                    </div>
                </div>

            </div>
            <div className='flex flex-col md:flex-row md:gap-6 mt-[16px] w-full'>
            <div className='basis-[60%] border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-black mb-4 md:mb-0 lg:mb-0 lg:mr-4'>
                    <div className='bg-gray-300 flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-gray-800 border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#020617]  dark:text-white text-[16px] leading-[19px] font-bold '>Students Chart</h2>
                        
                    </div>

                    <div className="lineChart">
                        {/* <canvas id="myAreaChart"></canvas> */}
                        {/* <Line options={options} data={data} /> */}
                        <ResponsiveContainer width="93%" height={400}>
                        <LineChart
                            data={datas}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="ABM" stroke="#e88245" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="STEM" stroke="#8daa3b" />
                            <Line type="monotone" dataKey="HUMMS" stroke="#1f82c1" />
                            <Line type="monotone" dataKey="SMAW" stroke="#9333ea" />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
                <div className='basis-[40%] border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-black'>
                    <div className='bg-gray-300 flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-gray-800 border-[#EDEDED]'>
                        <h2 className='text-[#020617]  dark:text-white  text-[16px] leading-[19px] font-bold'>Proportion</h2>
                        
                    </div>
                    <div className=' w-full h-4/5 dark:text-white'>

                        <PieComponent />

                        {

                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard   