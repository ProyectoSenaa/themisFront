"use client"

import { PieChart, Pie, Tooltip, Cell } from "recharts"

// Datos de ejemplo para el gráfico circular de estados de novedad
const chartData = [
  { status: "Abierto", count: 60, fill: "hsl(var(--chart-1))" },
  { status: "En Progreso", count: 45, fill: "hsl(var(--chart-2))" },
  { status: "Cerrado", count: 90, fill: "hsl(var(--chart-3))" },
  { status: "Pendiente", count: 20, fill: "hsl(var(--chart-4))" },
]

export function NoveltyStatusPieChart() {
  return (
    <PieChart width={400} height={200}>
      <Tooltip />
      <Pie
        data={chartData}
        dataKey="count"
        nameKey="status"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
    </PieChart>
  )
}
