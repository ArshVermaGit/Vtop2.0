import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, CheckCircle, Clock, Save, Send } from "lucide-react"

export default async function ThesisPage() {
  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Masters / Ph.D Thesis</h1>
           <p className="text-gray-400 mt-1">Official portal for electronic thesis submission and tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Workflow Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { step: "Abstract Approved", status: "completed" },
                            { step: "Literature Review", status: "completed" },
                            { step: "Initial Submission", status: "active" },
                            { step: "External Review", status: "pending" },
                            { step: "Final Viva-Voce", status: "pending" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                {item.status === "completed" ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : item.status === "active" ? (
                                    <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-white/10" />
                                )}
                                <span className={cn(
                                    "text-sm",
                                    item.status === "pending" ? "text-gray-500" : "text-white"
                                )}>{item.step}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="text-white">Electronic Thesis Submission (ETS)</CardTitle>
                    <CardDescription>Submit your processed thesis for plagiarism check and external review.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Thesis Title</Label>
                            <Input placeholder="Detection of Deepfakes using Multi-Modal Learning" className="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">Abstract (Brief Summary)</Label>
                            <Textarea placeholder="Provide a 250-word summary of your research findings..." className="bg-black/20 border-white/10 min-h-[150px] text-white" />
                        </div>
                        
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-colors group cursor-pointer">
                            <FileUp className="w-12 h-12 text-gray-500 mx-auto mb-4 group-hover:text-blue-400 transition-colors" />
                            <h3 className="text-white font-bold">Upload Thesis PDF</h3>
                            <p className="text-xs text-gray-500 mt-2">Maximum file size: 50MB. Format: PDF only.</p>
                            <Button variant="ghost" className="mt-4 text-blue-400 hover:bg-blue-400/10">Browse Files</Button>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end pt-6 border-t border-white/10">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                            <Save className="w-4 h-4 mr-2" /> Save Draft
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4 mr-2" /> Final Submission (Lock)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
