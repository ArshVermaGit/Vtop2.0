"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, Users } from "lucide-react"

export default function FacultyInfoPage() {
  const faculty = [
    { name: "Dr. Priya V.", school: "SCOPE", cabin: "AB1-405", email: "priya.v@university.edu", designation: "Asst. Prof Sr." },
    { name: "Dr. Ankit Kumar", school: "SCSE", cabin: "AB1-202", email: "ankit.k@university.edu", designation: "Assoc. Prof" },
    { name: "Dr. S. Sharma", school: "SAS", cabin: "AB2-101", email: "s.sharma@university.edu", designation: "Professor" },
  ]

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Information</h1>
           <p className="text-gray-400 mt-1">Search for faculty members, view cabin details and contact info</p>
        </div>

        <div className="flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Search by name, school, or cabin..." className="pl-10 bg-black/20 border-white/10 text-white" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((member, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                                 {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                             </div>
                             <div>
                                 <CardTitle className="text-white text-base">{member.name}</CardTitle>
                                 <CardDescription className="text-blue-400 text-xs">{member.designation}</CardDescription>
                             </div>
                        </div>
                        <Badge variant="outline" className="text-gray-400 border-white/10">{member.school}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                         <div className="flex items-center gap-3 text-sm text-gray-300 bg-black/20 p-2 rounded">
                             <Users className="w-4 h-4 text-purple-400" />
                             <span>Cabin: <span className="text-white font-medium">{member.cabin}</span></span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-300">
                             <Mail className="w-4 h-4 text-green-400" />
                             <span className="truncate">{member.email}</span>
                         </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  )
}
