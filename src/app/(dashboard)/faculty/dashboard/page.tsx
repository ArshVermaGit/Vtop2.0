"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Upload, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FacultyDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Dashboard</h1>
           <p className="text-gray-400 mt-1">Manage courses, attendance, and marks</p>
        </div>
        <div className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-sm text-purple-300 backdrop-blur-md">
            Prof. Arsh Verma
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">142</div>
            <p className="text-xs text-gray-400 mt-1">Across 3 Courses</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400 mt-1">Fall Semester 2024-25</p>
          </CardContent>
        </Card>

         <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Uploads</CardTitle>
            <Upload className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1</div>
            <p className="text-xs text-amber-400 mt-1">Marks for CSE3002</p>
          </CardContent>
        </Card>

         <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Upcoming Class</CardTitle>
             <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">11:00 AM</div>
            <p className="text-xs text-green-400 mt-1">AB1-202 (Theory)</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-white/10 h-full">
                <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Link href="/faculty/marks">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:text-white hover:border-blue-500/50">
                            <Upload className="w-6 h-6 text-blue-400" />
                            Upload Marks
                        </Button>
                    </Link>
                     <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:text-white hover:border-purple-500/50">
                        <Users className="w-6 h-6 text-purple-400" />
                        Attendance
                    </Button>
                </CardContent>
            </Card>
       </div>
    </div>
  )
}
