import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  MapPin, 
  Trophy, 
  Zap, 
  ArrowRight, 
  Search, 
  Filter, 
  Info, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from "lucide-react"
import { getClubsAndEvents } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ClubHubPage() {
  const data = await getClubsAndEvents()
  const { clubs = [], events = [] } = (data || {}) as { clubs: any[], events: any[] }

  const technicalClubs = clubs.filter(c => c.category === 'TECHNICAL')
  const culturalClubs = clubs.filter(c => c.category === 'CULTURAL')

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-purple-500" /> Club Hub
          </h1>
          <p className="text-gray-400 mt-1">Student Organizations, Communities & Technical Chapters</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> Start a Club
           </Button>
           <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/20 px-4 py-1 uppercase font-black text-[9px]">200+ Active Communities</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: EVENT GALLERY */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-amber-400" />
                            <CardTitle className="text-white text-lg">Upcoming Events & Workshops</CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] text-gray-500 hover:text-white uppercase font-black">View All</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {events.length > 0 ? events.map((event) => (
                            <div key={event.id} className="p-6 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="hidden md:flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white">
                                            <span className="text-[10px] font-black uppercase text-gray-500">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-xl font-black">{new Date(event.date).getDate()}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-white font-black text-lg tracking-tight uppercase group-hover:text-amber-400 transition-colors">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <p className="text-[11px] text-purple-400 font-bold uppercase">{event.club.name}</p>
                                                <span className="text-gray-700">•</span>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-black">
                                                    <MapPin className="w-3 h-3" /> {event.location}
                                                </div>
                                                <span className="text-gray-700">•</span>
                                                <Badge className="bg-emerald-600/10 text-emerald-500 border-emerald-500/20 text-[7px] uppercase font-black h-4">
                                                    +{event.points} EXC Points
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="bg-white/10 border border-white/10 text-white hover:bg-white hover:text-black font-black uppercase text-[9px] tracking-widest h-10 px-6 transition-all shrink-0">
                                        Register
                                    </Button>
                                </div>
                            </div>
                        )) : (
                           <div className="p-12 text-center text-gray-600 uppercase text-[10px] font-black">No upcoming events found</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                         <CardTitle className="text-white text-md flex items-center gap-2">
                             <Zap className="w-5 h-5 text-indigo-400" /> Technical Chapters
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         {technicalClubs.map((club) => (
                             <div key={club.id} className="p-5 hover:bg-white/[0.02] transition-colors border-b border-white/5 group flex items-start justify-between">
                                 <div className="space-y-1">
                                     <h4 className="text-white font-bold text-sm tracking-tight">{club.name}</h4>
                                     <p className="text-[11px] text-gray-500 line-clamp-1">{club.description}</p>
                                     <div className="pt-1">
                                         {club.members.length > 0 ? (
                                             <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/20 text-[7px] uppercase font-black">Member</Badge>
                                         ) : (
                                             <span className="text-[8px] text-gray-700 uppercase font-black">Not Joined</span>
                                         )}
                                     </div>
                                 </div>
                                 <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all" />
                             </div>
                         ))}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
                         <CardTitle className="text-white text-md flex items-center gap-2">
                             <CheckCircle2 className="w-5 h-5 text-rose-400" /> Cultural & Arts
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         {culturalClubs.map((club) => (
                             <div key={club.id} className="p-5 hover:bg-white/[0.02] transition-colors border-b border-white/5 group flex items-start justify-between">
                                 <div className="space-y-1">
                                     <h4 className="text-white font-bold text-sm tracking-tight">{club.name}</h4>
                                     <p className="text-[11px] text-gray-500 line-clamp-1">{club.description}</p>
                                     <div className="pt-1">
                                         {club.members.length > 0 ? (
                                             <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/20 text-[7px] uppercase font-black">Member</Badge>
                                         ) : (
                                             <span className="text-[8px] text-gray-700 uppercase font-black">Not Joined</span>
                                         )}
                                     </div>
                                 </div>
                                 <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all" />
                             </div>
                         ))}
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* RIGHT COLUMN: STATS & DISCOVER */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                     <Users className="w-32 h-32 text-white" />
                 </div>
                 <CardHeader>
                     <p className="text-[10px] text-white/50 uppercase font-black tracking-widest italic leading-tight">My Community Engagement</p>
                     <CardTitle className="text-white text-2xl font-black uppercase">Active Member</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6 relative z-10 py-2">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                             <p className="text-white font-black text-2xl tracking-tighter italic">{clubs.filter(c => c.members.length > 0).length}</p>
                             <p className="text-[9px] text-white/50 font-black uppercase">Clubs Joined</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                             <p className="text-white font-black text-2xl tracking-tighter italic">00</p>
                             <p className="text-[9px] text-white/50 font-black uppercase">Roles Held</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-black/20 border border-white/10">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <div className="space-y-0.5">
                              <p className="text-white font-bold text-[10px] uppercase">Profile Verified</p>
                              <p className="text-[9px] text-white/50">Approved for Coordinator roles.</p>
                          </div>
                      </div>
                 </CardContent>
                 <div className="h-2 bg-white/20" />
            </Card>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                    placeholder="Search clubs, genres, keywords..." 
                    className="w-full bg-white/5 border-white/10 pl-11 text-white text-xs placeholder:text-gray-600 focus:border-purple-500/50 transition-all rounded-xl h-12 shadow-lg"
                />
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-sm uppercase tracking-widest font-black flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" /> Points Recap (EXC)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Technical Events</p>
                        <p className="text-white font-black">25 pts</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Cultural Participation</p>
                        <p className="text-white font-black">15 pts</p>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <p className="text-[11px] text-white font-black uppercase">Total EXC Credits</p>
                            <p className="text-xl text-emerald-400 font-black">40</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4">
                 <h4 className="text-white font-black text-xs uppercase tracking-widest">Resources</h4>
                 <div className="space-y-3">
                     <div className="flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-3">
                             <Info className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                             <p className="text-[11px] text-gray-400 font-bold uppercase">Club Bylaws 2024</p>
                         </div>
                         <ExternalLink className="w-3.5 h-3.5 text-gray-700" />
                     </div>
                     <div className="flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-3">
                             <Trophy className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
                             <p className="text-[11px] text-gray-400 font-bold uppercase">vAchieve Guidelines</p>
                         </div>
                         <ExternalLink className="w-3.5 h-3.5 text-gray-700" />
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
