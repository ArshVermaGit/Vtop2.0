import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin, Building, Briefcase, ShieldCheck, Heart, Camera, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFacultyProfile } from "@/lib/actions"
import Image from "next/image"

export default async function FacultyProfilePage() {
  const profile = await getFacultyProfile()

  if (!profile) return <div className="p-12 text-center text-gray-500">Profile not found. Please ensure you are logged in.</div>

  const personalDetails = [
    { label: "Date of Birth", value: profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Blood Group", value: profile.bloodGroup || "N/A", icon: Heart },
    { label: "Designation", value: profile.designation, icon: Briefcase },
    { label: "School", value: profile.school, icon: Building },
    { label: "Cabin", value: profile.cabin, icon: MapPin },
  ]

  const registrationDetails = [
    { label: "Joining Date", value: profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Employee ID", value: profile.empId, icon: Briefcase },
    { label: "APAAR ID", value: profile.apaarId || "N/A", icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
             <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs text-purple-400 hover:bg-purple-500/10">
                <Camera className="w-3 h-3 mr-2" /> Update Avatar
             </Button>
        </div>
        
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
          {profile.photoUrl ? (
            <Image src={profile.photoUrl} alt={profile.user.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              {profile.user.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-center lg:justify-start">
             <h1 className="text-4xl font-bold text-white tracking-tight">{profile.user.name}</h1>
             <Badge className="w-fit mx-auto lg:mx-0 bg-purple-600/20 text-purple-400 border border-purple-500/30">FACULTY MEMBER</Badge>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 text-gray-400 text-sm">
             <div className="flex items-center gap-2"> <Briefcase className="w-4 h-4 text-purple-400" /> {profile.designation} </div>
             <div className="flex items-center gap-2"> <Building className="w-4 h-4 text-blue-400" /> {profile.school} </div>
             <div className="flex items-center gap-2"> <MapPin className="w-4 h-4 text-rose-400" /> Cabin: {profile.cabin} </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">My Info</TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Employment & Compliance</TabsTrigger>
          <TabsTrigger value="acknowledgement" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white px-6">Acknowledgement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" /> Faculty Dossier
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        {personalDetails.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/5">
                                <detail.icon className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{detail.label}</p>
                                    <p className="text-white font-medium">{detail.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-rose-400 flex items-center gap-2">
                                <Heart className="w-4 h-4" /> Emergency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Contact Name</p>
                                <p className="text-white font-medium">{profile.emergencyName || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Phone Number</p>
                                <p className="text-white font-mono">{profile.emergencyPhone || "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Official Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Extension / Mobile</p>
                                <p className="text-white font-mono">{profile.mobile}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">VIT Mail ID</p>
                                <p className="text-white font-medium truncate">{profile.user.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
             <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Registration & Academic Credentials</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    {registrationDetails.map((detail, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
                                <detail.icon className="w-3 h-3" /> {detail.label}
                            </p>
                            <p className="text-white font-medium">{detail.value}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">System Access Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase">Portal Username</p>
                            <p className="text-lg font-bold text-white font-mono uppercase">{profile.user.username}</p>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">MFA ENABLED</Badge>
                     </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="acknowledgement" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Faculty Acknowledgement View</CardTitle>
                    <CardDescription>Academic integrity and professional conduct declaration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-sm text-gray-400 leading-relaxed">
                        <h4 className="text-white font-bold mb-4">Professional Ethics Declaration</h4>
                        <p className="mb-4">I, <strong>{profile.user.name}</strong>, employee ID <strong>{profile.empId}</strong>, hereby declare that I will uphold the highest standards of academic integrity and professional ethics as prescribed by VIT Bhopal University.</p>
                        <p className="mb-4">I acknowledge my responsibility as a mentor and educator to provide fair assessment and guidance to all students without bias.</p>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                        <div>
                            <p className="text-white font-bold text-sm">Verified Faculty Signature</p>
                            <p className="text-[10px] text-gray-500">DIGITALLY SIGNED VIA ERP-SECURE • {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FingerprintIcon(props: any) {
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
            <path d="M12 10a2 2 0 0 0-2 2c0 .24.01.48.04.7" />
            <path d="M7 10a5 5 0 0 1 10 0c0 .49-.02.99-.06 1.48" />
            <path d="M3.3 7a9 9 0 0 1 17.4 0" />
            <path d="M12 22v-4" />
            <path d="M8 22v-4" />
            <path d="M16 22v-4" />
        </svg>
    )
}
