/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RaffleTypeData {
  nft: {
    percentage: number
    volume: number
  }
  token: {
    percentage: number
    volume: number
  }
}

interface RaffleTypeChartProps {
  data: RaffleTypeData
  totalVolume: number
  timeframe: string
  isLoading?: boolean
}

const COLORS = ["#FFEAB9", "#FFD400"]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="bg-black-1300 shadow-lg rounded-md p-2">
        <p className="text-sm font-inter">{item.name}</p>
        <p className="text-white text-sm font-inter">
          {item.percentage}%
        </p>
        <p className="text-gray-600 text-xs font-inter">
          Volume: {formatVolume(item.volume)}
        </p>
      </div>
    )
  }
  return null
}

const formatVolume = (volume: number) => {
  return `${parseFloat(volume.toFixed(5))} USDT`
}



export default function RaffleTypeChart({ data, totalVolume, timeframe, isLoading }: RaffleTypeChartProps) {

  const chartData = [
    { name: "NFT", value: data.nft.volume, percentage: data.nft.percentage, volume: data.nft.volume },
    { name: "Token", value: data.token.volume, percentage: data.token.percentage, volume: data.token.volume },
  ]
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
            {entry.percentage}%
          </span>
        </div>
      );
    })}
  </div>
  
  )
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
        <div className="w-full bg-orange-1000 rounded px-4 py-2 flex items-center justify-between">
            <p className="  text-sm font-inter text-black-1300 ">
              Total volume ({timeframe}):
            </p>
            <p className="text-sm font-inter font-semibold text-black-1300 ">
              {formatVolume(totalVolume)}
            </p>
          </div>
        </div>
        <div className="md:w-[40%] w-full bg-black-1300 rounded-xl">
        <div className=" w-[220px] h-[300px] mx-auto flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
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
        )}
      </div>
      </div>
      </div>
    </div>
  )
}
