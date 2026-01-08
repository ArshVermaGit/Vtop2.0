"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, Search, Edit2, Trash2, Loader2, Check, X, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { createCourse, deleteCourse, updateCourse } from "@/lib/admin-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Course = {
  id: string
  code: string
  title: string
  credits: number
  type: string
  slot: string | null
  venue: string | null
  category: string | null
  facultyId: string | null
  faculty?: {
    id: string
    user: { name: string }
  } | null
  _count?: {
    registrations: number
  }
}

type Faculty = {
  id: string
  empId: string
  user: { name: string }
}

export function CourseManagementClient({ 
  courses: initialCourses,
  facultyList 
}: { 
  courses: Course[],
  facultyList: Faculty[]
}) {
  const router = useRouter()
  const [courses, setCourses] = useState(initialCourses)
  const [search, setSearch] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    credits: 3,
    type: "Theory",
    slot: "",
    venue: "",
    category: "Program Core",
    facultyId: ""
  })

  const filteredCourses = courses.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const payload = {
        ...formData,
        credits: Number(formData.credits),
        facultyId: formData.facultyId === "none" || !formData.facultyId ? undefined : formData.facultyId
      }
      await createCourse(payload)
      toast.success("Course created successfully!")
      setCreateDialogOpen(false)
      setFormData({
        code: "", title: "", credits: 3, type: "Theory", 
        slot: "", venue: "", category: "Program Core", facultyId: ""
      })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to create course")
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedCourse) return
    setIsLoading(true)
    try {
      const payload = {
        ...formData,
        credits: Number(formData.credits),
        facultyId: formData.facultyId === "none" || !formData.facultyId ? undefined : formData.facultyId
      }
      await updateCourse(selectedCourse.id, payload)
      toast.success("Course updated successfully!")
      setEditDialogOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update course")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCourse) return
    setIsLoading(true)
    try {
      await deleteCourse(selectedCourse.id)
      toast.success("Course deleted successfully!")
      setCourses(courses.filter(c => c.id !== selectedCourse.id))
      setDeleteDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course)
    setFormData({
      code: course.code,
      title: course.title,
      credits: course.credits,
      type: course.type,
      slot: course.slot || "",
      venue: course.venue || "",
      category: course.category || "Program Core",
      facultyId: course.facultyId || "none"
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" /> Course Matrix
          </h1>
          <p className="text-gray-400 mt-1">Academic curriculum and faculty assignment control</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-lg shadow-2xl shadow-blue-500/10">
            <DialogHeader>
              <DialogTitle>Provision New Course</DialogTitle>
              <DialogDescription className="text-gray-400">
                Define a new academic course and assign primary faculty.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Code *</Label>
                  <Input 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    className="bg-white/5 border-white/10"
                    placeholder="e.g., CSE3001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course Title *</Label>
                  <Input 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="bg-white/5 border-white/10"
                    placeholder="e.g., Operating Systems"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Credits *</Label>
                  <Input 
                    type="number"
                    value={formData.credits}
                    onChange={e => setFormData({...formData, credits: Number(e.target.value)})}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="Theory">Theory</SelectItem>
                      <SelectItem value="Lab">Lab</SelectItem>
                      <SelectItem value="Embedded">Embedded</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slot</Label>
                  <Input 
                    value={formData.slot}
                    onChange={e => setFormData({...formData, slot: e.target.value})}
                    className="bg-white/5 border-white/10"
                    placeholder="e.g., A1+TA1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input 
                    value={formData.venue}
                    onChange={e => setFormData({...formData, venue: e.target.value})}
                    className="bg-white/5 border-white/10"
                    placeholder="e.g., AB1-202"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Faculty</Label>
                <Select value={formData.facultyId} onValueChange={v => setFormData({...formData, facultyId: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select faculty member" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="none">None</SelectItem>
                    {facultyList.map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.user.name} ({f.empId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
              <Button onClick={handleCreate} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
                {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Create Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Course Catalog ({filteredCourses.length})</CardTitle>
              <CardDescription>Direct management of university offerings</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search code or title..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-black/20 border-white/10 text-white w-[250px] focus:ring-blue-500/50" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-300">Course Identifier</TableHead>
                  <TableHead className="text-gray-300">Credits/Type</TableHead>
                  <TableHead className="text-gray-300">Faculty Lead</TableHead>
                  <TableHead className="text-gray-300">Slot/Info</TableHead>
                  <TableHead className="text-gray-300 text-right">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                  <TableRow key={course.id} className="border-white/10 hover:bg-white/5 transition-colors group">
                    <TableCell>
                      <div>
                        <p className="text-white font-bold text-sm tracking-tight">{course.title}</p>
                        <p className="text-[10px] text-blue-400 font-mono uppercase font-black">{course.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-white/10 text-white text-[10px]">{course.credits} Credits</Badge>
                        <Badge className={cn(
                          "bg-opacity-20 border text-[10px]",
                          course.type === 'Theory' ? 'bg-emerald-500 text-emerald-500 border-emerald-500/30' : 
                          course.type === 'Lab' ? 'bg-purple-500 text-purple-500 border-purple-500/30' :
                          'bg-amber-500 text-amber-500 border-amber-500/30'
                        )}>
                          {course.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <Users className="w-3 h-3 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-300">{course.faculty?.user.name || "Unassigned"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{course.slot || "No Slot Assigned"}</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="border-none p-0 text-[9px] text-gray-600">Students: {course._count?.registrations || 0}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-blue-500/10 hover:text-blue-400 h-8 w-8"
                          onClick={() => openEditDialog(course)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-rose-500/10 hover:text-rose-500 h-8 w-8"
                          onClick={() => openDeleteDialog(course)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                     <TableCell colSpan={5} className="h-32 text-center text-gray-500 italic">No courses found matching your criteria.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-lg shadow-2xl shadow-blue-500/10">
          <DialogHeader>
            <DialogTitle>Edit Course: {selectedCourse?.code}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update course specifications and assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Credits</Label>
                <Input 
                  type="number"
                  value={formData.credits}
                  onChange={e => setFormData({...formData, credits: Number(e.target.value)})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Embedded">Embedded</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slot</Label>
                <Input 
                  value={formData.slot}
                  onChange={e => setFormData({...formData, slot: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <Input 
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Primary Faculty</Label>
              <Select value={formData.facultyId} onValueChange={v => setFormData({...formData, facultyId: v})}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="none">None</SelectItem>
                  {facultyList.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.user.name} ({f.empId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button onClick={handleEdit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white shadow-2xl shadow-rose-500/10">
          <DialogHeader>
            <DialogTitle className="text-rose-500">Decommission Course</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{selectedCourse?.title}</strong>? 
              This will remove all associated registrations and materials. This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-white/10 hover:bg-white/5">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleDelete} disabled={isLoading} className="bg-rose-600 hover:bg-rose-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
