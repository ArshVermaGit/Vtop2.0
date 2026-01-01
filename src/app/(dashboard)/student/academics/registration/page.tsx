import { getCourses, getCourseRegistrations } from "@/lib/actions"
import RegistrationClient from "./RegistrationClient"
import { Badge } from "@/components/ui/badge"
import { GraduationCap } from "lucide-react"

export default async function StudentRegistrationPage() {
  const [allCourses, registrations] = await Promise.all([
    getCourses(),
    getCourseRegistrations()
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <GraduationCap className="w-8 h-8 text-emerald-400" /> Course Registration
          </h1>
          <p className="text-gray-400 mt-1">Winter Semester 2024-25 Enrollment</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Credits Registered</p>
                <p className="text-xl font-bold text-emerald-400">
                    {registrations.reduce((acc, r) => acc + r.course.credits, 0)} / 27
                </p>
             </div>
             <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-1">OPEN</Badge>
        </div>
      </div>

      <RegistrationClient allCourses={allCourses} initialRegistrations={registrations} />
    </div>
  )
}
