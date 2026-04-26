import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@/lib/utils'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  sensor_id?: string
  acknowledged: boolean
  created_at: string
}

interface AlertsFeedProps {
  limit?: number
}

// Mock data for demo
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'pH level approaching upper threshold',
    sensor_id: 'pH-001',
    acknowledged: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'info',
    message: 'Scheduled maintenance completed successfully',
    acknowledged: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'critical',
    message: 'Turbidity sensor offline - Station B',
    sensor_id: 'TURB-003',
    acknowledged: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    type: 'warning',
    message: 'Temperature fluctuation detected',
    sensor_id: 'TEMP-002',
    acknowledged: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    type: 'info',
    message: 'Daily compliance report generated',
    acknowledged: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export function AlertsFeed({ limit }: AlertsFeedProps) {
  const { data: alerts = mockAlerts, isLoading } = useQuery({
    queryKey: ['alerts', limit],
    queryFn: async () => {
      // In production, this would call the API
      // const response = await alertApi.getAlerts(limit ? { limit: limit.toString() } : undefined)
      return mockAlerts.slice(0, limit)
    },
    refetchInterval: 60000, // Refresh every 60 seconds
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="mb-2 h-10 w-10 text-green-500" />
        <p className="text-muted-foreground">No alerts at this time</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  )
}

function AlertItem({ alert }: { alert: Alert }) {
  const icons = {
    warning: AlertTriangle,
    critical: AlertCircle,
    info: Info,
  }

  const colors = {
    warning: 'text-yellow-500 bg-yellow-500/10',
    critical: 'text-red-500 bg-red-500/10',
    info: 'text-blue-500 bg-blue-500/10',
  }

  const Icon = icons[alert.type]

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 transition-colors",
        alert.acknowledged ? "opacity-60" : ""
      )}
    >
      <div className={cn("rounded-full p-1.5", colors[alert.type])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-tight">{alert.message}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(alert.created_at)}</span>
          {alert.sensor_id && (
            <>
              <span>•</span>
              <span>{alert.sensor_id}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
