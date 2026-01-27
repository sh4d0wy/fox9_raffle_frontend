import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const chartData = [
  { value: 0, volume: 95 },
  { value: 4, volume: 50 },
  { value: 8, volume: 140 },
  { value: 12, volume: 135 },
  { value: 16, volume: 80 },
  { value: 20, volume: 32 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-md p-2">
        <p className="text-sm font-inter font-semibold">{label}</p>
        <p className="text-black-1000 text-sm font-inter font-semibold">${payload[0].value}</p>
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

export default function DailyRafflesChart() {
  return (
    <div className=" border border-gray-1100 font-inter font-medium text-black-1000 overflow-hidden rounded-[20px] h-full w-full">
      <div className="flex bg-black-1300 border-b border-gray-1100 py-7 h-[89px] px-5 items-center justify-between">
        <h2 className="text-xl font-inter text-white font-semibold">Daily raffles</h2>
      </div>

      <div className="w-full h-[340px] pt-10 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ left: 0, right: 14, top: 20, bottom: 0 }} 
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD400" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#FFD400" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#212121" vertical={false} strokeDasharray="10 10" />

            <XAxis
              dataKey="value"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              interval={0} 
              tick={{ fill: "#fff", fontSize: 14, fontWeight: 500, dx: -4 }}
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
              cursor={{ stroke: "#FFD400", strokeWidth: 1, strokeDasharray: "5 5" }}
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
