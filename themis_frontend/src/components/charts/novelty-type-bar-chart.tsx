"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

/**
 * Represents a single novelty item.
 */
export type Novelty = {
  id: string | number
  noveltyType?: {
    id: string | number
    nameNovelty: string
  } | null

}

/**
 * Props for the NoveltyTypeBarChart component.
 */
export interface NoveltyTypeBarChartProps {
  novelties: Novelty[]
}

/**
 * Aggregates novelties by their type, returning an array suitable for recharts.
 * If a novelty has no type, it is grouped under "Sin tipo".
 */
function aggregateByType(novelties: Novelty[]) {
  const counts: Record<string, number> = {}
  for (const novelty of novelties) {
    const type = novelty.noveltyType?.nameNovelty || "Sin tipo"
    counts[type] = (counts[type] || 0) + 1
  }
  return Object.entries(counts).map(([type, count]) => ({ type, count }))
}

/**
 * Bar chart showing the distribution of novelties by type.
 */
export function NoveltyTypeBarChart({ novelties }: NoveltyTypeBarChartProps) {
  const chartData = aggregateByType(novelties)

  return (
    <ChartContainer
      config={{
        count: {
          label: "Cantidad",
          color: "hsl(var(--primary))",
        },
      }}
      className="min-h-[200px] w-full"
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="type"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 12)}
        />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}