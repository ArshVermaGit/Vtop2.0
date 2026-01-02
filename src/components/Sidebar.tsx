"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import {
  BarChartHorizontal,
  History,
  MapPin,
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  MessageCircle,
  GraduationCap, 
  LogOut, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  Database,
  Shield,
  ClipboardList,
  LayoutGrid,
  Activity,
  Award,
  UserCheck,
  Home,
  Plane,
  Wallet,
  FileCheck,
  Megaphone,
  Briefcase,
  Trophy,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"


interface SubItem {
  label: string;
  href: string;
}

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  subItems?: SubItem[];
}

const studentItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
  { icon: UserCheck, label: "Mentorship Hub", href: "/student/mentor" },
  { icon: LayoutGrid, label: "Course Content", href: "/student/academics/courses" },
  { icon: ClipboardList, label: "Time Table", href: "/student/academics/timetable" },
  { icon: Calendar, label: "University Calendar", href: "/student/academics/calendar" },
  { icon: ShieldCheck, label: "Exam Schedule", href: "/student/academics/exams" },
  { icon: BarChartHorizontal, label: "Assessment Marks", href: "/student/academics/marks" },
  { icon: GraduationCap, label: "Academic Results", href: "/student/academics/results" },
  { icon: History, label: "Grade Ledger", href: "/student/academics/grades" },
  { icon: FileText, label: "Hall Ticket", href: "/student/academics/exams/hall-ticket" },
  { icon: MapPin, label: "Seat Locator", href: "/student/academics/exams/seats" },
  { icon: User, label: "Profile", href: "/student/profile" },
  { icon: BookOpen, label: "Academics", href: "/student/academics", 
    subItems: [
      { label: "Attendance", href: "/student/academics/attendance" },
      { label: "My Curriculum", href: "/student/academics/curriculum" },
      { label: "Course Registration", href: "/student/academics/registration" },
      { label: "Learning Resources", href: "/student/academics/materials" },
      { label: "Marks & Grades", href: "/student/academics/grades" },
      { label: "Faculty Info", href: "/student/academics/faculty-info" },
      { label: "Exam Schedule", href: "/student/academics/exam-schedule" },
      { label: "Grade History", href: "/student/academics/grade-history" },
      { label: "Biometric Report", href: "/student/academics/biometrics" },
    ] 
  },
  { icon: ShieldCheck, label: "Credentials", href: "/student/credentials" },
  { icon: MessageCircle, label: "Class Messages", href: "/student/messages" },
  { icon: FileText, label: "Research & Thesis", href: "/student/research",
    subItems: [
        { label: "My Research Profile", href: "/student/research" },
        { label: "Thesis Submission", href: "/student/research/thesis" },
        { label: "Research Documents", href: "/student/research/docs" },
    ]
  },
  { icon: Calendar, label: "Leave Requests", href: "/student/leaves",
    subItems: [
        { label: "Scholar Leave", href: "/student/leaves/scholar" },
        { label: "General Leave", href: "/student/leaves/general" },
    ]
  },
  { icon: CreditCard, label: "Payments", href: "/student/payments" },
  { icon: GraduationCap, label: "Research Portal", href: "/student/research/profile" },
  { icon: Home, label: "Hostel & Residency", href: "/student/hostel/details" },
  { icon: Plane, label: "Leave & Outings", href: "/student/leaves/hub" },
  { icon: Wallet, label: "Financials & Fees", href: "/student/finance/ledger" },
  { icon: FileCheck, label: "Admin Services", href: "/student/services/admin" },
  { icon: Megaphone, label: "Comm. Hub", href: "/student/communications/hub" },
  { icon: Briefcase, label: "Career & Placements", href: "/student/career/placements" },
  { icon: LayoutGrid, label: "Services Hub", href: "/student/services",
    subItems: [
        { label: "Academic Registration", href: "/student/academics/registration" },
        { label: "Bonafide Certificate", href: "/student/services/admin" },
        { label: "Transcript Request", href: "/student/services/transcript" },
        { label: "Final Year Registration", href: "/student/services/final-year" },
        { label: "Feedback Center", href: "/student/services/feedback" },
        { label: "Library Hub", href: "/student/services/library" },
    ]
  },
  { icon: Users, label: "Club Hub", href: "/student/extracurricular/clubs" },
  { icon: Trophy, label: "vAchieve Portal", href: "/student/extracurricular/achievements" },
  { icon: Settings, label: "Matrix Settings", href: "/settings",
    subItems: [
        { label: "Security Matrix", href: "/settings/security" },
        { label: "Identity Hub", href: "/student/profile" },
        { label: "Preferences", href: "/settings/preferences" },
    ]
  },
];

const facultyItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/faculty/dashboard" },
  { icon: User, label: "Profile", href: "/faculty/profile" },
  { icon: Users, label: "Mentorship Hub", href: "/faculty/mentor" },
  { icon: Calendar, label: "Teaching Schedule", href: "/faculty/schedule" },
  { icon: ShieldCheck, label: "Mark Attendance", href: "/faculty/attendance" },
  { icon: Award, label: "Marks Upload", href: "/faculty/marks" },
  { icon: MessageCircle, label: "Messages", href: "/faculty/messages" },
  { icon: Wallet, label: "Administrative", href: "/faculty/admin",
    subItems: [
        { label: "Payroll & Payslips", href: "/faculty/admin/payroll" },
        { label: "Residency Ledger", href: "/faculty/admin/leaves" },
        { label: "Research Portfolio", href: "/faculty/dashboard" },
    ]
  },
  { icon: Settings, label: "Matrix Settings", href: "/settings",
    subItems: [
        { label: "Security Matrix", href: "/settings/security" },
        { label: "Identity Hub", href: "/faculty/profile" },
        { label: "Preferences", href: "/settings/preferences" },
    ]
  },
];

const parentItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/parent/dashboard" },
  { icon: User, label: "Ward Details", href: "/parent/ward-details" },
  { icon: Calendar, label: "Ward's Schedule", href: "/parent/schedule" },
  { icon: Activity, label: "Ward Performance", href: "/parent/performance" },
  { icon: CreditCard, label: "Fees & Dues", href: "/parent/payments" },
  { icon: MessageCircle, label: "Contact Proctor", href: "/parent/proctor" },
  { icon: Settings, label: "Matrix Settings", href: "/settings",
    subItems: [
        { label: "Security Matrix", href: "/settings/security" },
        { label: "Communication Prefs", href: "/settings/preferences" },
    ]
  },
];

const adminItems: SidebarItem[] = [
  { icon: Shield, label: "Control Center", href: "/admin/dashboard" },
  { icon: Zap, label: "Engine Forge", href: "/admin/engine" },
  { icon: ShieldCheck, label: "Attendance Control", href: "/admin/attendance" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: Database, label: "Database Hub", href: "/admin/database" },
  { icon: Activity, label: "System Health", href: "/admin/health" },
  { icon: Settings, label: "Matrix Settings", href: "/settings",
    subItems: [
        { label: "Security Matrix", href: "/settings/security" },
        { label: "System Alerts", href: "/admin/alerts" },
        { label: "Audit Logs", href: "/admin/engine" },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const role = (session?.user as any)?.role || "STUDENT"
  
  const items = role === "ADMIN" ? adminItems : 
                role === "FACULTY" ? facultyItems : 
                role === "PARENT" ? parentItems : studentItems

  return (
    <motion.div 
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      className="relative h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 text-white"
    >
      <div className="flex items-center gap-3 p-6 h-20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <span className="font-bold text-white text-xl">V</span>
        </div>
        <AnimatePresence>
            {!isCollapsed && (
            <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
            >
                <span className="font-bold text-lg tracking-tight">VTOP 2.0</span>
                <span className="text-xs text-gray-400">{role} Portal</span>
            </motion.div>
            )}
        </AnimatePresence>
      </div>

      <Separator className="bg-white/5" />

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const isActive = pathname === item.href
          const subItems = item.subItems
          const hasSubItems = Array.isArray(subItems) && subItems.length > 0
          const isSubActive = hasSubItems && subItems?.some((sub) => pathname === sub.href)
          
          return (
            <div key={item.label} className="space-y-1">
                <Link href={item.href}>
                <Button
                    variant="ghost"
                    className={cn(
                    "w-full justify-start gap-3 h-11 relative overflow-hidden group hover:bg-white/5 transition-all px-3",
                    (isActive || isSubActive) && "bg-blue-600/10 text-blue-400"
                    )}
                >
                    <item.icon className={cn("w-4.5 h-4.5 shrink-0 transition-colors", (isActive || isSubActive) ? "text-blue-400" : "text-gray-400 group-hover:text-white")} />
                    {!isCollapsed && (
                        <span className={cn("font-medium text-sm transition-colors", (isActive || isSubActive) ? "text-blue-100" : "text-gray-400 group-hover:text-white")}>
                            {item.label}
                        </span>
                    )}
                </Button>
                </Link>
                
                {!isCollapsed && hasSubItems && (isSubActive || isActive) && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pl-9 space-y-1"
                    >
                        {subItems?.map((sub) => (
                            <Link key={sub.href} href={sub.href}>
                                <div className={cn(
                                    "text-xs py-2 px-3 rounded-lg transition-colors",
                                    pathname === sub.href ? "bg-white/10 text-blue-400" : "text-gray-500 hover:text-white hover:bg-white/5"
                                )}>
                                    {sub.label}
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </div>
          )
        })}
      </div>

      <div className="p-3 mt-auto space-y-2"> 
         <Button variant="ghost" className="w-full justify-start gap-3 h-12 hover:bg-white/5 px-2 group">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-bold">
                {session?.user?.name?.[0] || "U"}
            </div>
             {!isCollapsed && (
                <div className="flex flex-col items-start truncate overflow-hidden">
                     <span className="text-sm font-medium text-white truncate w-32 text-left">{session?.user?.name || "User"}</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{role}</span>
                </div>
             )}
         </Button>
         
         <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-400 text-gray-400 h-10 px-3">
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
         </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-gray-900 border border-white/10 hover:bg-gray-800 z-50 shadow-xl"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
    </motion.div>
  )
}
