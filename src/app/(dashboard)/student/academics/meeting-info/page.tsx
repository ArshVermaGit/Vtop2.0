"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, Users } from "lucide-react"

export default function MeetingInfoPage() {
  const meetings = [
    { title: "Proctor Meeting", date: "15 Oct 2024", time: "05:30 PM", host: "Dr. Priya V.", type: "Mandatory", link: "https://meet.google.com/abc-defg-hij" },
    { title: "Project Review 1", date: "20 Oct 2024", time: "02:00 PM", host: "Review Panel", type: "Academic", link: "https://meet.google.com/xyz-uvwx-yz" },
  ]

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Meeting Info</h1>
           <p className="text-gray-400 mt-1">Scheduled meetings with Proctor, Faculty, or Committees</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {meetings.map((meet, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div className="space-y-1">
                             <CardTitle className="text-white">{meet.title}</CardTitle>
                             <CardDescription className="text-gray-400 flex items-center gap-2">
                                 <Users className="w-3 h-3" /> Hosted by {meet.host}
                             </CardDescription>
                        </div>
                        <Badge variant="outline" className={meet.type === "Mandatory" ? "text-rose-400 border-rose-500/30" : "text-blue-400 border-blue-500/30"}>
                            {meet.type}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center gap-6 text-sm text-gray-300">
                             <div className="flex items-center gap-2">
                                 <Calendar className="w-4 h-4 text-gray-500" />
                                 {meet.date}
                             </div>
                             <div className="flex items-center gap-2">
                                 <Clock className="w-4 h-4 text-gray-500" />
                                 {meet.time}
                             </div>
                         </div>
                         <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                             <Video className="w-4 h-4 mr-2" /> Join Meeting
                         </Button>
                    </CardContent>
                </Card>
            ))}
            
            {meetings.length === 0 && (
                <div className="col-span-full p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-lg">
                    No upcoming meetings scheduled.
                </div>
            )}
        </div>
    </div>
  )
}
