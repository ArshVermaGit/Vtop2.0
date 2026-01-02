import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, Library, Bus, Download, FileCheck, History, ChevronRight, Plus, ExternalLink, ShieldCheck, Printer, Verified } from "lucide-react"
import { getServiceRequests, getDigitalCredentials } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default async function AdminServicesPage() {
  const requests = await getServiceRequests()
  const credentials = await getDigitalCredentials()

  const idCard = credentials.find(c => c.type === 'ID_CARD')
  const libCard = credentials.find(c => c.type === 'LIBRARY_CARD')
  const busPass = credentials.find(c => c.type === 'BUS_PASS')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <FileCheck className="w-8 h-8 text-indigo-500" /> Administrative Vault
          </h1>
          <p className="text-gray-400 mt-1">Official Certificates, Transcripts & Digital Credentials</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> New Request
             </Button>
             <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-1 uppercase font-black text-[9px]">Official Services</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 group hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm uppercase tracking-tight">Bonafide</h4>
                        <p className="text-[10px] text-gray-500 leading-snug font-medium">For bank loans, passport, or visa applications.</p>
                    </div>
                </Card>
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 group hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                        <Library className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm uppercase tracking-tight">Transcripts</h4>
                        <p className="text-[10px] text-gray-500 leading-snug font-medium">Official semester-wise grade transcripts for higher studies.</p>
                    </div>
                </Card>
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                        <Verified className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm uppercase tracking-tight">Certificates</h4>
                        <p className="text-[10px] text-gray-500 leading-snug font-medium">Course Completion, Conduct, and Transfer Certificates.</p>
                    </div>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-white text-lg">Request History</CardTitle>
                            <CardDescription className="text-xs">Tracking official document processing status</CardDescription>
                        </div>
                        <History className="w-5 h-5 text-gray-500" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {requests && requests.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {requests.map((req) => (
                                <div key={req.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-white font-bold text-sm tracking-tight">{req.type}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Requested on {new Date(req.requestDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right min-w-[100px]">
                                            <Badge className={`text-[8px] font-black px-4 uppercase ${
                                                req.status === 'COMPLETED' ? 'bg-emerald-600/20 text-emerald-400' :
                                                req.status === 'REJECTED' ? 'bg-rose-600/20 text-rose-400' :
                                                'bg-amber-600/20 text-amber-400'
                                            }`}>
                                                {req.status}
                                            </Badge>
                                        </div>
                                        {req.status === 'COMPLETED' && (
                                            <Button size="icon" variant="ghost" className="text-gray-500 group-hover:text-indigo-400 transition-colors">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No service requests found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            {/* ID CARD REPLICA */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                    <ShieldCheck className="w-32 h-32 text-white" />
                </div>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest italic">Digital Identity Card</p>
                            <CardTitle className="text-white text-xl font-black">STUDENT PASSPORT</CardTitle>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                             <Verified className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10 py-6">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center p-1 overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="space-y-0.5 text-white">
                             <p className="text-xs font-black uppercase tracking-tight">Arsh Verma</p>
                             <p className="text-[10px] font-bold text-white/70">21BCE1001</p>
                             <p className="text-[8px] font-medium text-white/50 uppercase">CSE with AI/ML</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                        <div>
                             <p className="text-[8px] text-white/50 uppercase font-black">Valid Until</p>
                             <p className="text-[10px] text-white font-bold">{idCard ? new Date(idCard.validUntil).toLocaleDateString() : '30-JUN-2025'}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[8px] text-white/50 uppercase font-black">Status</p>
                             <Badge className="bg-white/20 text-white text-[7px] font-black italic uppercase">Verified</Badge>
                        </div>
                     </div>
                </CardContent>
                <div className="h-2 bg-white/20" />
            </Card>

            {/* SECONDARY CARDS */}
            <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-white/5 border-white/10 group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <CardHeader className="p-4 space-y-2">
                         <Library className="w-5 h-5 text-emerald-400" />
                         <div className="space-y-0.5">
                             <h4 className="text-white font-black text-[10px] uppercase tracking-tighter">Library Access</h4>
                             <p className="text-[9px] text-gray-500 font-bold">{libCard?.cardNumber || 'LIB-21BCE1001'}</p>
                         </div>
                    </CardHeader>
                 </Card>
                 <Card className="bg-white/5 border-white/10 group hover:border-orange-500/30 transition-all cursor-pointer">
                    <CardHeader className="p-4 space-y-2">
                         <Bus className="w-5 h-5 text-orange-400" />
                         <div className="space-y-0.5">
                             <h4 className="text-white font-black text-[10px] uppercase tracking-tighter">Bus Pass</h4>
                             <p className="text-[9px] text-gray-500 font-bold">{busPass?.cardNumber || 'BUS-R12'}</p>
                         </div>
                    </CardHeader>
                 </Card>
            </div>

            <Card className="bg-indigo-600/5 border-indigo-500/10">
                <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Printer className="w-4 h-4 text-indigo-400" /> Printing Services
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-[11px] text-gray-400 leading-relaxed italic">"Official hardcopies of certificates can be collected from AB1 Hub after proctor & registrar digital signing is completed."</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span className="text-gray-500">AB1 Hub Hours</span>
                            <span className="text-white">9:00 AM - 5:00 PM</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
