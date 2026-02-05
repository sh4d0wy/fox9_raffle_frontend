import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface AverageTicketsDataItem {
  date: string
  averageTicketsSold: number
  percentageSold: number
}

interface AverageTicketsChartProps {
  data: AverageTicketsDataItem[]
  timeframe: string
  isLoading?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black-1300 shadow-lg rounded-md p-2">
        <p className="text-sm font-inter text-white">{label}</p>
        <p className="text-white text-sm font-inter ">
          Tickets Sold: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

const formatYAxis = (value: number) => {
  if (value === 0) return ""; 
  if (value >= 1_000_000) return `${value / 1_000_000}M`;
  if (value >= 1_000) return `${value / 1_000}k`;
  return `${value}`;
};

export default function AverageTicketsChart({ data, timeframe, isLoading }: AverageTicketsChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (timeframe === "day") {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    averageTicketsSold: item.averageTicketsSold,
    percentageSold: item.percentageSold,
  }))

  const avgTickets = data.length > 0
    ? (data.reduce((sum, item) => sum + item.averageTicketsSold, 0) / data.length).toFixed(1)
    : 0
  const avgPercentage = data.length > 0
    ? (data.reduce((sum, item) => sum + item.percentageSold, 0) / data.length).toFixed(1)
    : 0
  return (
    <div className="border border-gray-1100 font-inter font-medium text-white overflow-hidden rounded-[20px] w-full">
      <div className="flex bg-black-1300 border-b border-gray-1100 py-6 px-5 items-center justify-between">
        <h2 className="text-xl font-inter text-white font-semibold">Average tickets sold</h2>
        <p className="text-sm text-white font-semibold">
            Avg: {avgTickets} tickets • {avgPercentage}% fill rate
          </p>
      </div>

      <div className="w-full h-[340px] pt-6">
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
          <BarChart
            data={chartData}
            margin={{ left: 8, right: 14, top: 20, bottom: 20 }}
          >
            <CartesianGrid stroke="#212121" vertical={false} strokeDasharray="10 10" />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 14, fontWeight: 500 }}
              tickMargin={12}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={formatYAxis}
              tick={{ fill: "#fff", fontSize: 14, fontWeight: 500 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(240, 132, 9, 0.1)" }} />

            <Bar dataKey="averageTicketsSold" fill="#FFD400" radius={[0, 0, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
