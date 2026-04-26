import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Mock data for demo
const mockData = [
  { time: '00:00', pH: 7.1, temperature: 23.5, turbidity: 0.6 },
  { time: '04:00', pH: 7.2, temperature: 23.2, turbidity: 0.7 },
  { time: '08:00', pH: 7.3, temperature: 24.0, turbidity: 0.8 },
  { time: '12:00', pH: 7.2, temperature: 25.5, turbidity: 0.9 },
  { time: '16:00', pH: 7.1, temperature: 25.0, turbidity: 0.7 },
  { time: '20:00', pH: 7.2, temperature: 24.2, turbidity: 0.8 },
  { time: '24:00', pH: 7.2, temperature: 23.8, turbidity: 0.6 },
]

export function SensorChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mockData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="time"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="pH"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="pH Level"
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            name="Temperature (C)"
          />
          <Line
            type="monotone"
            dataKey="turbidity"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Turbidity (NTU)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
