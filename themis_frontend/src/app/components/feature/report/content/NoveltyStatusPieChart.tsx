import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

export interface StatusCount {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

export interface NoveltyStatusPieChartProps {
  statusCounts: StatusCount[]
}

const NoveltyStatusPieChart: React.FC<NoveltyStatusPieChartProps> = ({ statusCounts }) => (
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={statusCounts}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {statusCounts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span style={{ color: "#666", fontSize: "12px" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
)

export default NoveltyStatusPieChart;
