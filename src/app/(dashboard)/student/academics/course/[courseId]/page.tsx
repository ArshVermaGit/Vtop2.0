"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, FileText, Download, Users, PlayCircle, Folder } from "lucide-react"

// Mock data fetcher would go here in full implementation
export default function CoursePage({ params }: { params: { courseId: string } }) {
  // Mock data falling back to params or default
  const course = {
    code: params?.courseId || "CSE3002",
    title: "Compiler Design",
    credits: 4,
    faculty: "Dr. Priya V.",
    progress: 75
  }

  const materials = [
    { title: "Module 1: Introduction to Compilers", type: "PPT", size: "2.5 MB" },
    { title: "Module 2: Lexical Analysis", type: "PDF", size: "1.8 MB" },
    { title: "Lab Manual: Experiments 1-5", type: "DOC", size: "3.2 MB" },
  ]

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-3xl font-bold text-white tracking-tight">{course.title}</h1>
                   <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-lg">{course.code}</Badge>
               </div>
               <p className="text-gray-400 flex items-center gap-2">
                   <Users className="w-4 h-4" /> {course.faculty}
               </p>
           </div>
           <div className="bg-white/5 border border-white/10 p-4 rounded-lg min-w-[250px]">
               <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-300">Course Progress</span>
                   <span className="text-white font-bold">{course.progress}%</span>
               </div>
               <Progress value={course.progress} className="h-2 bg-black/40" />
           </div>
        </div>

        <Tabs defaultValue="materials" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start">
                <TabsTrigger value="materials" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white min-w-[120px]">Materials</TabsTrigger>
                <TabsTrigger value="assignments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white min-w-[120px]">Assignments</TabsTrigger>
                <TabsTrigger value="recordings" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white min-w-[120px]">Recordings</TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="mt-6 space-y-4">
                 {materials.map((mat, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors group">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">{mat.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <Badge variant="secondary" className="bg-white/5 text-gray-400">{mat.type}</Badge>
                                        <span>{mat.size}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                                <Download className="w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                 ))}
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
                <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-lg">
                    <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No active assignments at the moment.</p>
                </div>
            </TabsContent>

             <TabsContent value="recordings" className="mt-6">
                 <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-lg">
                    <PlayCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No class recordings available.</p>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  )
}
