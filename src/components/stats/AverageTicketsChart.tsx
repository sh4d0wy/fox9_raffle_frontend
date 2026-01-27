import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const chartData = [
  { date: "21 Oct", tickets: 95 },
  { date: "22 Oct", tickets: 50 },
  { date: "23 Oct", tickets: 140 },
  { date: "24 Oct", tickets: 135 },
  { date: "25 Oct", tickets: 80 },
  { date: "26 Oct", tickets: 32 },
];

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

export default function AverageTicketsChart() {
  return (
    <div className="border border-gray-1100 font-inter font-medium text-white overflow-hidden rounded-[20px] w-full">
      <div className="flex bg-black-1300 border-b border-gray-1100 py-6 px-5 items-center justify-between">
        <h2 className="text-xl font-inter text-white font-semibold">Average tickets sold</h2>
      </div>

      <div className="w-full h-[340px] pt-6">
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

            <Bar dataKey="tickets" fill="#FFD400" radius={[0, 0, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
