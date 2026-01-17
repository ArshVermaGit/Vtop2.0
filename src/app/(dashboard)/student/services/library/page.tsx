import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Book, 
  Search, 
  BookOpen, 
  Clock, 
  Globe, 
  ExternalLink, 
  Library, 
  Bookmark, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react"
import { getLibraryStatus } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LibraryPage() {
  const data = await getLibraryStatus()
  const { issuedBooks = [], reservations = [], dues = [], eResources = [] } = (data || {}) as { issuedBooks: any[], reservations: any[], dues: any[], eResources: any[] }

  const totalDues = dues.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Library className="w-8 h-8 text-indigo-500" /> University Library
          </h1>
          <p className="text-gray-400 mt-1">Central Catalog, E-Resources & Circulation Services</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/student/services/library/search">
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
                  <Search className="w-4 h-4 mr-2" /> Search Catalog
               </Button>
           </Link>
           <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-1 uppercase font-black text-[9px]">24/7 Access Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CIRCULATION & DUES */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        <CardTitle className="text-white text-lg">Currently Issued Books</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {issuedBooks.length > 0 ? issuedBooks.map((issue) => (
                            <div key={issue.id} className="p-6 hover:bg-white/[0.01] transition-colors group flex items-center justify-between">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-16 rounded bg-indigo-900/30 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400 group-hover:bg-indigo-600/20 transition-all">
                                        <Book className="w-6 h-6" />
                                        <p className="text-[7px] font-black uppercase mt-1">Ref</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-white font-bold text-md tracking-tight">{issue.book.title}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium">By {issue.book.author}</p>
                                        <div className="flex items-center gap-3 pt-1">
                                            <p className="text-[9px] text-gray-600 uppercase font-black flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Due on {new Date(issue.dueDate).toLocaleDateString()}
                                            </p>
                                            <span className="text-gray-800">•</span>
                                            <Badge className={`text-[7px] uppercase font-black h-4 px-2 ${issue.status === 'OVERDUE' ? 'bg-rose-600/10 text-rose-400 border-rose-500/20' : 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'}`}>
                                                {issue.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[9px] uppercase font-black text-gray-500 hover:text-white transition-all">Request Renewal</Button>
                            </div>
                        )) : (
                           <div className="p-12 text-center text-gray-600 uppercase text-[10px] font-black">No books currently issued</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/20 border-b border-white/5">
                        <CardTitle className="text-white text-md flex items-center gap-2">
                             <Bookmark className="w-5 h-5 text-amber-400" /> Pending Reservations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {reservations.length > 0 ? reservations.map((res) => (
                            <div key={res.id} className="p-4 border-b border-white/5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-white font-bold text-xs truncate max-w-[150px]">{res.book.title}</p>
                                    <p className="text-[9px] text-gray-500 uppercase font-black">Queue: #3</p>
                                </div>
                                <Badge className="bg-white/5 text-gray-400 border-white/10 text-[7px] uppercase font-black">{res.status}</Badge>
                            </div>
                        )) : (
                           <div className="p-8 text-center text-gray-700 uppercase text-[9px] font-black italic">No reservations found</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/20 border-b border-white/5">
                        <CardTitle className="text-white text-md flex items-center gap-2">
                             <AlertCircle className="w-5 h-5 text-rose-400" /> Library Dues
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 flex flex-col items-center justify-center gap-3">
                         <div className="text-center space-y-1">
                             <p className="text-[10px] text-gray-500 uppercase font-black">Outstanding Balance</p>
                             <p className={`text-3xl font-black italic ${totalDues > 0 ? 'text-rose-500' : 'text-emerald-400'}`}>${totalDues.toFixed(2)}</p>
                         </div>
                         {totalDues > 0 && (
                             <Button className="w-full bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white font-black uppercase text-[9px] tracking-widest h-9 transition-all">
                                 Clear Dues
                             </Button>
                         )}
                         {totalDues === 0 && (
                             <div className="flex items-center gap-2 p-2 px-4 rounded-full bg-emerald-600/10 border border-emerald-500/20">
                                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                 <p className="text-[9px] text-emerald-400 uppercase font-black">Account Clear</p>
                             </div>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* SIDEBAR: E-RESOURCES & TOOLS */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-800 border-none relative overflow-hidden group shadow-2xl p-1">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Globe className="w-32 h-32 text-white" />
                 </div>
                 <div className="bg-black/20 rounded-2xl p-6 relative z-10 backdrop-blur-sm">
                     <CardTitle className="text-white text-xl font-black uppercase italic tracking-tighter">Digital Commons</CardTitle>
                     <p className="text-[10px] text-white/50 uppercase font-black mb-6">Global Scientific Repositories</p>
                     
                     <div className="space-y-3">
                        {eResources.map((res) => (
                            <a key={res.id} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black border border-white/10 transition-all group/item">
                                <div className="space-y-0.5">
                                    <p className="font-bold text-[10px] uppercase truncate max-w-[150px]">{res.title}</p>
                                    <p className="text-[8px] opacity-50 font-black uppercase">{res.type} • {res.category}</p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 opacity-30 group-hover/item:opacity-100" />
                            </a>
                        ))}
                     </div>
                 </div>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-sm uppercase font-black tracking-widest border-b border-white/10 pb-4">Library Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <Button variant="outline" className="w-full justify-between h-12 bg-white/5 border-white/10 text-white font-bold uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all group">
                         Turnitin Report <ArrowUpRight className="w-4 h-4" />
                     </Button>
                     <Button variant="outline" className="w-full justify-between h-12 bg-white/5 border-white/10 text-white font-bold uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all group">
                         Room Booking (GSR) <Clock className="w-4 h-4" />
                     </Button>
                     <Button variant="outline" className="w-full justify-between h-12 bg-white/5 border-white/10 text-white font-bold uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all group">
                         Purchase Suggestion <Info className="w-4 h-4" />
                     </Button>
                </CardContent>
            </Card>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4 shadow-inner">
                 <h4 className="text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-4">Library Policies</h4>
                 <div className="space-y-3">
                     <div className="flex items-center justify-between group cursor-pointer">
                         <p className="text-[11px] text-gray-500 font-bold uppercase group-hover:text-white transition-colors">Issuance & Duartion</p>
                         <ChevronRight className="w-3.5 h-3.5 text-gray-800" />
                     </div>
                     <div className="flex items-center justify-between group cursor-pointer">
                         <p className="text-[11px] text-gray-500 font-bold uppercase group-hover:text-white transition-colors">Fine Accumulation Rules</p>
                         <ChevronRight className="w-3.5 h-3.5 text-gray-800" />
                     </div>
                     <div className="flex items-center justify-between group cursor-pointer">
                         <p className="text-[11px] text-gray-500 font-bold uppercase group-hover:text-white transition-colors">E-Access Eligibility</p>
                         <ChevronRight className="w-3.5 h-3.5 text-gray-800" />
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}

function ArrowUpRight(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </svg>
    )
  }
