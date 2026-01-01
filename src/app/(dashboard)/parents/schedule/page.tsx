import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, BookOpen, Calendar as CalendarIcon, Info } from "lucide-react"
import { getStudentProfileByParent, getWardTimetable, getAcademicEvents, getSemesterMilestones } from "@/lib/actions"

export default async function ParentSchedulePage() {
  const [student, timetableItems, events, milestones] = await Promise.all([
    getStudentProfileByParent(),
    getWardTimetable(),
    getAcademicEvents(),
    getSemesterMilestones()
  ])

  if (!student) return <div className="p-12 text-center text-gray-500">Ward information not available.</div>

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <CalendarIcon className="w-8 h-8 text-emerald-400" /> Ward's Schedule & University Calendar
          </h1>
          <p className="text-gray-400 mt-1">Monitoring {student.user.name}'s academic routine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-white/5 border-white/10 shadow-2xl">
              <CardHeader className="bg-black/20 border-b border-white/5">
                 <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" /> Weekly Class Schedule
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <Tabs defaultValue="Monday" className="w-full">
                    <TabsList className="bg-transparent border-b border-white/10 p-1 w-full justify-start h-auto flex-wrap">
                      {days.map(day => (
                        <TabsTrigger key={day} value={day} className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-6">
                          {day}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {days.map(day => (
                      <TabsContent key={day} value={day} className="p-6 space-y-4">
                        {timetableItems.filter(item => item.day === day).length > 0 ? (
                           timetableItems.filter(item => item.day === day).map((item, i) => (
                             <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-400 border border-emerald-500/20">
                                      <span className="text-[10px] font-bold">{item.startTime}</span>
                                      <span className="text-[8px] text-gray-500">{item.endTime}</span>
                                   </div>
                                   <div>
                                      <h4 className="text-white font-bold text-sm tracking-tight">{item.course.title}</h4>
                                      <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-bold uppercase">
                                         <span className="flex items-center gap-1"> <BookOpen className="w-3 h-3 text-purple-400" /> {item.course.code} </span>
                                         <span className="flex items-center gap-1"> <MapPin className="w-3 h-3 text-rose-400" /> {item.venue} </span>
                                      </div>
                                   </div>
                                </div>
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] uppercase">{item.course.type}</Badge>
                             </div>
                           ))
                        ) : (
                          <div className="p-8 text-center text-gray-600 italic text-sm">No classes scheduled on this day.</div>
                        )}
                      </TabsContent>
                    ))}
                 </Tabs>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
             <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg">University Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {milestones.map((ms) => (
                        <div key={ms.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                             <div className="flex justify-between items-center">
                                <Badge className="bg-emerald-600/20 text-emerald-400 border-none text-[10px] uppercase font-black">{ms.type}</Badge>
                                <span className="text-[10px] text-gray-500 font-bold">{new Date(ms.date).toLocaleDateString()}</span>
                             </div>
                             <p className="text-white font-bold text-sm">{ms.title}</p>
                        </div>
                    ))}
                </CardContent>
             </Card>

             <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Official Holidays</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {events.filter(e => e.type === 'HOLIDAY').map((holiday) => (
                        <div key={holiday.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center group hover:bg-emerald-500/5">
                             <div>
                                <p className="text-white font-bold text-sm">{holiday.title}</p>
                                <p className="text-[10px] text-gray-500">{new Date(holiday.date).toLocaleDateString()}</p>
                             </div>
                             <Info className="w-4 h-4 text-emerald-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  )
}
