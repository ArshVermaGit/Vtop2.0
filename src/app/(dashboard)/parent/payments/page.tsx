import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, 
  Receipt, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  History,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown
} from "lucide-react"
import { getStudentProfileByParent, getParentWardPayments } from "@/lib/actions"
import { Separator } from "@/components/ui/separator"

export default async function ParentPaymentsPage() {
  const [student, payments] = await Promise.all([
    getStudentProfileByParent(),
    getParentWardPayments()
  ])

  if (!student) return <div className="p-12 text-center text-gray-500 uppercase font-black text-xs tracking-widest">Ward information not available.</div>

  const pendingPayments = payments.filter(p => p.status === 'PENDING')
  const completedPayments = payments.filter(p => p.status === 'PAID')
  const totalPending = pendingPayments.reduce((acc, p) => acc + p.amount, 0)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 uppercase font-black text-[9px] mb-2 tracking-widest">Financial Oversight Hub</Badge>
           <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
              Fees & <span className="text-amber-500">Financials</span>
           </h1>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Managing university dues for {student.user.name}</p>
        </div>
        <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl">
               <History className="w-4 h-4 mr-2" /> Refund Policy
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[10px] tracking-widest h-11 rounded-xl shadow-lg shadow-amber-500/20 transition-all">
               <Wallet className="w-4 h-4 mr-2" /> Instant Pay
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* SUMMARY CARDS */}
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-linear-to-br from-amber-500/10 to-transparent border-amber-500/20 backdrop-blur-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform text-amber-500">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <CardContent className="p-8">
                        <p className="text-[10px] text-amber-500/60 uppercase font-black tracking-widest mb-1">Outstanding Balance</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter italic">₹{(totalPending/1000).toFixed(1)}K</h2>
                        <div className="mt-6 flex items-center gap-3">
                            <Badge className="bg-amber-500/20 text-amber-500 border-none text-[8px] font-black uppercase">Next Due: 15 Jan</Badge>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Includes Mess & Tuition</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform text-gray-500">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                    <CardContent className="p-8">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Scholarship Credit</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter italic">₹0.0K</h2>
                        <div className="mt-6 flex items-center gap-3">
                            <Badge className="bg-white/10 text-gray-500 border-none text-[8px] font-black uppercase">No Active Grants</Badge>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Semester 2024-25</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* PENDING ACTIONS */}
            <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl">
                <CardHeader className="bg-black/40 border-b border-white/5 py-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-amber-500" />
                            <CardTitle className="text-white text-lg uppercase font-black italic tracking-tight">Pending Dues & Demands</CardTitle>
                         </div>
                         <Badge variant="outline" className="border-amber-500/30 text-amber-500 font-black text-[9px] uppercase">{pendingPayments.length} Pending</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {pendingPayments.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {pendingPayments.map((p) => (
                                <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                            <TrendingDown className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-sm uppercase italic tracking-tight group-hover:text-amber-400 transition-colors">{p.description}</h4>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Due Date: {new Date(p.dueDate).toLocaleDateString()} • {p.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 self-end md:self-auto">
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white italic tracking-tighter">₹{p.amount.toLocaleString()}</p>
                                            <p className="text-[9px] text-gray-700 font-black uppercase">Total Demand</p>
                                        </div>
                                        <Button className="bg-white text-black hover:bg-amber-500 hover:text-black font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-lg transition-all">
                                            Pay Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">All semester dues have been settled.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
         </div>

         {/* SIDEBAR: HISTORY & RECEIPTS */}
         <div className="space-y-8">
            <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl h-fit">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4 px-6">
                    <CardTitle className="text-white text-xs uppercase font-black italic tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-500" /> Payment History
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-[600px] overflow-y-auto scrollbar-hide">
                    {completedPayments.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {completedPayments.map((p) => (
                                <div key={p.id} className="p-4 hover:bg-white/[0.02] transition-colors space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black uppercase tracking-tighter">SUCCESS</Badge>
                                        <p className="text-[9px] text-gray-600 font-bold">{new Date(p.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-white font-black uppercase italic truncate w-32">{p.description}</p>
                                            <p className="text-[8px] text-gray-700 font-black uppercase">{p.id.slice(-8)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-white italic tracking-tighter">₹{p.amount.toLocaleString()}</p>
                                            <button className="text-[8px] text-indigo-400 hover:text-white uppercase font-black mt-1 flex items-center gap-1 ml-auto">
                                                <Receipt className="w-3 h-3" /> Receipt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-relaxed">No finalized transactions recorded in this fiscal period.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-indigo-600 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-0 transition-all duration-500">
                    <ArrowUpRight className="w-20 h-20 text-white" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-lg leading-tight">Need Financial Certificate?</h4>
                    <p className="text-indigo-100/60 text-[10px] font-bold uppercase leading-relaxed">Download official fee paid certificates for tax (Section 80C) or loan purposes instantly.</p>
                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl">
                        <Download className="w-4 h-4 mr-2" /> Request Docs
                    </Button>
                </div>
            </Card>
         </div>
      </div>
    </div>
  )
}
