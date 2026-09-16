"use client"

import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { status: "Abierto", count: 60, fill: "hsl(var(--chart-1))" },
  { status: "En Progreso", count: 45, fill: "hsl(var(--chart-2))" },
  { status: "Cerrado", count: 90, fill: "hsl(var(--chart-3))" },
  { status: "Pendiente", count: 20, fill: "hsl(var(--chart-4))" },
]

export function NoveltyStatusPieChart() {
  return (
    <ChartContainer
      config={{
        count: {
            label: "Cantidad",
            color: ""
        },
        Abierto: {
          label: "Abierto",
          color: "hsl(var(--chart-1))",
        },
        "En Progreso": {
          label: "En Progreso",
          color: "hsl(var(--chart-2))",
        },
        Cerrado: {
          label: "Cerrado",
          color: "hsl(var(--chart-3))",
        },
        Pendiente: {
          label: "Pendiente",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="min-h-[200px] w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          outerRadius={80}
          strokeWidth={5}
          paddingAngle={5}
          fill="var(--color-status)"
        />
      </PieChart>
    </ChartContainer>
  )
}
