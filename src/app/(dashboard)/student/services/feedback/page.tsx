import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Star, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ClipboardCheck, 
  Lock, 
  Clock, 
  Users, 
  BookOpen, 
  ShieldCheck 
} from "lucide-react"
import { getPendingFeedbacks } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default async function FeedbackCenterPage() {
  const pendingSurveys = await getPendingFeedbacks()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <MessageSquare className="w-8 h-8 text-rose-500" /> Feedback Center
          </h1>
          <p className="text-gray-400 mt-1">Course Evaluations, Faculty Feedback & Institutional Surveys</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge className="bg-rose-600/20 text-rose-400 border border-rose-500/20 px-4 py-1 uppercase font-black text-[9px]">Mandatory for Registration</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN FEED: PENDING SURVEYS */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                            <CardTitle className="text-white text-lg">Survey Tasklist</CardTitle>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 uppercase text-[8px] font-black">{pendingSurveys.length} Pending</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {pendingSurveys.length > 0 ? pendingSurveys.map((survey) => (
                            <div key={survey.id} className="p-6 hover:bg-white/[0.01] transition-colors group cursor-pointer flex flex-col md:row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-rose-600/20 group-hover:text-rose-400 transition-all">
                                        {survey.type === 'COURSE' ? <BookOpen className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-bold text-md tracking-tight">{survey.title}</h4>
                                            <Badge className="bg-white/10 text-white border-white/5 text-[7px] uppercase font-black px-1.5 h-4 italic">Strictly Confidential</Badge>
                                        </div>
                                        <p className="text-[11px] text-gray-500 truncate max-w-[400px]">{survey.description}</p>
                                        <div className="flex items-center gap-3 pt-1">
                                            <p className="text-[9px] text-gray-600 uppercase font-black flex items-center gap-1">
                                                <Star className="w-3 h-3 text-amber-500" /> Assessment Type: {survey.type}
                                            </p>
                                            <span className="text-gray-800">•</span>
                                            <p className="text-[9px] text-rose-500 uppercase font-black flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Ends in 3 Days
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button className="bg-white/10 border border-white/10 text-white hover:bg-white hover:text-black font-black uppercase text-[9px] tracking-widest h-10 px-6 shrink-0 transition-all shadow-lg">
                                    Evaluate Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )) : (
                           <div className="p-20 text-center space-y-4">
                               <div className="w-16 h-16 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-400 mx-auto">
                                   <CheckCircle2 className="w-8 h-8" />
                               </div>
                               <div className="space-y-1">
                                   <p className="text-white font-black text-xs uppercase tracking-widest">No Pending Feedback</p>
                                   <p className="text-gray-500 text-[10px] uppercase font-bold">You are compliant with all institutional evaluations.</p>
                               </div>
                           </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                         <ShieldCheck className="w-16 h-16 text-white" />
                    </div>
                    <CardHeader className="bg-black/20 border-b border-white/5">
                         <CardTitle className="text-white text-md flex items-center gap-2">
                              <ShieldCheck className="w-5 h-5 text-indigo-400" /> Anonymity Protocol
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                         <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                             Academic feedback is **100% anonymous**. Course instructors will not be able to identify individual respondents. Data is aggregated for quality assurance.
                         </p>
                         <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                              <Lock className="w-4 h-4 text-indigo-500 mt-0.5" />
                              <p className="text-[9px] text-indigo-400 uppercase font-black">Encrypted Channel Active</p>
                         </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/20 border-b border-white/5">
                         <CardTitle className="text-white text-md flex items-center gap-2">
                              <HelpCircle className="w-5 h-5 text-amber-400" /> Evaluation FAQ
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                         <div className="space-y-1">
                              <p className="text-white font-bold text-[10px] uppercase">Is feedback mandatory?</p>
                              <p className="text-[10px] text-gray-500">Yes, it is required for semester registration and hall ticket generation.</p>
                         </div>
                         <div className="space-y-1">
                              <p className="text-white font-bold text-[10px] uppercase">Can I edit my response?</p>
                              <p className="text-[10px] text-gray-500">No, once submitted, responses are final and locked.</p>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* SIDEBAR: ELIGIBILITY & STATUS */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-rose-600 to-red-800 border-none relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <AlertCircle className="w-32 h-32 text-white" />
                 </div>
                 <CardHeader>
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest italic leading-tight">Compliance Status</p>
                      <CardTitle className="text-white text-2xl font-black uppercase">ACTION REQUIRED</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 relative z-10 py-2">
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                          <p className="text-white font-bold text-xs">Hall Ticket Eligibility</p>
                          <p className="text-[10px] text-white/70 leading-relaxed">
                              You have **{pendingSurveys.length} pending coarse evaluations**. Complete them to unlock your Winter 24-25 FAT Hall Ticket.
                          </p>
                      </div>
                      <Button className="w-full bg-white text-rose-600 hover:bg-rose-50 font-black uppercase text-[10px] tracking-widest h-11 transition-all shadow-xl">
                          Start Evaluations
                      </Button>
                 </CardContent>
                 <div className="h-2 bg-black/20" />
            </Card>

            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white text-sm uppercase font-black tracking-widest">Feedback History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between opacity-50">
                            <div className="space-y-0.5">
                                <p className="text-white font-bold text-[10px] uppercase">Fall Semester 2023</p>
                                <p className="text-[9px] text-gray-600 uppercase font-black">Submitted on Nov 15</p>
                            </div>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="p-4 flex items-center justify-between opacity-50">
                            <div className="space-y-0.5">
                                <p className="text-white font-bold text-[10px] uppercase">Library Facility Eval</p>
                                <p className="text-[9px] text-gray-600 uppercase font-black">Submitted on Oct 10</p>
                            </div>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-6 shadow-inner">
                 <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-500" />
                    <h4 className="text-white font-black text-xs uppercase tracking-widest">Quality Assurance</h4>
                 </div>
                 <p className="text-[11px] text-gray-500 italic leading-snug">
                    "Your feedback helps the Board of Studies refine curriculum and enhance lab infrastructure. Every response counts."
                 </p>
                 <div className="pt-4 border-t border-white/10">
                    <p className="text-white font-black text-[9px] uppercase tracking-tighter">— Office of Academic Quality</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}
