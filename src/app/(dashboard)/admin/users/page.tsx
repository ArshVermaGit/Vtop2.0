import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, UserPlus, Search, Edit2, Trash2, Key } from "lucide-react"

export default async function UserManagementPage() {
  const users = [
    { name: "System Admin", role: "ADMIN", username: "admin", status: "Active" },
    { name: "Dr. John Smith", role: "FACULTY", username: "faculty1", status: "Active" },
    { name: "Arsh Verma", role: "STUDENT", username: "student1", status: "Active" },
    { name: "Mr. Verma", role: "PARENT", username: "parent1", status: "Active" },
  ]

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                   <Shield className="w-8 h-8 text-rose-500" /> User Orchestration
               </h1>
               <p className="text-gray-400 mt-1">Global user account and permissions management</p>
           </div>
           <Button className="bg-rose-600 hover:bg-rose-700">
                <UserPlus className="w-4 h-4 mr-2" /> provision User
           </Button>
        </div>

        <Card className="bg-white/5 border-white/10">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-white">Active Catalog</CardTitle>
                        <CardDescription>Manage credentials and role hierarchies</CardDescription>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input placeholder="Search users..." className="pl-9 bg-black/20 border-white/10 text-white w-[250px]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-gray-300">Identity</TableHead>
                                <TableHead className="text-gray-300">Access Role</TableHead>
                                <TableHead className="text-gray-300">Network ID</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                                <TableHead className="text-gray-300 text-right">Operations</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors group">
                                    <TableCell className="text-white font-medium">{user.name}</TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "bg-opacity-20 border",
                                            user.role === 'ADMIN' ? 'bg-rose-500 text-rose-500 border-rose-500/30' : 
                                            user.role === 'FACULTY' ? 'bg-blue-500 text-blue-500 border-blue-500/30' :
                                            user.role === 'STUDENT' ? 'bg-emerald-500 text-emerald-500 border-emerald-500/30' :
                                            'bg-purple-500 text-purple-500 border-purple-500/30'
                                        )}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 font-mono text-xs">{user.username}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs uppercase font-bold tracking-tighter">{user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                           <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400 h-8 w-8">
                                                <Edit2 className="w-3.5 h-3.5" />
                                           </Button>
                                           <Button variant="ghost" size="icon" className="hover:bg-amber-500/10 hover:text-amber-400 h-8 w-8">
                                                <Key className="w-3.5 h-3.5" />
                                           </Button>
                                           <Button variant="ghost" size="icon" className="hover:bg-rose-500/10 hover:text-rose-500 h-8 w-8">
                                                <Trash2 className="w-3.5 h-3.5" />
                                           </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
