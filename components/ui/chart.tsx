"use client"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Define common props for charts
interface CommonChartProps {
  data: Record<string, any>[]
  config: ChartConfig
  className?: string
}

interface BarChartProps extends CommonChartProps {
  barKeys: string[]
}

interface LineChartProps extends CommonChartProps {
  lineKeys: string[]
}

interface PieChartProps extends CommonChartProps {
  nameKey: string
  dataKey: string
}

const ChartBar = ({ data, config, barKeys, className }: BarChartProps) => (
  <ChartContainer config={config} className={className}>
    <BarChart accessibilityLayer data={data}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <YAxis tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Legend />
      {barKeys.map((key) => (
        <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
      ))}
    </BarChart>
  </ChartContainer>
)

const ChartLine = ({ data, config, lineKeys, className }: LineChartProps) => (
  <ChartContainer config={config} className={className}>
    <LineChart
      accessibilityLayer
      data={data}
      margin={{
        left: -14,
        right: 14,
      }}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <YAxis tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Legend />
      {lineKeys.map((key) => (
        <Line key={key} dataKey={key} type="monotone" stroke={`var(--color-${key})`} strokeWidth={2} dot={false} />
      ))}
    </LineChart>
  </ChartContainer>
)

const ChartPie = ({ data, config, nameKey, dataKey, className }: PieChartProps) => (
  <ChartContainer config={config} className={className}>
    <PieChart>
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        innerRadius={60}
        strokeWidth={5}
        fill="var(--color-desktop)"
      />
    </PieChart>
  </ChartContainer>
)

export { ChartBar, ChartLine, ChartPie }
