import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, RefreshCcw, Search, ChevronRight, LayoutGrid, Clock, AlertCircle, CheckCircle2, Milestone, ArrowRightLeft, ShieldCheck, Zap, Plus, ExternalLink } from "lucide-react"
import { getRegistrationWindows, getProgrammeMigrations } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default async function RegistrationPortalPage() {
  const windows = await getRegistrationWindows()
  const migrations = await getProgrammeMigrations()

  const activeWindow = windows.find(w => w.status === 'ACTIVE')
  const upcomingWindow = windows.find(w => w.status === 'UPCOMING')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Milestone className="w-8 h-8 text-emerald-500" /> Academic Registration
          </h1>
          <p className="text-gray-400 mt-1">Semester Enrollment, Program Migration & Course Add/Drop</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg" disabled={!activeWindow}>
                <Zap className="w-4 h-4 mr-2" /> Start Registration
             </Button>
             <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-1 uppercase font-black text-[9px]">Enrolling Now</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ACTIVE WINDOW */}
                <Card className={`bg-gradient-to-br border-none relative overflow-hidden group ${
                    activeWindow ? 'from-emerald-600 to-teal-800' : 'from-gray-800 to-gray-900 opacity-60'
                }`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Calendar className="w-24 h-24 text-white" />
                    </div>
                    <CardHeader>
                         <div className="space-y-1">
                             <p className="text-[10px] text-white/60 uppercase font-black tracking-widest italic">Live Registration Cycle</p>
                             <CardTitle className="text-white text-xl font-black">{activeWindow?.name || 'No Active Registration'}</CardTitle>
                         </div>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10 py-4">
                         {activeWindow ? (
                             <>
                                <div className="flex items-center gap-6">
                                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                         <p className="text-[10px] text-white/50 uppercase font-bold">Ends In</p>
                                         <p className="text-white font-black text-sm uppercase">2 Days : 14 Hours</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white font-black uppercase text-[10px] tracking-widest h-12 hover:bg-white hover:text-emerald-900 transition-all">
                                    Access Registration Window <ArrowRightLeft className="w-4 h-4 ml-2" />
                                </Button>
                             </>
                         ) : (
                             <div className="p-12 text-center">
                                 <AlertCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                 <p className="text-white/40 font-bold uppercase text-[10px]">Portal currently inactive</p>
                             </div>
                         )}
                    </CardContent>
                </Card>

                {/* UPCOMING WINDOW */}
                <Card className="bg-white/5 border-white/10 group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
                    <CardHeader>
                        <div className="space-y-1">
                             <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest italic">Upcoming Cycle</p>
                             <CardTitle className="text-white text-md font-bold">{upcomingWindow?.name || 'Summer 2025 Regular'}</CardTitle>
                         </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                             <div className="space-y-1">
                                 <p className="text-[9px] text-gray-500 uppercase font-black">Expected Start</p>
                                 <p className="text-white font-bold text-xs uppercase">{upcomingWindow ? new Date(upcomingWindow.startDate).toLocaleDateString() : '15 May 2025'}</p>
                             </div>
                             <Badge variant="outline" className="bg-blue-600/10 text-blue-400 border-blue-500/20 text-[7px] uppercase font-black italic">Upcoming</Badge>
                         </div>
                         <p className="text-[10px] text-gray-500 font-medium">Clear all academic dues and verify attendance eligibility before registration opens.</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                    <div>
                        <CardTitle className="text-white text-lg">Programme Transitions</CardTitle>
                        <CardDescription className="text-xs">Migration, Course Change & Specialization requests</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {migrations && migrations.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {migrations.map((m) => (
                                <div key={m.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-bold text-sm tracking-tight">{m.type}</h4>
                                                <Badge className="bg-emerald-600/20 text-emerald-400 text-[8px] uppercase">{m.status}</Badge>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-bold italic">
                                                {m.currentProgram} <ArrowRightLeft className="w-2 h-2 inline mx-1" /> {m.targetProgram}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-[10px] text-gray-400 font-medium max-w-[200px] text-right italic line-clamp-1">"{m.reason}"</p>
                                        <p className="text-[9px] text-gray-600 uppercase font-black">Applied {new Date(m.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <RefreshCcw className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No pending migrations</p>
                        </div>
                    )}
                </CardContent>
                <CardHeader className="bg-black/20 border-t border-white/5">
                    <Button variant="ghost" className="w-full text-[10px] text-emerald-400 font-black uppercase tracking-widest hover:bg-transparent flex items-center justify-center gap-2">
                        Apply for Programme Change <Plus className="w-4 h-4" />
                    </Button>
                </CardHeader>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-emerald-600/5 border-emerald-500/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-24 h-24 text-emerald-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white text-md">Registration Slots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                     <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Assigned Slot</p>
                            <div className="flex items-end gap-2">
                                <p className="text-white font-black text-2xl tracking-tighter italic">SLOT-A4</p>
                                <Badge className="bg-emerald-600/20 text-emerald-400 text-[8px] uppercase mb-1">Priority</Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] text-gray-500 uppercase font-black">Start Time</p>
                                <p className="text-white font-bold text-xs">08:00 AM</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] text-gray-500 uppercase font-black">End Time</p>
                                <p className="text-white font-bold text-xs">11:00 AM</p>
                            </div>
                        </div>
                     </div>
                     <p className="text-[10px] text-gray-500 italic leading-snug">Slots are assigned based on merit (CGPA) and batch seniority. Please adhere to your window.</p>
                </CardContent>
            </Card>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h4 className="text-white font-bold text-sm uppercase">Prerequisites</h4>
                 </div>
                 <div className="space-y-3">
                     <div className="flex items-center gap-3 opacity-100">
                         <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         <p className="text-[11px] text-gray-400">Library Dues Cleared</p>
                     </div>
                     <div className="flex items-center gap-3 opacity-100">
                         <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         <p className="text-[11px] text-gray-400">Hostel Fees Settled</p>
                     </div>
                     <div className="flex items-center gap-3 opacity-40">
                         <div className="w-2 h-2 rounded-full bg-amber-500" />
                         <p className="text-[11px] text-gray-400">Attendance Verified (&gt;75%)</p>
                     </div>
                 </div>
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-md">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <p className="text-[10px] text-gray-500 uppercase font-black">Academic Office</p>
                        <p className="text-xs text-white">registrar@vit.edu</p>
                     </div>
                     <Button variant="ghost" className="w-full text-[9px] text-indigo-400 font-black uppercase tracking-widest p-0 flex items-center justify-center gap-2">
                        Download Registration Guide <ExternalLink className="w-3 h-3" />
                     </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
