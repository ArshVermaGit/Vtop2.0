import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Users, Shield, Zap, GraduationCap, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAdminDashboardData } from "@/lib/admin-actions"

export default async function AdminDashboard() {
  const data = await getAdminDashboardData()
  const { stats, logs } = data

  const systemStatus = [
    { label: "Total Users", value: stats.users.toLocaleString(), icon: Users, color: "text-blue-400", change: "Synced" },
    { label: "Students", value: stats.students.toLocaleString(), icon: GraduationCap, color: "text-emerald-400", change: "Active" },
    { label: "Faculty", value: stats.faculty.toLocaleString(), icon: Briefcase, color: "text-amber-400", change: "On-Duty" },
    { label: "DB Health", value: "99.9%", icon: Database, color: "text-purple-400", change: "Stable" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Shield className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Oracle</h1>
            <p className="text-gray-400 mt-1 text-sm">Centralized System Orchestration Panel</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white">System Logs</Button>
            <Button className="bg-rose-600 hover:bg-rose-700">Maintenance Mode</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStatus.map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-default group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-widest">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-500">
                <span className="text-emerald-500">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 lg:col-span-2">
           <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                   <CardTitle className="text-white">Live Data Orchestration</CardTitle>
                   <CardDescription className="text-gray-400">Direct database node status and latency</CardDescription>
                </div>
                <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/20 px-3">ALL SYSTEMS NOMINAL</Badge>
              </div>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
              {[{ node: 1, latency: 12 }, { node: 2, latency: 18 }, { node: 3, latency: 15 }].map(({ node, latency }) => (
                   <div key={node} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <div>
                            <p className="text-white font-medium text-sm">Database Node-0{node}</p>
                            <p className="text-xs text-gray-500">vtop-primary-region-ap-south</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-white font-mono">{latency}ms latency</p>
                         <p className="text-[10px] text-emerald-500 font-bold uppercase">Sync Done</p>
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
           <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-400" /> Recent Security Audits
              </CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              {logs.length > 0 ? logs.map((log: { event: string; user?: { name: string }; userId: string; timestamp: string | number | Date }, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-1 h-8 bg-blue-500/20 rounded-full" />
                   <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">{log.event}</p>
                      <p className="text-xs text-gray-500 truncate">{log.user?.name || log.userId} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              )) : <div className="text-gray-500 text-xs italic">No recent logs found.</div>}
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
