"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Users } from "lucide-react"

export default function QCMPage() {
  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Quality Circle Meeting (QCM)</h1>
           <p className="text-gray-400 mt-1">Minutes of meetings and feedback reports</p>
        </div>

        <Card className="bg-white/5 border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Meeting Minutes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">QCM #{i} - Fall Semester</h3>
                                <p className="text-gray-400 text-sm mt-1">Held on {i === 1 ? '10 Aug 2024' : '15 Sep 2024'}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="text-gray-400 border-white/10">Placement Issues</Badge>
                                    <Badge variant="outline" className="text-gray-400 border-white/10">Mess Food</Badge>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 whitespace-nowrap">
                            <Download className="w-4 h-4 mr-2" /> Download Minutes
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  )
}
