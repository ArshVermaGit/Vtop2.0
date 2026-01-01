"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertTriangle, Calendar } from "lucide-react"

export default function FeesIntimationPage() {
  const fees = [
    { year: "2024-25", semester: "Winter", head: "Tuition Fee", amount: "₹1,98,000", status: "PENDING", dueDate: "15 Jan 2025" },
    { year: "2024-25", semester: "Winter", head: "Hostel Fee", amount: "₹1,45,000", status: "PENDING", dueDate: "15 Jan 2025" },
    { year: "2024-25", semester: "Winter", head: "Mess Fee", amount: "₹35,000", status: "PENDING", dueDate: "15 Jan 2025" },
  ]

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Fees Intimation</h1>
           <p className="text-gray-400 mt-1">Detailed breakup of fees for the current and upcoming sessions</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 md:col-span-3">
                <CardHeader>
                    <CardTitle className="text-white">Fee Details - Winter 2024-25</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-gray-300">Head</TableHead>
                                <TableHead className="text-gray-300">Amount</TableHead>
                                <TableHead className="text-gray-300">Due Date</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fees.map((f, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="text-white font-medium">{f.head}</TableCell>
                                    <TableCell className="text-white">{f.amount}</TableCell>
                                    <TableCell className="text-gray-400">{f.dueDate}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/20">
                                            {f.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="border-white/10 bg-white/5 font-bold">
                                <TableCell className="text-white">TOTAL PAYABLE</TableCell>
                                <TableCell className="text-white text-lg">₹3,78,000</TableCell>
                                <TableCell colSpan={2}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="space-y-6">
                 <Card className="bg-rose-900/10 border-rose-500/20 text-rose-400">
                    <CardContent className="pt-6 space-y-2">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p className="text-sm font-bold uppercase">Payment Deadline</p>
                        <div className="text-2xl font-bold text-white">15 DAYS LEFT</div>
                        <p className="text-xs opacity-60">Late fee of ₹500/day applies after deadline.</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-400 uppercase tracking-wider">Bank Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Pay via SBI</Button>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Pay via ICICI</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
