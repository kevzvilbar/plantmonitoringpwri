import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, CheckCircle2, Server } from 'lucide-react'

const stats = [
  {
    title: 'Active Sensors',
    value: '24',
    description: 'All sensors operational',
    icon: Server,
    iconColor: 'text-green-500',
  },
  {
    title: 'Active Alerts',
    value: '3',
    description: '2 warnings, 1 critical',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  {
    title: 'Compliance Rate',
    value: '98.5%',
    description: 'Last 30 days',
    icon: CheckCircle2,
    iconColor: 'text-primary',
  },
  {
    title: 'System Uptime',
    value: '99.9%',
    description: 'Last 90 days',
    icon: Activity,
    iconColor: 'text-blue-500',
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
