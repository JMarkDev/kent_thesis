import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = [ 
    '#e88245', 
    '#8daa3b', 
    '#1f82c1', 
    '#9333ea', 
    '#ff5733', 
    '#6c5b7b', 
    '#ffcc29', 
    '#00a8cc' 
];

const modifiedCOLORS = COLORS.slice(1);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const PieComponent = ({ data }) => {
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const indexOfTotal = data.findIndex(item => item.strand === 'TOTAL');
        if (indexOfTotal !== -1) {
            // Create a new array without the first element with strand 'TOTAL'
            const pieDatas = [...data.slice(0, indexOfTotal), ...data.slice(indexOfTotal + 1)];
            setPieData(pieDatas);
        } else {
            setPieData(data);
        }
    }, [data]);

    return (
        <div>
            <div>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={modifiedCOLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 justify-center mx-auto items-center">
                {pieData.map((item, index) => (
                    <div key={`color-${index}`} className="flex justify-start items-center mx-auto mb-4">
                        <div className="w-6 h-6 mr-2" style={{ backgroundColor: modifiedCOLORS[index % COLORS.length] }}></div>
                        <p className='flex cursor-pointer font-bold justify-center items-center mx-auto'>{item.strand}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PieComponent;
