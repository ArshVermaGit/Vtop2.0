import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Bed, User, ShieldCheck, MapPin, Coffee } from "lucide-react"
import { getStudentProfile } from "@/lib/actions"

export default async function HostelAllotmentPage() {
  const profile = await getStudentProfile()

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <Home className="w-8 h-8 text-amber-400" /> Hostel Room Allotment
           </h1>
           <p className="text-gray-400 mt-1">View and manage your current residential accommodation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 lg:col-span-2 overflow-hidden">
                <div className="h-32 bg-linear-to-r from-amber-600/20 to-rose-600/20 border-b border-white/10 flex items-end p-6">
                    <h2 className="text-2xl font-bold text-white">Current Stay: {profile?.hostelBlock}</h2>
                </div>
                <CardContent className="p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <Bed className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Room Number</p>
                                    <p className="text-xl font-bold text-white">{profile?.hostelRoom || "NOT ALLOTTED"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Occupancy Type</p>
                                    <p className="text-xl font-bold text-white">Double Bed (AC)</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <Coffee className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Mess Preference</p>
                                    <p className="text-xl font-bold text-white">{profile?.hostelMess || "VEG-MESS"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Safety Compliance</p>
                                    <p className="text-xl font-bold text-white">Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-rose-500" /> Block Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {["High Speed WiFi", "24/7 Water", "Gym Access", "Laundry", "Common Room"].map((tag) => (
                                <Badge key={tag} className="bg-white/5 text-gray-400 border-white/10 hover:bg-white/10">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Roommates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">RK</div>
                            <div>
                                <p className="text-sm font-medium text-white">Rahul Kumar</p>
                                <p className="text-xs text-gray-500">21BCE1002 • SCSE</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>

                <div className="p-6 rounded-2xl bg-linear-to-br from-amber-600/20 to-transparent border border-white/10">
                    <h3 className="text-white font-bold mb-2">Room Change Request</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">Request for a room change within the same block or different block for next semester.</p>
                    <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                        Apply for Change
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
