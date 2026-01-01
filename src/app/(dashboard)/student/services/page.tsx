"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, FileText, Fingerprint, Plane } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Student Services</h1>
           <p className="text-gray-400 mt-1">Apply for leaves, certificates, and view reports</p>
        </div>

        <Tabs defaultValue="leave" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start flex-wrap h-auto">
                <TabsTrigger value="leave" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white min-w-[120px]">Leave Request</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white min-w-[120px]">Documents</TabsTrigger>
                <TabsTrigger value="biometric" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white min-w-[120px]">Biometric</TabsTrigger>
            </TabsList>

            <TabsContent value="leave" className="mt-6 space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">New Leave Application</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label className="text-gray-300">Leave Type</Label>
                                <select className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500">
                                    <option value="outing">Outing (Day Pass)</option>
                                    <option value="leave">Home Leave</option>
                                    <option value="medical">Medical Leave</option>
                                    <option value="scholar">Scholar Leave (OD)</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">From Date</Label>
                                    <Input type="date" className="bg-black/20 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">To Date</Label>
                                    <Input type="date" className="bg-black/20 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Reason</Label>
                                <Textarea placeholder="Reason for leave..." className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <Button className="w-full bg-rose-600 hover:bg-rose-700">Submit Request</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Requests</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Plane className="w-5 h-5 text-rose-400" />
                                        <div>
                                            <p className="text-white text-sm font-medium">Home Leave</p>
                                            <p className="text-xs text-gray-400">12 Oct - 15 Oct</p>
                                        </div>
                                    </div>
                                    <Badge variant={i === 1 ? "secondary" : "destructive"} className="bg-opacity-20">
                                        {i === 1 ? "Approved" : "Pending"}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6 space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Document Requests</CardTitle>
                        <CardDescription>Apply for Bonafide, Migration, Transcripts, etc.</CardDescription>
                    </CardHeader>
                     <CardContent className="grid md:grid-cols-3 gap-6">
                        {["Bonafide Certificate", "Migration Certificate", "Transcript Request", "Rank Certificate"].map((doc, i) => (
                             <div key={i} className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-colors cursor-pointer group flex flex-col items-center text-center">
                                <FileText className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-white font-medium">{doc}</h3>
                                <Button variant="link" className="text-blue-400 h-auto p-0 mt-2">Apply Now</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

             <TabsContent value="biometric" className="mt-6 space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                         <CardTitle className="text-white flex items-center gap-2">
                            <Fingerprint className="w-5 h-5 text-emerald-400" /> Biometric Logs
                         </CardTitle>
                         <CardDescription>Last 7 days entry/exit logs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-white/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-gray-300">Date</TableHead>
                                        <TableHead className="text-gray-300">Time</TableHead>
                                        <TableHead className="text-gray-300">Location</TableHead>
                                        <TableHead className="text-gray-300">Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { date: "2024-12-31", time: "08:30 PM", loc: "Main Gate", type: "IN" },
                                        { date: "2024-12-31", time: "06:00 PM", loc: "Main Gate", type: "OUT" },
                                        { date: "2024-12-30", time: "08:15 PM", loc: "Hostel Block 1", type: "IN" },
                                    ].map((log, i) => (
                                         <TableRow key={i} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="text-gray-300">{log.date}</TableCell>
                                            <TableCell className="text-white font-mono">{log.time}</TableCell>
                                            <TableCell className="text-gray-300">{log.loc}</TableCell>
                                            <TableCell>
                                                <Badge className={log.type === "IN" ? "bg-emerald-600" : "bg-rose-600"}>{log.type}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}
