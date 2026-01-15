"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, Upload, MessageSquare, Bell, BookOpen, Send, CheckCircle2, Clock } from "lucide-react"
import { submitAssignment, postForumPost, postForumReply } from "@/lib/actions"
import { toast } from "sonner"
import { format } from "date-fns"

export default function CourseContentClient({ course }: { course: { id: string, code: string, title: string, type: string, credits: number, slot: string | null, faculty?: { user: { name: string } } | null, materials: { id: string, title: string, type: string, createdAt: string | Date }[], assignments: { id: string, title: string, dueDate: string | Date, description: string | null, submissions: { id: string }[] }[], announcements: { id: string, title: string, content: string, createdAt: string | Date }[], forumPosts: { id: string, title: string, content: string, createdAt: string | Date, author: { name: string }, replies: { id: string, content: string, createdAt: string | Date, author: { name: string } }[] }[] } }) {
  const [activeTab, setActiveTab] = useState("materials")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [replies, setReplies] = useState<Record<string, string>>({})

  const handleAssignmentSubmit = async (assignmentId: string) => {
    setIsSubmitting(true)
    try {
      // Mocking file upload for now
      await submitAssignment(assignmentId, "https://example.com/submission.pdf")
      toast.success("Assignment submitted successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit assignment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostForumPost = async () => {
    if (!newPost.title || !newPost.content) return
    try {
      await postForumPost(course.id, newPost.title, newPost.content)
      toast.success("Post created!")
      setNewPost({ title: "", content: "" })
    } catch (error) {
      console.error(error)
      toast.error("Failed to create post.")
    }
  }

  const handlePostReply = async (postId: string) => {
    const content = replies[postId]
    if (!content) return
    try {
      await postForumReply(postId, content)
      toast.success("Reply posted!")
      setReplies(prev => ({ ...prev, [postId]: "" }))
    } catch (error) {
      console.error(error)
      toast.error("Failed to post reply.")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/5 border-white/10 overflow-hidden">
             <div className="h-2 w-full bg-blue-600" />
             <CardHeader>
                <Badge variant="outline" className="w-fit text-[10px] font-bold uppercase tracking-widest border-blue-500/30 text-blue-400 mb-2">
                    {course.code}
                </Badge>
                <CardTitle className="text-white text-xl">{course.title}</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                    {course.type} • {course.credits} Credits • {course.slot}
                </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-0">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold uppercase text-xs">
                        {course.faculty?.user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Faculty</p>
                        <p className="text-white font-bold text-sm leading-tight">{course.faculty?.user.name}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-white font-black text-lg">88%</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Attendance</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-white font-black text-lg">S</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Grade Est.</p>
                    </div>
                </div>
             </CardContent>
          </Card>
      </div>

      <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
              <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Materials
              </TabsTrigger>
              <TabsTrigger value="assignments" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest gap-2">
                <FileText className="w-3.5 h-3.5" /> Assignments
              </TabsTrigger>
              <TabsTrigger value="announcements" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest gap-2">
                <Bell className="w-3.5 h-3.5" /> Announcements
              </TabsTrigger>
              <TabsTrigger value="forum" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Forum
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.materials.map((m: { id: string, title: string, type: string, createdAt: string | Date }) => (
                        <div key={m.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{m.title}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">{m.type} • {format(new Date(m.createdAt), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-gray-500 hover:text-white hover:bg-white/10">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                 </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
                 {course.assignments.map((a: { id: string, title: string, dueDate: string | Date, description: string | null, submissions: { id: string }[] }) => (
                    <Card key={a.id} className="bg-white/5 border-white/10 group hover:border-purple-500/30 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-white text-md">{a.title}</CardTitle>
                                <CardDescription className="text-xs text-rose-400 font-bold uppercase mt-1 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Due: {format(new Date(a.dueDate), 'MMM dd, yyyy')}
                                </CardDescription>
                            </div>
                            {a.submissions.length > 0 ? (
                                <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3 mr-1.5" /> SUBMITTED
                                </Badge>
                            ) : (
                                <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/20">PENDING</Badge>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-gray-400 text-xs leading-relaxed">{a.description}</p>
                             <div className="flex items-center gap-3 pt-2">
                                <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white h-9 px-4 uppercase text-[10px] font-bold tracking-wider">
                                    <Download className="w-3.5 h-3.5 mr-2" /> Download Task
                                </Button>
                                <Button 
                                    size="sm" 
                                    className="bg-purple-600 hover:bg-purple-700 text-white h-9 px-4 uppercase text-[10px] font-bold tracking-wider"
                                    onClick={() => handleAssignmentSubmit(a.id)}
                                    disabled={isSubmitting}
                                >
                                    <Upload className="w-3.5 h-3.5 mr-2" /> {a.submissions.length > 0 ? "Re-submit" : "Upload Work"}
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                 ))}
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4">
                 {course.announcements.map((an: { id: string, title: string, content: string, createdAt: string | Date }) => (
                    <div key={an.id} className="p-6 rounded-2xl bg-amber-600/5 border border-amber-500/10 space-y-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Bell className="w-12 h-12 text-amber-400" />
                        </div>
                        <div className="flex justify-between items-start">
                             <h4 className="text-amber-400 font-bold text-lg">{an.title}</h4>
                             <span className="text-[10px] text-gray-500 uppercase font-black">{format(new Date(an.createdAt), 'MMM dd')}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed relative z-10">{an.content}</p>
                    </div>
                 ))}
            </TabsContent>

            <TabsContent value="forum" className="space-y-6">
                 <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-md">Start a Discussion</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input 
                            placeholder="Discussion Title" 
                            className="bg-black/20 border-white/5 text-white"
                            value={newPost.title}
                            onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea 
                            placeholder="Share your thoughts or ask a doubt..." 
                            className="bg-black/20 border-white/5 text-white min-h-[100px]"
                            value={newPost.content}
                            onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        />
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full uppercase text-xs font-bold tracking-widest py-6" onClick={handlePostForumPost}>
                            <Send className="w-4 h-4 mr-2" /> Post to Forum
                        </Button>
                    </CardContent>
                 </Card>

                 <div className="space-y-4">
                    {course.forumPosts.map((post: { id: string, title: string, content: string, createdAt: string | Date, author: { name: string }, replies: { id: string, content: string, createdAt: string | Date, author: { name: string } }[] }) => (
                        <div key={post.id} className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                        {post.author.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm">{post.title}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-black">
                                            {post.author.name} • {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed pl-11">{post.content}</p>
                                <div className="pl-11 pt-4 space-y-3">
                                    {post.replies.map((reply: any) => (
                                        <div key={reply.id} className="p-3 rounded-xl bg-black/20 border border-white/5 flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-[10px]">
                                                {reply.author.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] text-blue-400 font-black uppercase">{reply.author.name}</span>
                                                    <span className="text-[8px] text-gray-600">{format(new Date(reply.createdAt), 'hh:mm a')}</span>
                                                </div>
                                                <p className="text-gray-400 text-xs">{reply.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 items-end">
                                        <Textarea 
                                            placeholder="Write a reply..." 
                                            className="bg-black/20 border-white/5 text-white min-h-[40px] text-xs py-2"
                                            value={replies[post.id] || ""}
                                            onChange={e => setReplies(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        />
                                        <Button size="sm" variant="secondary" className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border-none h-10 px-4" onClick={() => handlePostReply(post.id)}>
                                            <Send className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  )
}
