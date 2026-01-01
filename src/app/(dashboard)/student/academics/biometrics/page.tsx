import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBiometricReports } from "@/lib/actions"

export default async function BiometricsPage() {
  const logs = await getBiometricReports()

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
           <div>
               <h1 className="text-3xl font-bold tracking-tight text-emerald-400 flex items-center gap-3">
                   <Fingerprint className="w-8 h-8" /> Biometric Reports
               </h1>
               <p className="text-gray-400 mt-1">Real-time campus entry and exit logs captured via biometric sensors</p>
           </div>
           <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 px-4 py-1">DEVICE SYNCED</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Total Entries (Dec)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">42</div>
                </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Total Exits (Dec)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">41</div>
                </CardContent>
            </Card>
            <Card className="bg-emerald-600/10 border-emerald-500/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-emerald-400">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">INSIDE CAMPUS</div>
                </CardContent>
            </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Recent Biometric Activity</CardTitle>
                <CardDescription>Click on a row to view device metadata</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-gray-300">Date</TableHead>
                                <TableHead className="text-gray-300">Check-In</TableHead>
                                <TableHead className="text-gray-300">Check-Out</TableHead>
                                <TableHead className="text-gray-300">Location</TableHead>
                                <TableHead className="text-gray-300 text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length > 0 ? logs.map((log, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                                    <TableCell className="text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-emerald-500" />
                                            {new Date(log.date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white font-mono">
                                        {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                                    </TableCell>
                                    <TableCell className="text-white font-mono">
                                        {log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-xs">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            Main Gate (Sensor 04)
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={log.status === 'PRESENT' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20' : 'bg-rose-600/20 text-rose-400 border-rose-500/20'}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-gray-500 italic">
                                        No biometric logs found for the current period.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
