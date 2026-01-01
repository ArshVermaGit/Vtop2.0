import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Navigation, Info, ShieldCheck, Map } from "lucide-react"
import { getSeatAllocations } from "@/lib/actions"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"

export default async function SeatAllocationPage() {
  const allocations = await getSeatAllocations()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <MapPin className="w-8 h-8 text-indigo-500" /> Seat Locator
          </h1>
          <p className="text-gray-400 mt-1">Real-time venue and bench allocation for upcoming assessments</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Search exam or room..." className="pl-10 bg-white/5 border-white/10 text-white" />
             </div>
             <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-1">LIVE MAPPING</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
            {allocations.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10 dashed">
                    No active seat allocations found. Allocations are usually released 48 hours before the exam.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {allocations.map((a: any) => (
                        <Card key={a.id} className="bg-white/5 border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 md:w-48 bg-black/40 border-r border-white/5 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Room No.</p>
                                    <p className="text-3xl font-black text-indigo-400">{a.roomNo}</p>
                                    <div className="mt-4 p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
                                        <Navigation className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex justify-between gap-6">
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 text-[9px] font-bold mb-1 uppercase tracking-widest">{a.examSchedule.type}</Badge>
                                        <h3 className="text-white font-bold text-lg leading-tight">{a.examSchedule.courseTitle}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{a.examSchedule.courseCode}</span>
                                            <span className="text-[10px] text-gray-600 font-bold uppercase">•</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{format(new Date(a.examSchedule.examDate), 'dd MMM yyyy')}</span>
                                            <span className="text-[10px] text-gray-600 font-bold uppercase">•</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{a.examSchedule.slot}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Seat Number</p>
                                        <p className="text-white font-black text-2xl tracking-tighter">{a.seatNo}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        <div className="space-y-6">
            <Card className="bg-indigo-600/5 border-indigo-500/10 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-white text-md flex items-center gap-2">
                        <Map className="w-4 h-4 text-indigo-400" /> Block Locator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-[11px] text-gray-400 leading-relaxed italic">
                        Most exams are held in the <span className="text-white font-bold">Silver Jubilee Tower (SJT)</span> and <span className="text-white font-bold">Annexe Buildings (AB)</span>. 
                        Refer to the campus map for quick navigation.
                    </p>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500 font-bold">SJT Tower</span>
                            <span className="text-indigo-400 font-black">Lobby Level</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500 font-bold">AB1 Block</span>
                            <span className="text-indigo-400 font-black">Floor 2-5</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500 font-bold">AB2 Block</span>
                            <span className="text-indigo-400 font-black">Floor 1-3</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-start gap-4 shadow-2xl">
                <Info className="w-6 h-6 text-indigo-400 shrink-0" />
                <div className="space-y-1">
                    <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Note</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Seats are allocated randomly per session. Ensure you are at the correct room at least 15 minutes before the exam begins.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
