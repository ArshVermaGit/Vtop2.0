import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, MapPin, Info, Star, ShieldAlert, PartyPopper } from "lucide-react"
import { getAcademicEvents, getSemesterMilestones } from "@/lib/actions"

export default async function AcademicCalendarPage() {
  const [events, milestones] = await Promise.all([
    getAcademicEvents(),
    getSemesterMilestones()
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <CalendarIcon className="w-8 h-8 text-blue-400" /> Time Management Hub
          </h1>
          <p className="text-gray-400 mt-1">Official University Calendar & Semester Timelines</p>
        </div>
        <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1">WINTER SEMESTER 2024-25</Badge>
      </div>

      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
          <TabsTrigger value="milestones" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white px-6">Semester Milestones</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6">Academic Events</TabsTrigger>
          <TabsTrigger value="holidays" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-6">Public Holidays</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
             {milestones.map((ms) => (
                 <Card key={ms.id} className="bg-white/5 border-white/10 hover:border-rose-500/30 transition-all group lg:ml-12 relative">
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-px h-12 bg-rose-500/20 hidden lg:block" />
                    <div className="absolute -left-[54px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)] hidden lg:block" />
                    
                    <CardContent className="flex items-center gap-6 p-6">
                         <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex flex-col items-center justify-center text-rose-400 shrink-0 border border-rose-500/20">
                             <span className="text-[10px] font-bold uppercase">{new Date(ms.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                             <span className="text-2xl font-black">{new Date(ms.date).getDate()}</span>
                         </div>
                         <div className="space-y-1 flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                                 <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-400 font-black tracking-widest uppercase">
                                     {ms.type}
                                 </Badge>
                                 <span className="text-[10px] text-gray-500 font-bold">{ms.sem}</span>
                             </div>
                             <h3 className="text-xl font-bold text-white truncate">{ms.title}</h3>
                             <p className="text-gray-500 text-sm">{ms.description || "Official academic milestone for the semester."}</p>
                         </div>
                         <div className="hidden md:block shrink-0">
                            <ShieldAlert className="w-6 h-6 text-rose-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                         </div>
                    </CardContent>
                 </Card>
             ))}
        </TabsContent>

        <TabsContent value="events" className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {events.filter(e => e.type !== 'HOLIDAY').map((event) => (
                 <Card key={event.id} className="bg-white/5 border-white/10 hover:bg-white/[0.08] transition-all overflow-hidden">
                    <div className="h-1 w-full bg-blue-600" />
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <Badge className="bg-blue-600">{event.type}</Badge>
                             <span className="text-xs text-gray-400 font-bold">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <CardTitle className="text-white text-lg mt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                                <MapPin className="w-3.5 h-3.5" /> {event.location || "Main Campus"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
                                <Star className="w-3.5 h-3.5 text-yellow-500" /> Featured Event
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
        </TabsContent>

        <TabsContent value="holidays" className="space-y-4">
             {events.filter(e => e.type === 'HOLIDAY').map((holiday) => (
                <div key={holiday.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <PartyPopper className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">{holiday.title}</h4>
                            <p className="text-gray-500 text-sm">{new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 opacity-50 group-hover:opacity-100 uppercase tracking-widest text-[10px]">University Holiday</Badge>
                </div>
             ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
