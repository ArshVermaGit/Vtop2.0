import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin, Building, GraduationCap, School, Landmark, Fingerprint, ShieldCheck, Heart, Camera, FileText, Info, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { getStudentProfile } from "@/lib/actions"
import Image from "next/image"

export default async function ProfilePage() {
  const profile = await getStudentProfile()

  if (!profile) return <div className="p-12 text-center text-gray-500">Profile not found. Please ensure you are logged in.</div>

  const personalDetails = [
    { label: "Date of Birth", value: profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Blood Group", value: profile.bloodGroup || "N/A", icon: Heart },
    { label: "Native Place", value: profile.nativePlace || "N/A", icon: MapPin },
    { label: "Nationality", value: profile.nationality || "Indian", icon: Info },
    { label: "Aadhar Number", value: profile.aadharNo || "N/A", icon: ShieldCheck },
  ]

  const registrationDetails = [
    { label: "Registration Date", value: profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Application Number", value: profile.applicationNo || "N/A", icon: FileText },
    { label: "Registration Number", value: profile.regNo, icon: GraduationCap },
    { label: "Current Batch", value: profile.batch, icon: GraduationCap },
  ]

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
             <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs text-blue-400 hover:bg-blue-500/10">
                <Camera className="w-3 h-3 mr-2" /> Change Photo
             </Button>
        </div>
        
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl group-hover:border-blue-500/30 transition-all">
          {profile.photoUrl ? (
            <Image src={profile.photoUrl} alt={profile.user.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {profile.user.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-center lg:justify-start">
             <h1 className="text-4xl font-bold text-white tracking-tight">{profile.user.name}</h1>
             <Badge className="w-fit mx-auto lg:mx-0 bg-blue-600/20 text-blue-400 border border-blue-500/30">STUDENT</Badge>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 text-gray-400 text-sm">
             <div className="flex items-center gap-2"> <GraduationCap className="w-4 h-4 text-blue-400" /> {profile.program} </div>
             <div className="flex items-center gap-2"> <School className="w-4 h-4 text-purple-400" /> {profile.school} </div>
             <div className="flex items-center gap-2"> <MapPin className="w-4 h-4 text-rose-400" /> Campus: VIT Bhopal </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6">Profile Overview</TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">Academic & Registration</TabsTrigger>
          <TabsTrigger value="credentials" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Credentials</TabsTrigger>
          <TabsTrigger value="acknowledgement" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white px-6">Acknowledgement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Details */}
                <Card className="bg-white/5 border-white/10 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" /> Personal Details
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

                {/* Emergency & Contact */}
                <div className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-rose-400 flex items-center gap-2">
                                <Heart className="w-4 h-4" /> Emergency Contact
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
                                <Phone className="w-4 h-4" /> Reach Me At
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Mobile</p>
                                <p className="text-white font-mono">{profile.mobile}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Email</p>
                                <p className="text-white font-medium truncate">{profile.user.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bank Info */}
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-amber-400" /> Bank Information
                    </CardTitle>
                    <CardDescription>Official student bank account for scholarship and refunds</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Account Holder</p>
                        <p className="text-white font-medium">{profile.user.name}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Account Number</p>
                        <p className="text-white font-mono">{profile.bankAccount || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">IFSC Code</p>
                        <p className="text-white font-mono">{profile.bankIfsc || "N/A"}</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Registration Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        {registrationDetails.map((detail, idx) => (
                            <div key={idx} className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                    <detail.icon className="w-3 h-3" /> {detail.label}
                                </p>
                                <p className="text-white font-medium">{detail.value}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Programme Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-gray-500 text-sm">Programme Type</span>
                            <span className="text-white font-bold">REGULAR / FULL TIME</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-gray-500 text-sm">Duration</span>
                            <span className="text-white font-bold">4 YEARS (8 SEMESTERS)</span>
                        </div>
                         <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-gray-500 text-sm">Language of Instruction</span>
                            <span className="text-white font-bold">ENGLISH</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">Portal User ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-white font-mono uppercase">{profile.user.username}</p>
                        <p className="text-xs text-blue-400 mt-2 flex items-center gap-1"> <ShieldCheck className="w-3 h-3" /> Active Security Token </p>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">APAAR ID (Digital Locker)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-white font-mono">{profile.apaarId || "NOT ASSIGNED"}</p>
                        <div className="flex gap-2 mt-4">
                             <Button size="sm" variant="outline" className="text-xs border-amber-500/20 text-amber-500 hover:bg-amber-500/10 h-8">
                                <Fingerprint className="w-3 h-3 mr-2" /> Verify Bio
                             </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-blue-600/20 to-purple-600/20 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-white">Academic Bank of Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-white font-mono">{profile.abcId || "N/A"}</p>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">SYNCED</Badge>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>

        <TabsContent value="acknowledgement" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Student Acknowledgement View</CardTitle>
                    <CardDescription>Declaration and confirmation of university rules and guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-sm text-gray-400 leading-relaxed max-h-[400px] overflow-y-auto">
                        <h4 className="text-white font-bold mb-4">Terms of Conduct & Academic Integrity</h4>
                        <p className="mb-4">I, <strong>{profile.user.name}</strong>, hereby acknowledge that I have read and understood the University's policy on academic integrity and student conduct. I agree to abide by all rules and regulations set forth by VIT Bhopal University.</p>
                        <p className="mb-4">I understand that any form of academic dishonesty including plagiarism, cheating, or unauthorized collaboration will result in severe disciplinary action.</p>
                        <p className="mb-4">Furthermore, I certify that all personal and academic information provided in this profile is true and accurate to the best of my knowledge.</p>
                        {/* More terms... */}
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        <div>
                            <p className="text-white font-bold text-sm">Electronically signed and verified</p>
                            <p className="text-[10px] text-gray-500">TIMESTAMP: {new Date().toLocaleString()} • IP: 192.168.1.1</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UsersIcon(props: any) {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
