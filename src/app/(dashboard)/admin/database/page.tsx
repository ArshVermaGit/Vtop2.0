import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, HardDrive, RefreshCw, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatabaseControlClient } from "@/components/admin/DatabaseControlClient"
import { getSystemAudit } from "@/lib/admin-actions"

export default async function AdminDatabasePage() {
  const counts = await getSystemAudit()

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
               <Database className="w-8 h-8 text-emerald-400" /> Engine Forge
            </h1>
            <p className="text-gray-400 mt-1">Direct orchestration of PostgreSQL clusters and data integrity engines</p>
         </div>
         <Button variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Revalidate Nodes
         </Button>
      </div>

      <DatabaseControlClient counts={counts as any} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatsCard label="Active Connections" value="342" icon={Database} color="emerald" />
         <StatsCard label="Query Latency" value="12ms" icon={Activity} color="blue" />
         <StatsCard label="Storage Used" value="45.2 GB" icon={HardDrive} color="purple" />
      </div>

      <Card className="bg-white/5 border-white/10 shadow-2xl shadow-emerald-500/5">
         <CardHeader>
            <CardTitle className="text-white">Node Status</CardTitle>
            <CardDescription className="text-gray-400">Cluster synchronicity and replication lag</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
             {[
                 { name: "Primary (Master)", role: "Read/Write", status: "ONLINE", lag: "0ms" },
                 { name: "Replica-AP-1", role: "Read-Only", status: "ONLINE", lag: "12ms" },
                 { name: "Replica-AP-2", role: "Read-Only", status: "ONLINE", lag: "14ms" },
                 { name: "Backup-Cold", role: "Snapshot", status: "STANDBY", lag: "1h 20m" },
             ].map((node, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-emerald-500/20 transition-all">
                     <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${node.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                         <div>
                             <p className="text-white font-medium">{node.name}</p>
                             <p className="text-xs text-gray-500">{node.role}</p>
                         </div>
                     </div>
                     <div className="text-right">
                         <Badge variant="outline" className="border-white/10 text-gray-400">{node.status}</Badge>
                         <p className="text-[10px] text-gray-600 mt-1 uppercase font-bold tracking-widest">Lag: {node.lag}</p>
                     </div>
                 </div>
             ))}
         </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
    const colorMap: Record<string, string> = {
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    }
    return (
        <Card className="bg-white/5 border-white/10 border-l-4 border-l-transparent hover:border-l-current transition-all group">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{label}</p>
                    <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
