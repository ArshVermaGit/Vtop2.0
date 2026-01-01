import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle2, Circle, Clock, Search, Filter, Layers, GraduationCap } from "lucide-react"
import { getCourseRegistrations, getCourses } from "@/lib/actions"
import { Progress } from "@/components/ui/progress"

export default async function StudentCurriculumPage() {
  const [registrations, allCourses] = await Promise.all([
    getCourseRegistrations(),
    getCourses()
  ])

  const registeredCourseIds = new Set(registrations.map(r => r.courseId))
  
  const categories = [
    { title: "University Core", color: "blue", courses: allCourses.filter(c => c.category === "University Core") },
    { title: "Program Core", color: "purple", courses: allCourses.filter(c => c.category === "Program Core") },
    { title: "Program Electives", color: "indigo", courses: allCourses.filter(c => c.category === "Program Elective") },
  ]

  const totalCredits = allCourses.reduce((acc, c) => acc + c.credits, 0)
  const earnedCredits = registrations.reduce((acc, r) => acc + r.course.credits, 0)
  const progressPercent = Math.round((earnedCredits / (totalCredits || 1)) * 100)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Layers className="w-8 h-8 text-blue-400" /> My Curriculum
          </h1>
          <p className="text-gray-400 mt-1">Degree requirements and academic progress</p>
        </div>
        <div className="text-right">
             <p className="text-xs text-gray-500 uppercase font-bold mb-1">Overall Progress</p>
             <div className="flex items-center gap-3">
                <Progress value={progressPercent} className="w-32 h-2 bg-white/5" />
                <span className="text-blue-400 font-bold text-xl">{progressPercent}%</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
              <Card key={cat.title} className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
                  <div className={`h-1 w-full ${cat.color === 'blue' ? 'bg-blue-600' : cat.color === 'purple' ? 'bg-purple-600' : 'bg-indigo-600'}`} />
                  <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-lg">{cat.title}</CardTitle>
                        <Badge variant="outline" className={`border-${cat.color}-500/30 text-${cat.color}-400`}>
                            {cat.courses.filter(c => registeredCourseIds.has(c.id)).length} / {cat.courses.length}
                        </Badge>
                      </div>
                      <CardDescription>Required credits: {cat.courses.reduce((acc, c) => acc + c.credits, 0)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {cat.courses.map((course) => (
                          <div key={course.id} className="p-3 rounded-lg bg-black/20 border border-white/5 flex items-center gap-3 group hover:border-white/20 transition-all">
                              {registeredCourseIds.has(course.id) ? (
                                  <CheckCircle2 className={`w-5 h-5 text-emerald-400 shrink-0`} />
                              ) : (
                                  <Circle className="w-5 h-5 text-gray-700 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">{course.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-gray-500 uppercase font-bold">{course.code}</span>
                                      <span className="text-[10px] text-gray-400">({course.credits} Credits)</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          ))}
      </div>

      <Card className="bg-white/5 border-white/10">
         <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" /> Curriculum Summary
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Credits</p>
                    <p className="text-2xl font-bold text-white">{totalCredits}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Earned Credits</p>
                    <p className="text-2xl font-bold text-emerald-400">{earnedCredits}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Remaining</p>
                    <p className="text-2xl font-bold text-blue-400">{totalCredits - earnedCredits}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Current Sem</p>
                    <p className="text-2xl font-bold text-purple-400">Winter 24-25</p>
                </div>
            </div>
         </CardContent>
      </Card>
    </div>
  )
}
