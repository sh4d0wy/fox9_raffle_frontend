/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const chartData = {
  daily: [
    { time: "00:00", volume: 95 },
    { time: "04:00", volume: 50 },
    { time: "08:00", volume: 140 },
    { time: "12:00", volume: 135 },
    { time: "16:00", volume: 80 },
    { time: "20:00", volume: 32 },
  ],
  week: [
    { time: "Mon", volume: 400 },
    { time: "Tue", volume: 300 },
    { time: "Wed", volume: 500 },
    { time: "Thu", volume: 200 },
    { time: "Fri", volume: 350 },
    { time: "Sat", volume: 420 },
    { time: "Sun", volume: 380 },
  ],
  monthly: [
    { time: "Jan", volume: 1200 },
    { time: "Feb", volume: 1800 },
    { time: "Mar", volume: 1500 },
    { time: "Apr", volume: 2000 },
    { time: "May", volume: 1700 },
    { time: "Jun", volume: 2100 },
  ],
  yearly: [
    { time: "2020", volume: 12000 },
    { time: "2021", volume: 18000 },
    { time: "2022", volume: 15000 },
    { time: "2023", volume: 20000 },
    { time: "2024", volume: 17000 },
  ],
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-color shadow-lg rounded-md p-2">
        <p className="text-sm font-inter text-black-1000 font-semibold">{label}</p>
        <p className="text-black-1000 text-sm font-inter font-semibold">${payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function USDVolumeChart() {
  const [filter, setFilter] = useState<"daily" | "week" | "monthly" | "yearly">("daily")

  const formatYAxis = (value: number) => {
  if (value === 0) return ""; 
  if (value >= 1_000_000) return `${value / 1_000_000}M`;
  if (value >= 1_000) return `${value / 1_000}k`;
  return `${value}`;
};

  return (
    <div className=" border border-gray-1100 font-inter font-medium text-white overflow-hidden rounded-[20px] w-full">
      <div className="flex lg:flex-nowrap flex-wrap lg:gap-0 gap-5 bg-black-1300 border-b border-gray-1100 py-6 px-5 items-center justify-between">
        <h2 className="text-xl font-inter text-white font-semibold">USD volume</h2>
        <div className="flex lg:flex-nowrap bg-white/15 border border-gray-1000 rounded-full p-1 flex-wrap gap-2">
          {["daily", "week", "monthly", "yearly"].map((f) => (
            <button
              key={f}
              className={`sm:px-5 px-3 sm:py-2.5 py-1.5 rounded-full sm:text-sm text-xs font-medium ${
                filter === f ? "bg-primary-color text-black-1000" : " text-white"
              }`}
              onClick={() => setFilter(f as any)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[340px] pt-10 pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData[filter]}
            margin={{ left: 8, right: 14, top: 20, bottom: 0 }} 
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD400" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#FFD400" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#212121" vertical={false} strokeDasharray="10 10" />
           <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                interval={0} 
                tick={{ fill: "#fff", fontSize: 14, fontWeight: 500, dx: -10 }}
                />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={formatYAxis}
              tick={{ fill: "#fff", fontSize: 14, fontWeight: 500 }}
            />
          

            <Tooltip content={<CustomTooltip />}
            cursor={{ stroke: "#fff", strokeWidth: 1, strokeDasharray: "5 5" }}
            />

            <Area
              type="monotone"
              dataKey="volume"
              stroke="#FFD400"
              fill="url(#areaGradient)"
              strokeWidth={2}
              dot={{
                    r: 2,
                    fill: "#FFD400",  
                    stroke: "#FFD400", 
                    strokeWidth: 4,
                    }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
