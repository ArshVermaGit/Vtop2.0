"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  Cpu, 
  Terminal, 
  FileText, 
  Download, 
  Zap, 
  RefreshCw, 
  Mail, 
  MessageSquare, 
  Calendar, 
  ShieldCheck,
  AlertCircle,
  Activity,
  ChevronRight,
  ArrowRight,
  Loader2,
  Lock,
  Search,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { syncInstitutionalData, exportAcademicReport, triggerNotification, downloadTimetableICS, getSecurityStatus } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function EngineControlCenter() {
  const [logs, setLogs] = useState<any[]>([])
  const [syncing, setSyncing] = useState<string | null>(null)
  const [exporting, setExporting] = useState<string | null>(null)
  const [notifying, setNotifying] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    async function loadLogs() {
        const status = await getSecurityStatus()
        if (status) setLogs(status.securityAudits || [])
    }
    loadLogs()
  }, [])

  const handleSync = async (target: 'ATTENDANCE' | 'MARKS' | 'PROFILE') => {
    setSyncing(target)
    try {
        const res = await syncInstitutionalData(target)
        toast({ title: "Synchronization Successful", description: `Legacy ${target} packets integrated into VTOP 2.0.` })
        // Refresh logs
        const status = await getSecurityStatus()
        setLogs(status?.securityAudits || [])
    } catch (e) {
        toast({ title: "Sync Failed", variant: "destructive" })
    } finally {
        setSyncing(null)
    }
  }

  const handleExport = async (type: 'GRADES' | 'ATTENDANCE') => {
    setExporting(type)
    try {
        const res = await exportAcademicReport(type)
        toast({ title: "Export Compiled", description: `Filename: ${res.filename} | Size: ${res.size} bytes` })
    } catch (e) {
        toast({ title: "Export Failed", variant: "destructive" })
    } finally {
        setExporting(null)
    }
  }

  const handleNotify = async (target: 'EMAIL' | 'SMS') => {
    if (!notificationMsg) return
    setNotifying(true)
    try {
        await triggerNotification(target, notificationMsg)
        toast({ title: "Message Dispatched", description: `${target} sent via Institutional Gateway.` })
        setNotificationMsg("")
    } catch (e) {
        toast({ title: "Notification Failed", variant: "destructive" })
    } finally {
        setNotifying(false)
    }
  }

  const handleICS = async () => {
    try {
        const ics = await downloadTimetableICS()
        if (ics) {
            toast({ title: "Calendar Generated", description: ".ics file ready for integration." })
        }
    } catch (e) {
        toast({ title: "ICS Failed", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <Badge className="bg-amber-600/10 text-amber-500 border border-amber-500/20 px-3 uppercase font-black text-[9px] mb-2 tracking-widest">Root / Engine Access</Badge>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
              Engine <span className="text-amber-500">Forge</span> Hub
           </h1>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-none mt-1">
             Backend Orchestration, Documentation Pipelines & Legacy Bridge
           </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] text-gray-700 uppercase font-black tracking-widest leading-none">Uptime Matrix</p>
                <p className="text-[11px] text-emerald-400 font-black italic uppercase">99.99% Seamless</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500/20 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT COLUMN: SYNC & DOCS */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl">
                <CardHeader className="bg-black/40 border-b border-white/5 py-6">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <CardTitle className="text-white text-lg uppercase font-black italic tracking-tight">Institutional Sync Engine</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SyncOption 
                        title="Attendance Packets" 
                        description="Real-time scraping of legacy attendance nodes."
                        loading={syncing === 'ATTENDANCE'}
                        onClick={() => handleSync('ATTENDANCE')}
                    />
                    <SyncOption 
                        title="Academics & Marks" 
                        description="Synchronize CAT/FAT assessment datasets."
                        loading={syncing === 'MARKS'}
                        onClick={() => handleSync('MARKS')}
                    />
                    <SyncOption 
                        title="Identity Profiles" 
                        description="Fetch guardian and proctor relationship maps."
                        loading={syncing === 'PROFILE'}
                        onClick={() => handleSync('PROFILE')}
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-white text-md uppercase font-black italic flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" /> Document Forging Engine
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <Button 
                            variant="outline" 
                            className="w-full h-14 justify-between bg-white/5 border-white/10 hover:bg-white hover:text-black transition-all group"
                            onClick={() => handleExport('GRADES')}
                            disabled={!!exporting}
                        >
                            <div className="flex items-center gap-4">
                                <Download className="w-5 h-5 text-gray-600 group-hover:text-black" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Compile Grade Ledger (CSV)</span>
                            </div>
                            {exporting === 'GRADES' && <Loader2 className="w-4 h-4 animate-spin" />}
                        </Button>

                        <Button 
                            variant="outline" 
                            className="w-full h-14 justify-between bg-white/5 border-white/10 hover:bg-white hover:text-black transition-all group"
                            onClick={() => handleExport('ATTENDANCE')}
                            disabled={!!exporting}
                        >
                            <div className="flex items-center gap-4">
                                <Download className="w-5 h-5 text-gray-600 group-hover:text-black" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Export Attendance Audit (CSV)</span>
                            </div>
                            {exporting === 'ATTENDANCE' && <Loader2 className="w-4 h-4 animate-spin" />}
                        </Button>
                        
                        <div className="pt-4 border-t border-white/5">
                             <Button variant="ghost" className="w-full h-10 text-[9px] text-gray-600 font-black uppercase hover:text-white" onClick={handleICS}>
                                <Calendar className="w-4 h-4 mr-2" /> Generate .ICS Timetable
                             </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-white text-md uppercase font-black italic flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-400" /> Communication Gateway
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <Input 
                            value={notificationMsg}
                            onChange={(e) => setNotificationMsg(e.target.value)}
                            placeholder="Enter institutional message..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 uppercase font-black text-[10px] h-12 rounded-xl"
                        />
                        <div className="flex gap-4">
                           <Button 
                                className="flex-1 h-12 bg-white text-black hover:bg-indigo-400 transition-all font-black uppercase text-[10px] tracking-widest rounded-xl"
                                onClick={() => handleNotify('EMAIL')}
                                disabled={notifying || !notificationMsg}
                           >
                               <Mail className="w-4 h-4 mr-2" /> Email
                           </Button>
                           <Button 
                                className="flex-1 h-12 bg-white text-black hover:bg-purple-400 transition-all font-black uppercase text-[10px] tracking-widest rounded-xl"
                                onClick={() => handleNotify('SMS')}
                                disabled={notifying || !notificationMsg}
                           >
                               <MessageSquare className="w-4 h-4 mr-2" /> SMS
                           </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
         </div>

         {/* RIGHT COLUMN: STATUS & LOGS */}
         <div className="space-y-8">
             <Card className="bg-[#0A0A0B] border-white/10 overflow-hidden shadow-2xl h-full flex flex-col">
                 <CardHeader className="bg-black/20 border-b border-white/5">
                     <CardTitle className="text-white text-xs uppercase font-black italic tracking-widest flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" /> VTOP Terminal Logs
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0 flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                     <div className="p-4 space-y-3 font-mono">
                         {logs.length > 0 ? logs.map((log: any, i: number) => (
                             <div key={i} className="text-[9px] border-l border-emerald-500/30 pl-3 py-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                 <span className="text-emerald-500/50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                 <span className="text-emerald-400 ml-2 font-bold uppercase tracking-tight">{log.event}</span>
                                 <p className="text-gray-600 mt-1 leading-none uppercase">IP: {log.ipAddress} | DEV: {log.device}</p>
                             </div>
                         )) : (
                             <div className="text-[10px] text-gray-700 uppercase font-black text-center py-10">No engine activity intercepted.</div>
                         )}
                     </div>
                 </CardContent>
             </Card>

             <div className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/10 space-y-4">
                 <ShieldCheck className="w-10 h-10 mx-auto text-indigo-500/20" />
                 <div className="text-center space-y-1">
                    <p className="text-white font-black text-xs uppercase italic tracking-tighter leading-none">Captcha Node Status</p>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Resolver Operational</p>
                 </div>
                 <div className="pt-4 border-t border-white/5 text-center">
                    <p className="text-[8px] text-gray-700 font-black uppercase">Solving Latency: 1400ms avg</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  )
}

function SyncOption({ title, description, loading, onClick }: any) {
    return (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group flex flex-col justify-between h-56 relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all ${loading ? 'animate-spin' : ''}`}>
                <Database className="w-20 h-20" />
            </div>
            <div className="space-y-2 relative z-10">
                <h4 className="text-white font-black text-xs uppercase italic tracking-tight">{title}</h4>
                <p className="text-[9px] text-gray-600 font-bold uppercase leading-relaxed tracking-tighter">{description}</p>
            </div>
            <Button 
                onClick={onClick} 
                className="w-full bg-white text-black hover:bg-amber-500 transition-all font-black uppercase text-[9px] tracking-widest h-10 rounded-xl relative z-10"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2 group-hover:rotate-180 transition-transform duration-500" />}
                {loading ? 'Orchestrating...' : 'Force Sync'}
            </Button>
        </div>
    )
}
