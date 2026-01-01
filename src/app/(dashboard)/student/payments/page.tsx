import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, ExternalLink, Filter } from "lucide-react"
import { getPayments } from "@/lib/actions"

export default async function PaymentsPage() {
  const payments = await getPayments()

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Payments & Receipts</h1>
               <p className="text-gray-400 mt-1">Manage your fee payments and download digital receipts</p>
           </div>
           <div className="flex gap-3">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" /> Export Statement
                </Button>
           </div>
        </div>

        <Card className="bg-white/5 border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-gray-300">Transaction ID</TableHead>
                            <TableHead className="text-gray-300">Description</TableHead>
                            <TableHead className="text-gray-300">Date</TableHead>
                            <TableHead className="text-gray-300">Amount</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-right text-gray-300">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length > 0 ? payments.map((item, i) => (
                            <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors">
                                <TableCell className="font-mono text-xs text-blue-400">{item.id}</TableCell>
                                <TableCell className="text-white font-medium">{item.description}</TableCell>
                                <TableCell className="text-gray-400 text-sm">
                                    {new Date(item.paidDate || item.dueDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-white font-bold">₹{item.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge className={item.status === 'PAID' ? 'bg-green-600/20 text-green-400' : 'bg-amber-600/20 text-amber-400'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                                        <Download className="w-4 h-4 mr-2" /> Receipt
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500 italic">No transaction records found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
