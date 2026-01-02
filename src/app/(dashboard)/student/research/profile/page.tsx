import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, User, Book, Star, FileText, ChevronRight, GraduationCap, History, Link as LinkIcon, Milestone } from "lucide-react"
import { getResearchProfile } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ResearchProfilePage() {
  const profile = await getResearchProfile()
  if (!profile) return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl">
          <Book className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold text-white">Research Module Restricted</h2>
          <p className="text-gray-400 max-w-sm">This module is exclusively for Research Scholars and PhD students. If you believe this is an error, please contact the Research Office.</p>
          <Link href="/student/dashboard">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 h-10 px-6 font-bold uppercase tracking-wider text-[10px]">Return to Dashboard</Button>
          </Link>
      </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <GraduationCap className="w-8 h-8 text-blue-500" /> My Research Portfolio
          </h1>
          <p className="text-gray-400 mt-1">Research Scholar ID: {profile.id.substring(0, 8)} • Fellow Status: {profile.fellowshipStatus}</p>
        </div>
        <div className="flex items-center gap-3">
             <Link href="/student/research/publications">
                <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10">
                    <BookOpen className="w-4 h-4 mr-2" /> Publication Ledger
                </Button>
             </Link>
             <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-4 py-1 uppercase font-black text-[10px]">ACTIVE SCHOLAR</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-white/10 overflow-hidden relative group p-6">
              <div className="absolute -top-4 -right-4 bg-blue-600/20 w-32 h-32 rounded-full blur-3xl" />
              <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                           <User className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Supervisor Details</p>
                          <h4 className="text-white font-bold text-xl mt-1">{profile.supervisor?.user?.name || "Dr. Sarah Johnson"}</h4>
                          <p className="text-xs text-blue-400/80 mt-0.5">Senior Professor • Computer Science & Eng.</p>
                      </div>
                      <div className="flex items-center gap-2">
                           <Button size="sm" variant="outline" className="h-8 border-white/10 text-gray-400 text-[9px] uppercase font-black tracking-wider">
                               Email Supervisor
                           </Button>
                           <Button size="sm" variant="ghost" className="h-8 text-blue-400 text-[9px] uppercase font-black tracking-wider">
                               Meeting History
                           </Button>
                      </div>
                  </div>
              </div>
          </Card>

          <Card className="bg-white/5 border-white/10 lg:col-span-2 overflow-hidden flex flex-col justify-center p-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Research Area</p>
                        <p className="text-white font-bold text-sm leading-tight mt-1">{profile.researchArea}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Publications</p>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-white font-black text-2xl">{profile.publicationsCount}</span>
                             <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 text-[9px]">+1 this year</Badge>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Citations</p>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-white font-black text-2xl">{profile.citations}</span>
                             <Badge variant="outline" className="text-blue-400 border-blue-500/20 text-[9px]">i-10: 1</Badge>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">h-Index</p>
                        <p className="text-white font-black text-2xl mt-1">{profile.hIndex}</p>
                    </div>
               </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-lg">Thesis Milestone Progress</CardTitle>
                        <CardDescription className="text-xs">Ph.D Duration: Year 3 of 5 • Estimated Date: May 2026</CardDescription>
                    </div>
                    <Milestone className="w-5 h-5 text-gray-500" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="relative">
                        <div className="absolute top-0 bottom-0 left-4 w-px bg-white/10" />
                        <div className="space-y-6 relative">
                            {[
                                { title: "Topic Registration", date: "Jan 2022", status: "completed" },
                                { title: "Course Work", date: "June 2022", status: "completed" },
                                { title: "Research Proposal", date: "Jan 2023", status: "completed" },
                                { title: "Mid-Term Review", date: "Nov 2023", status: "completed" },
                                { title: "Synopsis Submission", date: "Anticipated Dec 2025", status: "pending" },
                            ].map((step, idx) => (
                                <div key={idx} className="flex items-center gap-6 pl-10 h-10 group">
                                    <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-black z-10 ${step.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
                                    <div className="flex-1 flex justify-between items-center group-hover:pl-2 transition-all">
                                        <p className={`text-sm font-bold ${step.status === 'completed' ? 'text-white' : 'text-gray-500'}`}>{step.title}</p>
                                        <span className="text-[10px] text-gray-500 uppercase font-black">{step.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                    <div>
                        <CardTitle className="text-white text-lg">Periodic Progress Reports</CardTitle>
                        <CardDescription className="text-xs">Supervisor feedback on quarterly submissions</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 uppercase text-[10px] font-black tracking-widest">
                        Submit New Report
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                     <div className="divide-y divide-white/5">
                        {profile.progressReports.map((report) => (
                             <div key={report.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="space-y-1">
                                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                        {report.title}
                                        <Badge className={`text-[8px] font-black tracking-widest ${report.status === 'APPROVED' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20' : 'bg-amber-600/20 text-amber-400 border-amber-500/20'}`}>
                                            {report.status}
                                        </Badge>
                                    </h4>
                                    <p className="text-xs text-gray-500 max-w-sm line-clamp-1 italic">"{report.supervisorComment || 'Pending feedback...'}"</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="text-right">
                                        <p className="text-[9px] text-gray-500 uppercase font-black">Date Submitted</p>
                                        <p className="text-white text-xs font-bold">{new Date(report.submittedAt).toLocaleDateString()}</p>
                                     </div>
                                     <Button size="icon" variant="ghost" className="text-gray-500 group-hover:text-white">
                                        <LinkIcon className="w-4 h-4" />
                                     </Button>
                                </div>
                             </div>
                        ))}
                     </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card className="bg-blue-600/5 border-blue-500/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText className="w-24 h-24 text-blue-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white text-md">Official Scholar Letters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative z-10">
                    {profile.researchLetters.map((letter) => (
                         <div key={letter.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-white font-bold">{letter.title}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                         </div>
                    ))}
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white uppercase text-[10px] font-black h-11 tracking-wider mt-4">
                        Request New Letter
                     </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-md">Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-600/10 border border-amber-500/20 space-y-2">
                        <div className="flex justify-between items-center">
                            <Badge className="bg-amber-600 text-white text-[8px] font-black">PENDING</Badge>
                            <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-widest">DRC Committee Meeting</span>
                        </div>
                        <p className="text-xs text-white font-bold">14th Jan 2026 • 10:30 AM</p>
                        <p className="text-[10px] text-gray-500 leading-tight">Review of primary data collected during the winter semester fieldwork.</p>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 text-gray-400 hover:text-white uppercase text-[10px] font-black h-10 tracking-wider">
                        View Complete Calendar
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
