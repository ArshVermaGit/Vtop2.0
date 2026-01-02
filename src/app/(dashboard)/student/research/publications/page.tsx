import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Book, Plus, ExternalLink, Filter, Search, Award, TrendingUp, History, Quote } from "lucide-react"
import { getResearchProfile } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function PublicationsPage() {
  const profile = await getResearchProfile()
  if (!profile) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Book className="w-8 h-8 text-emerald-500" /> Publication Ledger
          </h1>
          <p className="text-gray-400 mt-1">Scholarly Output & Citation Tracking • {profile.publicationsCount} Active Publications</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> Add Publication
             </Button>
             <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-1">SCIENTIFIC RECORD</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white/[0.07] transition-all">
              <Award className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Global Citation Count</p>
              <h4 className="text-4xl font-black text-white">{profile.citations}</h4>
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" /> +4 this semester
              </div>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white/[0.07] transition-all">
              <Quote className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Scholar h-Index</p>
              <h4 className="text-4xl font-black text-white">{profile.hIndex}</h4>
              <p className="text-[10px] text-gray-500">Benchmark: Elite Researcher</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white/[0.07] transition-all">
              <History className="w-8 h-8 text-purple-400 mb-2" />
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">i10-Index</p>
              <h4 className="text-4xl font-black text-white">1</h4>
              <p className="text-[10px] text-gray-500">Publications with 10+ citations</p>
          </Card>
      </div>

      <div className="flex items-center gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input placeholder="Search journal, title or year..." className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
          <Button variant="outline" className="border-white/10 text-gray-400 h-10 px-4">
              <Filter className="w-4 h-4 mr-2" /> Filter By Type
          </Button>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <Table>
            <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[9px] text-gray-500 uppercase font-black px-6">Publication Details</TableHead>
                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Year</TableHead>
                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Type</TableHead>
                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Status</TableHead>
                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-right pr-6">Source</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profile.publications.map((pub) => (
                    <TableRow key={pub.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                                <p className="text-white font-bold text-sm tracking-tight group-hover:text-emerald-400 transition-colors leading-snug">{pub.title}</p>
                                <div className="flex items-center gap-3">
                                     <p className="text-[10px] text-gray-500 uppercase font-black italic">{pub.journal}</p>
                                     <span className="text-white/20 text-[10px]">|</span>
                                     <p className="text-[10px] text-gray-500 font-bold">{pub.authors}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <span className="text-xs text-white font-bold">{pub.year}</span>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge variant="outline" className="border-white/10 text-gray-500 text-[9px] font-black tracking-widest">{pub.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge className={pub.status === 'PUBLISHED' ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px]" : "bg-amber-600/20 text-amber-400 border border-amber-500/20 text-[9px]"}>
                                {pub.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                            <Link href={pub.doi ? `https://doi.org/${pub.doi}` : '#'} target="_blank">
                                <Button size="sm" variant="ghost" className="text-white group-hover:bg-emerald-600/10 h-8 px-4 text-[10px] font-black uppercase tracking-widest">
                                    {pub.doi ? 'DOI Link' : 'Draft'} <ExternalLink className="w-3.5 h-3.5 ml-2" />
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Card>

      <div className="p-8 rounded-3xl bg-emerald-600/5 border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">Impact Analytics</h4>
                  <p className="text-xs text-gray-400 max-w-md">Your research has been cited in <span className="text-emerald-400 font-bold">12 peer-reviewed articles</span> globally. You are in the top 5% of research scholars in the CSE department.</p>
              </div>
          </div>
          <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-black uppercase text-[10px] tracking-widest px-8">
              Download Research Profile
          </Button>
      </div>
    </div>
  )
}
