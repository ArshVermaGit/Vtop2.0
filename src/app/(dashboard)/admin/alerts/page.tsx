import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, ShieldAlert, Info, CheckCircle2 } from "lucide-react"

export default function AdminAlertsPage() {
  const alerts = [
      { id: 1, title: "High API Latency detected", type: "WARNING", source: "Gateway-01", time: "10 mins ago", status: "ACTIVE" },
      { id: 2, title: "Failed Login Attempts Spike", type: "CRITICAL", source: "Auth Service", time: "1 hour ago", status: "RESOLVED" },
      { id: 3, title: "Backup Completed Successfully", type: "INFO", source: "Database", time: "2 hours ago", status: "ARCHIVED" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <Bell className="w-8 h-8 text-amber-400" /> System Alerts
            </h1>
            <p className="text-gray-400 mt-1">Live notification stream and incident management</p>
         </div>
      </div>

      <Card className="bg-white/5 border-white/10">
         <CardHeader>
            <CardTitle className="text-white">Active Incidents</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
             {alerts.map((alert) => (
                 <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 transition-colors group">
                     <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                             alert.type === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : 
                             alert.type === 'WARNING' ? 'bg-amber-500/10 text-amber-500' : 
                             'bg-blue-500/10 text-blue-500'
                         }`}>
                             {alert.type === 'CRITICAL' ? <ShieldAlert className="w-5 h-5" /> : 
                              alert.type === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> : 
                              <Info className="w-5 h-5" />}
                         </div>
                         <div>
                             <h4 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{alert.title}</h4>
                             <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                 <span>{alert.source}</span>
                                 <span>•</span>
                                 <span>{alert.time}</span>
                             </div>
                         </div>
                     </div>
                     <Badge variant="outline" className={`
                         ${alert.status === 'ACTIVE' ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' : 
                           alert.status === 'RESOLVED' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 
                           'border-gray-500/20 text-gray-400'}
                     `}>
                         {alert.status}
                     </Badge>
                 </div>
             ))}
         </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center space-y-2 hover:bg-white/[0.07] transition-colors cursor-pointer">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-white font-bold">Acknowledge All</p>
              <p className="text-xs text-gray-500">Mark all non-critical alerts as read</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center space-y-2 hover:bg-white/[0.07] transition-colors cursor-pointer">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
              <p className="text-white font-bold">Trigger Emergency</p>
              <p className="text-xs text-gray-500">Initiate lockdown protocols</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center space-y-2 hover:bg-white/[0.07] transition-colors cursor-pointer">
              <Bell className="w-8 h-8 text-blue-500" />
              <p className="text-white font-bold">Configure Channels</p>
              <p className="text-xs text-gray-500">Manage notification webhooks</p>
          </Card>
      </div>
    </div>
  )
}
