"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Rocket, Target, FileCheck, AlertCircle } from "lucide-react"

export default function FinalYearPage() {
  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Final Year Registration</h1>
           <p className="text-gray-400 mt-1">Manage Capstone Project, Internships and Final Semester Registration</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" /> Capstone Project Phase-1
                    </CardTitle>
                    <CardDescription>Registration for your final year major project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Team Selection Status</span>
                            <Badge className="bg-green-600/20 text-green-400">COMPLETED</Badge>
                        </div>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                            <p className="text-gray-400 text-xs uppercase mb-2">Team Members</p>
                            <ul className="text-white text-sm space-y-1">
                                <li>• Arsh Verma (Leader)</li>
                                <li>• Rahul S. (Member)</li>
                                <li>• Ananya K. (Member)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Guide Allotment</span>
                            <Badge className="bg-amber-600/20 text-amber-400">IN PROGRESS</Badge>
                        </div>
                        <Progress value={45} className="h-2 bg-black/40" />
                        <p className="text-xs text-gray-500 text-center">Awaiting confirmation from Dr. Priya V.</p>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <FileCheck className="w-4 h-4 mr-2" /> Register Project Title
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-6">
                 <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
                    <CardHeader>
                         <CardTitle className="text-purple-400 flex items-center gap-2">
                            <Rocket className="w-5 h-5" /> Internship Status
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-white font-medium">8th Semester Fast-Track</div>
                        <Badge variant="outline" className="text-gray-400 border-white/10">ELIGIBLE</Badge>
                        <p className="text-xs text-gray-400">You are eligible to apply for industry internships in the final semester.</p>
                        <Button variant="outline" className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10">Apply for Migration</Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-amber-400 flex items-center gap-2">
                             <AlertCircle className="w-4 h-4" /> Important Notice
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Final year students must ensure all core credits are cleared before registering for Capstone Phase-2. Refer to the handbook for project guidelines.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
