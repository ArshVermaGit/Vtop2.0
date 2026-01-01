import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, BookOpen, Calendar as CalendarIcon, Filter } from "lucide-react"
import { getFacultyProfile, getAcademicEvents, getSemesterMilestones } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default async function FacultySchedulePage() {
  const [faculty, events, milestones] = await Promise.all([
    getFacultyProfile(),
    getAcademicEvents(),
    getSemesterMilestones()
  ])

  if (!faculty) return <div className="p-12 text-center text-gray-500">Log in to view your schedule.</div>

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <CalendarIcon className="w-8 h-8 text-indigo-400" /> Teaching Schedule & Calendar
          </h1>
          <p className="text-gray-400 mt-1">Manage your weekly sessions and academic deadlines</p>
        </div>
        <Button variant="outline" className="border-indigo-500/30 text-indigo-400">
            <Filter className="w-4 h-4 mr-2" /> Filter View
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Tabs defaultValue="Monday" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start overflow-x-auto">
                {days.map(day => (
                  <TabsTrigger key={day} value={day} className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white min-w-[100px]">
                    {day}
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map(day => (
                <TabsContent key={day} value={day} className="mt-6 space-y-4">
                  {/* In a real app we'd filter by day. Here we show a generic teaching session for demo */}
                  <Card className="bg-white/5 border-white/10 hover:bg-white/[0.08] transition-all group">
                    <CardContent className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex flex-col items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                <span className="text-lg font-bold text-indigo-400">08:00 AM</span>
                                <span className="text-xs text-gray-500 uppercase">08:50 AM</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-400">SESSION 1</Badge>
                                    <h3 className="text-xl font-bold text-white">Advanced Web Systems</h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <BookOpen className="w-4 h-4 text-purple-400" /> SWE3001
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <MapPin className="w-4 h-4 text-rose-400" /> AB1-402
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                                        <User className="w-4 h-4" /> 62 Students
                                    </div>
                                </div>
                            </div>
                         </div>
                         <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Digital Attendance</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
           </Tabs>
        </div>

        <div className="space-y-6">
             <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Upcoming Milestones</CardTitle>
                    <CardDescription>Official academic deadlines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {milestones.slice(0, 3).map((ms) => (
                        <div key={ms.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                             <div className="flex justify-between items-center">
                                <Badge className="bg-rose-600/20 text-rose-400 border-none text-[10px]">{ms.type}</Badge>
                                <span className="text-[10px] text-gray-500 font-bold">{new Date(ms.date).toLocaleDateString()}</span>
                             </div>
                             <p className="text-white font-bold text-sm">{ms.title}</p>
                        </div>
                    ))}
                </CardContent>
             </Card>

             <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg">University Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {events.slice(0, 2).map((event) => (
                        <div key={event.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                             <div className="flex justify-between items-center">
                                <Badge className="bg-blue-600/20 text-blue-400 border-none text-[10px]">{event.type}</Badge>
                                <span className="text-[10px] text-gray-500 font-bold">{new Date(event.date).toLocaleDateString()}</span>
                             </div>
                             <p className="text-white font-bold text-sm">{event.title}</p>
                        </div>
                    ))}
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  )
}
