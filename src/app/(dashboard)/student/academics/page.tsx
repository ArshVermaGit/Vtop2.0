"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  GraduationCap, 
  History, 
  LayoutGrid, 
  MapPin, 
  ShieldCheck, 
  User, 
  BarChartHorizontal,
  FileText
} from "lucide-react"

const academicItems = [
  { icon: ClipboardList, label: "Time Table", href: "/student/academics/timetable", desc: "View your class schedule" },
  { icon: Calendar, label: "University Calendar", href: "/student/academics/calendar", desc: "Key academic dates" },
  { icon: ShieldCheck, label: "Exam Schedule", href: "/student/academics/exams", desc: "Upcoming assessments" },
  { icon: BarChartHorizontal, label: "Marks & Grades", href: "/student/academics/marks", desc: "Check your performance" },
  { icon: GraduationCap, label: "Results", href: "/student/academics/results", desc: "Semester results" },
  { icon: History, label: "Grade History", href: "/student/academics/grades", desc: "Complete grade ledger" },
  { icon: FileText, label: "Hall Ticket", href: "/student/academics/exams/hall-ticket", desc: "Download for exams" },
  { icon: MapPin, label: "Seat Locator", href: "/student/academics/exams/seats", desc: "Find your exam seat" },
  { icon: User, label: "Faculty Info", href: "/student/academics/faculty-info", desc: "Know your instructors" },
  { icon: LayoutGrid, label: "Courses", href: "/student/academics/courses", desc: "Manage enrolled courses" },
  { icon: BookOpen, label: "Curriculum", href: "/student/academics/curriculum", desc: "View program structure" },
]

export default function AcademicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Academic Hub</h1>
        <p className="text-gray-400">Manage your entire academic journey from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {academicItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href}>
              <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2 group-hover:bg-blue-500/30 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg text-white group-hover:text-blue-200 transition-colors">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 group-hover:text-gray-300">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
