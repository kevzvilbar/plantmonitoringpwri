import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertsFeed } from '@/components/alerts-feed'
import { Bell } from 'lucide-react'

export function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          View and manage system alerts and notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            All Alerts
          </CardTitle>
          <CardDescription>
            Complete list of system alerts sorted by most recent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertsFeed />
        </CardContent>
      </Card>
    </div>
  )
}
