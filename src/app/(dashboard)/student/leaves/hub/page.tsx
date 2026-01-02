import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, ShieldCheck, AlertCircle, FileText, CheckCircle2, ChevronRight, Plus, History, XCircle, Plane, Car, UserCheck } from "lucide-react"
import { getLeaveStatus } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LeaveHubPage() {
  const leaves = await getLeaveStatus()
  const activeLeaves = leaves?.filter(l => l.status === 'PENDING' || l.status === 'APPROVED') || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Plane className="w-8 h-8 text-blue-500" /> Leave & Digital Permissions
          </h1>
          <p className="text-gray-400 mt-1">Managed Outings, Weekend Permissions & On-Duty Requests</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> New Request
             </Button>
             <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-4 py-1">SECURE APPROVAL</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 p-6 space-y-2 group hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm uppercase tracking-tight">Weekend Outing</h4>
              <p className="text-[10px] text-gray-500 leading-snug">Standard weekend leave from Friday 6PM to Sunday 8PM.</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 space-y-2 group hover:border-amber-500/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm uppercase tracking-tight">General Outing</h4>
              <p className="text-[10px] text-gray-500 leading-snug">Day outing for personal work or local visits during weekdays.</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 space-y-2 group hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                  <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm uppercase tracking-tight">On-Duty (OD)</h4>
              <p className="text-[10px] text-gray-500 leading-snug">For technical fests, hackathons, or university representations.</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 space-y-2 group hover:border-rose-500/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-2">
                  <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm uppercase tracking-tight">Late Hour</h4>
              <p className="text-[10px] text-gray-500 leading-snug">Permission for academic work in labs/library beyond 9PM.</p>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-lg">Active Leave Status</CardTitle>
                        <CardDescription className="text-xs">Tracking pending and upcoming approved movements</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {leaves && leaves.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {leaves.map((leave) => (
                                <div key={leave.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            leave.type === 'OD' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' :
                                            leave.type === 'LEAVE' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' :
                                            'bg-amber-600/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {leave.type === 'OD' ? <UserCheck className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-bold text-sm tracking-tight">{leave.type} Request</h4>
                                                {leave.category && <Badge variant="outline" className="text-[8px] border-white/10 text-gray-500 uppercase">{leave.category}</Badge>}
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium">
                                                {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[9px] text-gray-500 uppercase font-black">Reason</p>
                                            <p className="text-xs text-white max-w-[150px] truncate">{leave.reason}</p>
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <Badge className={`text-[8px] font-black px-4 uppercase ${
                                                leave.status === 'PENDING' ? 'bg-amber-600/20 text-amber-400' :
                                                leave.status === 'APPROVED' ? 'bg-emerald-600/20 text-emerald-400' :
                                                'bg-rose-600/20 text-rose-400'
                                            }`}>
                                                {leave.status}
                                            </Badge>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <History className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold uppercase text-[10px]">No active leave history</p>
                        </div>
                    )}
                </CardContent>
                <CardHeader className="bg-black/20 border-t border-white/5 py-4">
                    <Button variant="ghost" className="w-full text-xs text-gray-500 hover:text-white uppercase font-black tracking-widest">
                        View Complete Leave History <ChevronRight className="w-3.5 h-3.5 ml-2" />
                    </Button>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 group hover:border-blue-500/30 transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-md flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" /> Permission Letters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500 mb-4">View and download official permission letters for external events and internships.</p>
                        <Button variant="ghost" className="p-0 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-transparent">
                            Open Repository <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-md flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Proctor Verified
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500 mb-4">Your leave requests are directly processed by your proctor for faster turnaround.</p>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">Average Approval Time: 4h</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="space-y-6">
             <Card className="bg-rose-600/5 border-rose-500/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertCircle className="w-24 h-24 text-rose-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white text-md">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Verification Authority</p>
                            <p className="text-white font-bold text-sm">Mr. Verma (Mobile Verified)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Relation</p>
                            <p className="text-white font-bold text-sm">FATHER</p>
                        </div>
                     </div>
                     <p className="text-[10px] text-gray-500 italic">Leaves/Outings require mobile OTP verification from your primary emergency contact.</p>
                     <Button variant="outline" className="w-full border-rose-500/20 text-rose-400 hover:bg-rose-600/10 uppercase text-[10px] font-black h-11 tracking-wider">
                        Update Contact Info
                     </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-md">General Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-gray-400 leading-tight">Outing requests must be submitted at least <span className="text-blue-400 font-bold">24 hours</span> in advance for proctor review.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-gray-400 leading-tight">Late hour returns without prior permission will result in biometric blocking and proctor notice.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/10 space-y-4">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <h4 className="text-white font-bold text-sm uppercase">Secure Vault</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">All digital permissions are cryptographically signed by the University Registrar and are verifiable via the VTOP Mobile App QR scanner.</p>
            </div>
        </div>
      </div>
    </div>
  )
}
