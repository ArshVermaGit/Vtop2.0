import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin, Building, GraduationCap, School, Landmark, Fingerprint, ShieldCheck, Heart, FileText, Info } from "lucide-react"
import { getStudentProfileByParent } from "@/lib/actions"
import Image from "next/image"

export default async function ParentProfilePage() {
  const student = await getStudentProfileByParent()

  if (!student) return <div className="p-12 text-center text-gray-500">Student information not available.</div>

  const personalDetails = [
    { label: "Date of Birth", value: student.dob ? new Date(student.dob).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Blood Group", value: student.bloodGroup || "N/A", icon: Heart },
    { label: "Native Place", value: student.nativePlace || "N/A", icon: MapPin },
    { label: "Nationality", value: student.nationality || "Indian", icon: Info },
    { label: "Aadhar Number", value: student.aadharNo || "N/A", icon: ShieldCheck },
  ]

  const registrationDetails = [
    { label: "Registration Date", value: student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Application Number", value: student.applicationNo || "N/A", icon: FileText },
    { label: "Registration Number", value: student.regNo, icon: GraduationCap },
    { label: "Batch", value: student.batch, icon: Building },
  ]

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <User className="w-8 h-8 text-blue-400" /> My Ward's Profile
           </h1>
           <p className="text-gray-400 mt-1">Official University records for {student.user.name}</p>
        </div>

      {/* Header Profile Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
          {student.photoUrl ? (
            <Image src={student.photoUrl} alt={student.user.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {student.user.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-center lg:justify-start">
             <h1 className="text-4xl font-bold text-white tracking-tight">{student.user.name}</h1>
             <Badge className="w-fit mx-auto lg:mx-0 bg-blue-600/20 text-blue-400 border border-blue-500/30">STUDENT</Badge>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 text-gray-400 text-sm">
             <div className="flex items-center gap-2"> <GraduationCap className="w-4 h-4 text-blue-400" /> {student.program} </div>
             <div className="flex items-center gap-2"> <School className="w-4 h-4 text-purple-400" /> {student.school} </div>
             <div className="flex items-center gap-2"> <MapPin className="w-4 h-4 text-rose-400" /> VIT Bhopal </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6">Personal & Contact</TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6">Academic Details</TabsTrigger>
          <TabsTrigger value="credentials" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Official IDs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" /> Personal Dossier
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
                                <Heart className="w-4 h-4" /> Emergency Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Primary Contact</p>
                                <p className="text-white font-medium">{student.emergencyName || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Mobile</p>
                                <p className="text-white font-mono">{student.emergencyPhone || "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Student Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Mobile</p>
                                <p className="text-white font-mono">{student.mobile}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">Official Email</p>
                                <p className="text-white font-medium truncate">{student.user.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-amber-400" /> Bank Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Bank Account Number</p>
                        <p className="text-white font-mono">{student.bankAccount || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">IFSC Code</p>
                        <p className="text-white font-mono">{student.bankIfsc || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Verification Status</p>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">VERIFIED</Badge>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Registration & Admission</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        {registrationDetails.map((detail, idx) => (
                            <div key={idx} className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase">{detail.label}</p>
                                <p className="text-white font-medium">{detail.value}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Programme Status (View Only)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-gray-500 text-sm">Course Category</span>
                            <span className="text-white font-bold">B.TECH REGULAR</span>
                        </div>
                         <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-gray-500 text-sm">Semester Status</span>
                            <span className="text-white font-bold">ACTIVE</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">Student Portal ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold text-white font-mono uppercase">{student.user.username}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">APAAR / ABC ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-lg font-bold text-white font-mono">{student.apaarId || student.abcId || "N/A"}</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-600/10 border-emerald-500/20">
                    <CardHeader>
                        <CardTitle className="text-sm text-emerald-400">Acknowledgment Sync</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-white font-bold">
                             <ShieldCheck className="w-5 h-5 text-emerald-500" /> COMPLETED
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
