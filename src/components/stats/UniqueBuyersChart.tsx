/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
  } from "recharts"
  
  interface UniqueBuyersDataItem {
    date: string
    value: number
  }
  
  interface UniqueBuyersChartProps {
    data: UniqueBuyersDataItem[]
    totalUniqueBuyers: number
    timeframe: string
    isLoading?: boolean
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black-1300 shadow-lg rounded-md p-2">
          <p className="text-sm font-inter font-semibold">{label}</p>
          <p className="text-white text-sm font-inter font-semibold">
            Unique Buyers: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }
  
  const formatYAxis = (value: number) => {
    if (value === 0) return ""
    if (value >= 1_000_000) return `${value / 1_000_000}M`
    if (value >= 1_000) return `${value / 1_000}k`
    return `${value}`
  }
  
  export default function UniqueBuyersChart({ data, totalUniqueBuyers, timeframe, isLoading }: UniqueBuyersChartProps) {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      if (timeframe === "day") {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  
    const chartData = data.map((item) => ({
      time: formatDate(item.date),
      value: item.value,
    }))
  
    return (
      <div className="border border-gray-1100 font-inter font-medium text-white overflow-hidden rounded-[20px] w-full">
      <div className="flex lg:flex-nowrap flex-wrap lg:gap-0 gap-5 bg-black-1300 border-b border-gray-1100 py-5 px-5 items-center justify-between">
            <h2 className="text-xl font-inter text-white font-semibold">Unique Buyers</h2>
        </div>
        <div className="w-full h-[340px] pt-6 pb-6">
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
              <AreaChart
                data={chartData}
                margin={{ left: 8, right: 14, top: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="uniqueBuyersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
  
                <CartesianGrid stroke="#E9E9E9" vertical={false} strokeDasharray="10 10" />
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
  
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "5 5" }}
                />
  
                <Area
                  type="linear"
                  dataKey="value"
                  stroke="#10b981"
                  fill="url(#uniqueBuyersGradient)"
                  strokeWidth={2}
                  dot={{
                    r: 2,
                    fill: "#10b981",
                    stroke: "#10b981",
                    strokeWidth: 4,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    )
  }
  
  