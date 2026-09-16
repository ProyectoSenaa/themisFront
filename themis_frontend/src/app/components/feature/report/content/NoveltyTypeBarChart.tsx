import React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

const barColors = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", 
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
]

export interface NoveltyTypeBarChartProps {
  typeCounts: { noveltyTypeName: string; count: number }[]
}

const NoveltyTypeBarChart: React.FC<NoveltyTypeBarChartProps> = ({ typeCounts }) => (
  <div className="h-96">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={typeCounts.map((tc, index) => ({
          name: tc.noveltyTypeName,
          value: tc.count,
          fill: barColors[index % barColors.length]
        }))}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11, fill: "#666" }} 
          axisLine={false} 
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12, fill: "#666" }} axisLine={false} tickLine={false} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {typeCounts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export default NoveltyTypeBarChart;
