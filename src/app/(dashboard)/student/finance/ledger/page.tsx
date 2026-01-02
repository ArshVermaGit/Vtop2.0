import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Receipt, Award, TrendingUp, History, Info, ChevronRight, Download, CheckCircle2, AlertCircle, Landmark, ShieldCheck } from "lucide-react"
import { getFinancialStatus } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function FinancialLedgerPage() {
  const status = await getFinancialStatus()
  if (!status) return null

  const pendingPayments = status.payments.filter(p => p.status === 'PENDING')
  const totalDue = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Landmark className="w-8 h-8 text-emerald-500" /> Financial Treasury
          </h1>
          <p className="text-gray-400 mt-1">Fee Structure, Online Payments & Scholarship Status</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest px-8 h-10 shadow-lg">
                <CreditCard className="w-4 h-4 mr-2" /> Pay Outstanding
             </Button>
             <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-1">SECURE BILLING</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wallet className="w-16 h-16 text-emerald-500" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Outstanding</p>
                  <CardTitle className="text-4xl font-black text-white">₹{totalDue.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase">
                      <AlertCircle className="w-3.5 h-3.5" /> Due by Jan 31, 2025
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award className="w-16 h-16 text-blue-500" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Scholarships Applied</p>
                  <CardTitle className="text-4xl font-black text-white">01</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Disbursed: ₹50,000
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-16 h-16 text-orange-500" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Payment Accuracy</p>
                  <CardTitle className="text-4xl font-black text-white">100%</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase">
                      Zero Late Fee History
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-lg">Detailed Payment Ledger</CardTitle>
                        <CardDescription className="text-xs">History of all academic and residential transactions</CardDescription>
                    </div>
                    <Button variant="outline" className="h-8 border-white/10 text-gray-400 text-[10px] font-black uppercase">
                        Download Ledger <Download className="w-3 h-3 ml-2" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {status.payments.map((payment) => (
                            <div key={payment.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        payment.status === 'PAID' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-600/10 text-rose-400 border border-rose-500/20'
                                    }`}>
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-white font-bold text-sm tracking-tight">{payment.description}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-black">{payment.type} • {payment.paidDate ? `Paid: ${new Date(payment.paidDate).toLocaleDateString()}` : `Due: ${new Date(payment.dueDate).toLocaleDateString()}`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-500 uppercase font-black">Amount</p>
                                        <p className="text-sm text-white font-black italic">₹{payment.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                        <Badge className={`text-[8px] font-black px-4 uppercase ${
                                            payment.status === 'PAID' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/20 text-rose-400'
                                        }`}>
                                            {payment.status}
                                        </Badge>
                                    </div>
                                    {payment.status === 'PAID' ? (
                                        <Button size="icon" variant="ghost" className="text-gray-500 group-hover:text-emerald-400">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button size="icon" variant="ghost" className="text-gray-500 group-hover:text-rose-400">
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white text-md flex items-center gap-2">
                            <Award className="w-4 h-4 text-orange-400" /> Scholarship Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 border-t border-white/5">
                        {status.scholarships.map((s) => (
                             <div key={s.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="space-y-0.5">
                                    <p className="text-xs text-white font-bold">{s.name}</p>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Type: {s.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-emerald-400 font-black">₹{s.amount.toLocaleString()}</p>
                                    <Badge variant="outline" className="text-[7px] border-emerald-500/20 text-emerald-400 uppercase font-black">{s.status}</Badge>
                                </div>
                             </div>
                        ))}
                        <Button variant="ghost" className="w-full h-10 border-t border-white/5 text-[9px] text-gray-500 hover:text-white uppercase font-black tracking-widest">
                            Apply for New Fund <ChevronRight className="w-3 h-3 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white text-md">Bank Account Integration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                            <p className="text-[9px] text-gray-500 uppercase font-black">Primary Refund Account</p>
                            <p className="text-white font-bold text-xs tracking-widest">SBIN****1234</p>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-snug">All scholarships and mess rebates are processed directly to this verified account.</p>
                        <Button variant="link" className="p-0 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            Update Bank Mandate <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="space-y-6">
             <Card className="bg-emerald-600/5 border-emerald-500/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Receipt className="w-24 h-24 text-emerald-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white text-md">Fee Intimation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                        {status.feeStructure.map((f) => (
                             <div key={f.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                <span className="text-[10px] text-gray-500 uppercase font-black">{f.name}</span>
                                <span className="text-white font-bold text-xs">₹{f.amount.toLocaleString()}</span>
                             </div>
                        ))}
                     </div>
                     <div className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-start gap-4">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-emerald-400 font-bold leading-relaxed uppercase">Fee for Winter 2024-25 is active. Late fee of 10% applies after 31st Jan.</p>
                     </div>
                </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-gray-400" />
                    <h4 className="text-white font-bold text-sm uppercase">Billing Support</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed italic">"For payment failures or dual-debit issues, please do not re-pay. Wait for 24-48 hours for automated reconciliation."</p>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-gray-500 uppercase">Accounts Helpline</span>
                        <span className="text-white">044-2456-9900</span>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-3xl bg-emerald-600/5 border border-emerald-500/10 flex items-center justify-center space-x-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed group">
                 <Landmark className="w-5 h-5 text-emerald-400" />
                 <span className="text-[10px] text-white font-black uppercase tracking-widest">Generate Bonafide for Loan</span>
            </div>
        </div>
      </div>
    </div>
  )
}
