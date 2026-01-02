"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { getServiceRequests, createServiceRequest } from "@/lib/service-actions"
import { useEffect } from "react"

export default function TranscriptPage() {
  const [type, setType] = useState("official")
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const data = await getServiceRequests()
      setRequests(data)
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleRequest = async () => {
    setLoading(true)
    try {
        await createServiceRequest("TRANSCRIPT")
        toast.success("Transcript request submitted successfully!")
        loadRequests()
    } catch (error) {
        toast.error("Failed to submit request")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Transcript Request</h1>
        <p className="text-gray-400">Request official or unofficial transcripts for higher studies or placements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 md:col-span-1">
            <CardHeader>
                <CardTitle>New Request</CardTitle>
                <CardDescription>Submit a new transcript request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Transcript Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-black/20 border-white/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="official">Official (Sealed)</SelectItem>
                            <SelectItem value="unofficial">Unofficial (Digital)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Number of Copies</Label>
                    <Input type="number" min="1" defaultValue="1" className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input placeholder="e.g. Higher Studies Application" className="bg-black/20 border-white/10" />
                </div>
                <Button onClick={handleRequest} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? "Submitting..." : "Submit Request"}
                </Button>
            </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 md:col-span-1">
            <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>Status of your previous requests</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No previous requests found.</p>
                    ) : requests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{req.type === 'TRANSCRIPT' ? 'Official Transcript' : req.type}</p>
                                    <p className="text-xs text-gray-400">Req #{req.id.slice(-6)} • {new Date(req.requestDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className={cn("px-2 py-1 rounded text-xs font-medium",
                                req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                                req.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' :
                                'bg-red-500/10 text-red-400'
                            )}>
                                {req.status}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
