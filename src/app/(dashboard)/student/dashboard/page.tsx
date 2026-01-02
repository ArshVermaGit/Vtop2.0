import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Bell, BookOpen, GraduationCap, CheckCircle } from "lucide-react"
import { getStudentProfile, getAttendance, getTimetable, getCommunications } from "@/lib/actions"

export default async function DashboardPage() {
  const profile = await getStudentProfile()
  const attendance = await getAttendance()
  const timetable = await getTimetable()
  const { communications } = await getCommunications()

  const avgAttendance = attendance.length > 0 
    ? (attendance.reduce((acc, curr) => acc + curr.percentage, 0) / attendance.length).toFixed(1) + "%"
    : "N/A"

  const stats = [
    { label: "Overall Attendance", value: avgAttendance, icon: CheckCircle, color: "text-green-400" },
    { label: "Current GPA", value: profile?.cgpa?.toFixed(2) || "0.00", icon: GraduationCap, color: "text-blue-400" },
    { label: "Active Courses", value: timetable.length.toString(), icon: BookOpen, color: "text-purple-400" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {profile?.user?.name || "Student"}!</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your academics today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">Fall Sem 2024-25</Badge>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm text-gray-400">Reg No: {profile?.regNo || "N/A"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Today's Schedule</CardTitle>
            <CardDescription className="text-gray-400">Your upcoming classes for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timetable.length > 0 ? timetable.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-white/5">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex flex-col items-center justify-center border border-blue-500/20">
                  <span className="text-xs font-medium text-blue-400">{item.startTime.split(':')[0]}</span>
                  <span className="text-[10px] text-gray-500 uppercase">{item.startTime.split(':')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{item.course.title}</h4>
                  <p className="text-xs text-gray-500">{item.slot} • Room {item.venue}</p>
                </div>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20">LIVE</Badge>
              </div>
            )) : <p className="text-gray-500 text-sm italic py-8 text-center border border-dashed border-white/10 rounded-lg">No classes scheduled for today.</p>}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Notifications</CardTitle>
            <CardDescription className="text-gray-400">Latest announcements and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {communications.length > 0 ? communications.slice(0, 3).map((comm: any, i: number) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="mt-1"><Bell className="h-4 w-4 text-amber-400" /></div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{comm.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{comm.content}</p>
                  <span className="text-[10px] text-gray-600 mt-2 block">{new Date(comm.date).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p className="text-gray-500 text-sm italic py-4 text-center">No new notifications.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
