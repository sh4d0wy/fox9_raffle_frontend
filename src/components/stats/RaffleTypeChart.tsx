/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const chartData = [
  { name: "NFT", value: 705 },
  { name: "Token", value: 1210 },
]

const COLORS = ["#FFEAB9", "#FFD400"]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="bg-black-1300 shadow-lg rounded-md p-2">
        <p className="text-sm font-inter">{item.name}</p>
        <p className="text-white text-sm font-inter">
          {item.percent}%
        </p>
      </div>
    )
  }
  return null
}


// Custom Legend component
const ChartLegend = ({ totalVolume }: { totalVolume: number }) => (
<div className="flex flex-col w-full gap-3 mt-0 justify-center">
  {chartData.map((entry, index) => {
    const percentage = ((entry.value / totalVolume) * 100).toFixed(1);

    return (
      <div
        key={entry.name}
        className="flex py-3 justify-between bg-black-1400 rounded-lg px-5 items-center gap-2"
      >
        <div className="flex gap-2 items-center">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-sm font-inter text-white">
            {entry.name}
          </span>
        </div>

        <span className="text-sm font-inter font-semibold text-white">
          {percentage}%
        </span>
      </div>
    );
  })}
</div>

)

export default function RaffleTypeChart() {
    const totalVolume = chartData.reduce((sum, item) => sum + item.value, 0)

    const percentageData = chartData.map(item => ({
  ...item,
  percent: ((item.value / totalVolume) * 100).toFixed(1), 
}))


  return (
    <div className=" relative border border-gray-1100 font-inter font-medium text-white overflow-hidden rounded-[20px] w-full">
      
      <div className="flex bg-black-1300 border-b border-gray-1100 py-5 px-5 items-center justify-between">
        <div className="w-full">
          <h2 className="text-xl font-inter text-white font-semibold">Raffle type (Vol)</h2>
       
        </div>
      </div>

      <div className="w-full flex md:flex-row flex-col gap-5 p-5">
        <div className="md:w-[60%] w-full bg-black-1300 rounded-xl p-8 flex flex-col justify-between gap-5">
    
        <ChartLegend totalVolume={totalVolume} />
          <div className="bg-orange-1000 rounded px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-inter text-black-1300">Total volume (1d): </p>
          <p className="text-sm font-inter font-semibold text-black-1300 ">${totalVolume}</p>
          </div>
        </div>
        <div className="md:w-[40%] w-full bg-black-1300 rounded-xl">
        <div className=" w-[220px] h-[300px] mx-auto flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={percentageData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              stroke="none" 
              innerRadius={70} 
              outerRadius={100}
              paddingAngle={10} 
              fill="#FFD400"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      </div>
      </div>
    </div>
  )
}
