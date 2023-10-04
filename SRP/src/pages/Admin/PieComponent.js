

import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
const data = [
    { name: 'ABM', value: 100 },
    { name: 'STEM', value: 150 },
    { name: 'HUMMS', value: 100 },
    { name: 'SMAW', value: 120 },
    
];

const COLORS = ['#fdba74', '#bef264', '#38bdf8', '#9333ea'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const PieComponent = () => {
    return (
        <div>
                <div >
                <ResponsiveContainer width="100%" height={400}>
                <PieChart >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
                </div>
                <div className='grid gap-4 sm:grid-cols-2  md:grid-cols-4 lg:grid-cols-4 justify-center mx-auto items-center'>
                {
                  
                     data.map((item)=>(
                        <p className='flex cursor-pointer font-bold justify-center items-center mx-auto'>{item.name}</p>
                              ))

                }
                </div>
                <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
                    {
                         COLORS.map((item)=>(
                <div className="flex h-[20px] w-[20px] justify-center items-center mx-auto mb-4" style={{backgroundColor:item}}>

                  </div>
                         ))
  
                    }
                  

                </div>
        

        </div>
    )
}

export default PieComponent







// export default class Example extends PureComponent {
//     static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';

//     render() {
//         return (
           
//         );
//     }
// }
