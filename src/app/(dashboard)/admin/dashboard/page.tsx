import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Users, Shield, Zap, Activity, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const systemStatus = [
    { label: "Active Users", value: "1,284", icon: Users, color: "text-blue-400", change: "+12%" },
    { label: "DB Health", value: "99.9%", icon: Database, color: "text-emerald-400", change: "Stable" },
    { label: "Server Load", value: "24%", icon: Activity, color: "text-amber-400", change: "Low" },
    { label: "Global Traffic", value: "48k", icon: Globe, color: "text-purple-400", change: "+5k" },
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
                <span className={stat.change.includes("+") ? "text-emerald-500" : "text-blue-500"}>{stat.change}</span> vs last hour
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
                 {[1, 2, 3].map((node) => (
                   <div key={node} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <div>
                            <p className="text-white font-medium text-sm">Database Node-0{node}</p>
                            <p className="text-xs text-gray-500">vtop-primary-region-ap-south</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-white font-mono">12ms latency</p>
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
                 <Zap className="w-4 h-4 text-amber-400" /> Recent Actions
              </CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              {[
                { action: "Database Seeded", who: "Arsh Verma", time: "2 mins ago" },
                { action: "Backup Created", who: "System", time: "1 hour ago" },
                { action: "User Modified", who: "Admin", time: "3 hours ago" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-1 h-8 bg-blue-500/20 rounded-full" />
                   <div>
                      <p className="text-sm font-medium text-white">{log.action}</p>
                      <p className="text-xs text-gray-500">{log.who} • {log.time}</p>
                   </div>
                </div>
              ))}
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
