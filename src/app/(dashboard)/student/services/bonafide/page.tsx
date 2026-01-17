import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Send, Info } from "lucide-react"
import { getServiceRequests } from "@/lib/actions"

export default async function BonafidePage() {
  const requests = await getServiceRequests()
  const bonafideRequests = requests.filter(r => r.type === "Bonafide")

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Bonafide Certificate</h1>
           <p className="text-gray-400 mt-1">Apply for official university certification for bank, visa, or scholarship purposes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Apply New Certificate</CardTitle>
                    <CardDescription>Standard processing time: 24-48 working hours.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Purpose of Certificate</Label>
                        <select className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="bank">Bank Account Opening</option>
                            <option value="visa">Visa Application (NOC)</option>
                            <option value="scholarship">External Scholarship</option>
                            <option value="passport">Passport Application</option>
                            <option value="other">Others</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Detailed Reason</Label>
                        <Input placeholder="Mention specific bank/organization name" className="bg-black/20 border-white/10 text-white" />
                    </div>
                    
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3 text-blue-400 text-xs">
                        <Info className="w-5 h-5 shrink-0" />
                        <p>E-Bonafide will be available for download in the &quot;Digital Credentials&quot; section once approved.</p>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                        <Send className="w-4 h-4 mr-2" /> Application Submission
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Application Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bonafideRequests.length > 0 ? bonafideRequests.map((req, i) => (
                            <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Bonafide Request</p>
                                        <p className="text-[10px] text-gray-500">{new Date(req.requestDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className={req.status === 'COMPLETED' ? 'bg-green-600' : 'bg-amber-600'}>
                                        {req.status}
                                    </Badge>
                                    {req.status === 'COMPLETED' && (
                                        <p className="text-[10px] text-blue-400 mt-1 cursor-pointer hover:underline">Download PDF</p>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-gray-500 italic text-sm">No recent applications.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
