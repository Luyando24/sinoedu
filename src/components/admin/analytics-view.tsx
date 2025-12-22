"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"
import { Users, Eye, MousePointerClick, Smartphone, Monitor } from "lucide-react"

type AnalyticsEvent = {
  id: string
  session_id: string
  path: string
  referrer: string | null
  device_type: string | null
  created_at: string
}

export function AnalyticsView({ initialEvents }: { initialEvents: AnalyticsEvent[] }) {
  const stats = useMemo(() => {
    const totalViews = initialEvents.length
    const uniqueVisitors = new Set(initialEvents.map(e => e.session_id)).size
    const avgViewsPerVisitor = uniqueVisitors ? (totalViews / uniqueVisitors).toFixed(1) : "0"

    // Group by date
    const dailyStats = initialEvents.reduce((acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!acc[date]) {
        acc[date] = { date, views: 0, visitors: new Set() }
      }
      acc[date].views++
      acc[date].visitors.add(event.session_id)
      return acc
    }, {} as Record<string, { date: string, views: number, visitors: Set<string> }>)

    const chartData = Object.values(dailyStats).map(d => ({
      date: d.date,
      views: d.views,
      visitors: d.visitors.size
    }))

    // Group by page
    const pageStats = initialEvents.reduce((acc, event) => {
      const path = event.path
      acc[path] = (acc[path] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPages = Object.entries(pageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }))

    // Group by referrer
    const referrerStats = initialEvents.reduce((acc, event) => {
      let ref = event.referrer
      if (!ref) ref = "Direct / Unknown"
      else {
        try {
            const url = new URL(ref)
            ref = url.hostname
        } catch {
            // keep original if not valid URL
        }
      }
      
      acc[ref] = (acc[ref] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topReferrers = Object.entries(referrerStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }))
    
    // Device stats
    const deviceStats = initialEvents.reduce((acc, event) => {
        const type = event.device_type || "desktop"
        acc[type] = (acc[type] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return {
      totalViews,
      uniqueVisitors,
      avgViewsPerVisitor,
      chartData,
      topPages,
      topReferrers,
      deviceStats
    }
  }, [initialEvents])

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Distinct sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views/Session</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgViewsPerVisitor}</div>
            <p className="text-xs text-muted-foreground">
              Engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                />
                <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#0056b3" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    name="Page Views"
                />
                <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    name="Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPages.map((page, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <span className="text-sm font-medium truncate" title={page.path}>
                      {page.path}
                    </span>
                  </div>
                  <div className="font-bold text-sm">{page.count}</div>
                </div>
              ))}
              {stats.topPages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topReferrers.map((ref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate max-w-[80%]" title={ref.referrer}>
                    {ref.referrer}
                  </span>
                  <div className="font-bold text-sm">{ref.count}</div>
                </div>
              ))}
              {stats.topReferrers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-around py-4">
                    <div className="flex flex-col items-center gap-2">
                        <Monitor className="h-8 w-8 text-slate-500" />
                        <span className="font-bold text-xl">{stats.deviceStats.desktop || 0}</span>
                        <span className="text-sm text-muted-foreground">Desktop</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Smartphone className="h-8 w-8 text-slate-500" />
                        <span className="font-bold text-xl">{stats.deviceStats.mobile || 0}</span>
                        <span className="text-sm text-muted-foreground">Mobile</span>
                    </div>
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
