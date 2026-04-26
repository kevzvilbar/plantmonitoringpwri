import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertsFeed } from '@/components/alerts-feed'
import { SensorChart } from '@/components/sensor-chart'
import { StatsCards } from '@/components/stats-cards'
import { Activity, Droplets, Thermometer, Gauge } from 'lucide-react'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your water treatment plant in real-time
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Sensor Readings
            </CardTitle>
            <CardDescription>
              Real-time sensor data from all stations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SensorChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Latest system notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertsFeed limit={5} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              pH Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplets className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">7.2</div>
                <p className="text-xs text-muted-foreground">Optimal range: 6.5-8.5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">24.5 C</div>
                <p className="text-xs text-muted-foreground">Optimal range: 20-30 C</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turbidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">0.8 NTU</div>
                <p className="text-xs text-muted-foreground">Max allowed: 4 NTU</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
