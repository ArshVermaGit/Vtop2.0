"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, MoreVertical, Edit3, Trash2, UserPlus, Link as LinkIcon, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Parent = {
  id: string
  mobile: string
  user: {
    name: string
    email: string
  }
  student?: {
    regNo: string
    user: { name: string }
  }
}

export function ParentManagementClient({ initialParents }: { initialParents: Parent[] }) {
  const [search, setSearch] = useState("")

  const filteredParents = initialParents.filter((p: Parent) => 
    p.user.name.toLowerCase().includes(search.toLowerCase()) ||
    p.mobile?.includes(search) ||
    p.student?.regNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-amber-500" /> Parent Matrix
          </h1>
          <p className="text-gray-400 mt-1">Guardian relationships and communication channels</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-amber-600/20">
                <UserPlus className="w-4 h-4 mr-2" /> Register Guardian
             </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
         <CardHeader className="bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
               <CardTitle className="text-white text-lg">Guardian Ledger</CardTitle>
               <CardDescription>Manage parent-student linkages and contact information</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Parent Name or Ward Reg No..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-black/20 border-white/5 text-white" 
                />
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead className="bg-black/20">
                  <tr>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Parent / Guardian</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Associated Ward</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Contact Details</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">System Status</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredParents.map((parent: Parent) => (
                    <tr key={parent.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4">
                            <p className="text-white font-bold text-sm">{parent.user.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Guardian</p>
                       </td>
                       <td className="p-4">
                            {parent.student ? (
                                <div>
                                    <p className="text-white text-xs font-semibold">{parent.student.user.name}</p>
                                    <p className="text-[10px] text-amber-500 font-black">{parent.student.regNo}</p>
                                </div>
                            ) : (
                                <Badge variant="outline" className="border-rose-500/20 text-rose-500 text-[9px]">UNLINKED</Badge>
                            )}
                       </td>
                       <td className="p-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Phone className="w-3 h-3" />
                                <p className="text-xs">{parent.mobile || 'No Mobile'}</p>
                            </div>
                            <p className="text-[10px] text-gray-600 truncate max-w-[150px]">{parent.user.email}</p>
                       </td>
                       <td className="p-4">
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 text-[9px] font-black uppercase">Verified</Badge>
                       </td>
                       <td className="p-4 text-right whitespace-nowrap">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 text-white w-48">
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                                        <Edit3 className="w-4 h-4 mr-2" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                                        <LinkIcon className="w-4 h-4 mr-2" /> Link to Ward
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-rose-500 hover:bg-rose-500/10 cursor-pointer">
                                        <Trash2 className="w-4 h-4 mr-2" /> Remove Account
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                           </DropdownMenu>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
      </Card>
    </div>
  )
}
