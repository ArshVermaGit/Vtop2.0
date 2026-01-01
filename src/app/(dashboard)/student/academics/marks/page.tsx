import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSearch, Calculator, Info, AlertCircle, CheckCircle2, RefreshCw, ChevronRight, BarChartHorizontal } from "lucide-react"
import { getDetailedMarks } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DetailedMarksPage() {
  const marks = await getDetailedMarks()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <BarChartHorizontal className="w-8 h-8 text-rose-500" /> Assessment Marks (QCM)
          </h1>
          <p className="text-gray-400 mt-1">Winter Semester 2025-26 • Component-wise Internal & External Split</p>
        </div>
        <div className="flex items-center gap-3">
             <Link href="/student/academics/reevaluation">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
                    <RefreshCw className="w-4 h-4 mr-2" /> Re-evaluation Hub
                </Button>
             </Link>
             <Badge className="bg-rose-600/20 text-rose-400 border border-rose-500/20 px-4 py-1">LIVE RESULTS</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {marks.map((m: any) => (
            <Card key={m.id} className="bg-white/5 border-white/10 overflow-hidden group hover:bg-white/[0.07] transition-all">
                <CardHeader className="bg-black/20 border-b border-white/5 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-black text-xs">
                                {m.course.code.substring(0, 3)}
                            </div>
                            <div>
                                <CardTitle className="text-white text-md group-hover:text-rose-400 transition-colors">{m.course.title}</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{m.course.code} • {m.course.type}</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[9px] text-gray-500 uppercase font-black">Attendance</p>
                                <p className={`font-black text-md ${m.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>{m.attendance}%</p>
                            </div>
                            <div className="h-10 w-px bg-white/10 hidden md:block" />
                            <div className="text-right">
                                <p className="text-[9px] text-gray-500 uppercase font-black">Final Grade</p>
                                <p className="text-white font-black text-xl">{m.grade || "TBD"}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-[9px] text-gray-500 uppercase font-black px-6">Component</TableHead>
                                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Max</TableHead>
                                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Weightage</TableHead>
                                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center text-rose-400">Scored</TableHead>
                                    <TableHead className="text-[9px] text-gray-500 uppercase font-black text-right pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { label: 'CAT-1', max: 50, weight: '15%', score: m.cat1 },
                                    { label: 'CAT-2', max: 50, weight: '15%', score: m.cat2 },
                                    { label: 'DA-1', max: 10, weight: '10%', score: m.da1 },
                                    { label: 'DA-2', max: 10, weight: '10%', score: m.da2 },
                                    { label: 'Quiz / PBL', max: 20, weight: '10%', score: m.quiz + (m.pbl || 0) },
                                    { label: 'FAT (Final)', max: 100, weight: '40%', score: m.fat },
                                ].map((comp, idx) => (
                                    <TableRow key={idx} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="px-6 py-3">
                                            <span className="text-white font-bold text-xs">{comp.label}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-gray-500 font-bold text-xs">{comp.max}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="border-white/10 text-gray-500 text-[10px]">{comp.weight}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-white font-black text-sm">{comp.score || '-'}</span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            {comp.score ? (
                                                <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px]">FINALIZED</Badge>
                                            ) : (
                                                <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/20 text-[9px]">PENDING</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Calculator className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Weighted Total:</span>
                                <span className="text-white font-black text-sm">{m.total} / 100</span>
                            </div>
                            {m.reevaluation && (
                                <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] uppercase font-black">
                                    <RefreshCw className="w-3 h-3 mr-1.5 animate-spin-slow" /> Re-evaluation: {m.reevaluation.status}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-white uppercase text-[9px] font-black tracking-widest">
                                <Info className="w-3.5 h-3.5 mr-1.5" /> Marking Scheme
                            </Button>
                            <Link href="/student/academics/reevaluation">
                                <Button size="sm" variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 uppercase text-[9px] font-black tracking-widest h-8 px-4">
                                    Apply Review <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
