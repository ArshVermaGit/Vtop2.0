import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ShieldCheck, AlertCircle, FileText, CheckCircle2, ChevronRight, Gavel, HelpCircle } from "lucide-react"
import { getDetailedMarks } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ReevaluationHub() {
  const marks = await getDetailedMarks()
  const activeRequests = marks.filter(m => m.reevaluation)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Gavel className="w-8 h-8 text-rose-500" /> Re-evaluation Hub
          </h1>
          <p className="text-gray-400 mt-1">Paper Review & Mark Verification Requests (SEE/REVAL)</p>
        </div>
        <div className="flex items-center gap-3">
             <Badge className="bg-rose-600/20 text-rose-400 border border-rose-500/20 px-4 py-1 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURE CHANNEL
             </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
                <h3 className="text-white font-black text-xs uppercase tracking-widest px-1">Available for Review</h3>
                {marks.map((m: any) => (
                    <Card key={m.id} className="bg-white/5 border-white/10 overflow-hidden group hover:border-rose-500/30 transition-all">
                        <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-white font-bold text-lg">{m.course.title}</h4>
                                    <Badge variant="outline" className="border-white/10 text-gray-500 text-[10px]">{m.grade}</Badge>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase font-black">{m.course.code} • Total Score: {m.total}/100</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {m.reevaluation ? (
                                    <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-6 py-2 uppercase font-black text-[10px]">
                                        {m.reevaluation.status}
                                    </Badge>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white uppercase text-[10px] font-black tracking-tighter">
                                            Paper View (SEE)
                                        </Button>
                                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white uppercase text-[10px] font-black tracking-tighter px-6">
                                            Re-evaluate
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        <div className="space-y-6">
             <Card className="bg-rose-600/5 border-rose-500/10 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-white text-md flex items-center gap-2">
                        <FileText className="w-4 h-4 text-rose-500" /> Guidelines
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                            <p className="text-[11px] text-gray-400 leading-tight">Requests must be submitted within 7 days of result declaration.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                            <p className="text-[11px] text-gray-400 leading-tight">Fee paid (₹250 for SEE, ₹500 for REVAL) is non-refundable.</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full text-gray-500 hover:text-white uppercase text-[10px] font-black tracking-widest">
                         Read Policy <ChevronRight className="w-3.5 h-3.5 ml-2" />
                    </Button>
                </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <h4 className="text-white font-bold text-sm uppercase">Support</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">Facing issues with the application? Contact the Controller of Examinations (CoE) office for technical support.</p>
            </div>
        </div>
      </div>
    </div>
  )
}
