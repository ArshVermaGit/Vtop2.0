import { getStudentProfile, getFacultyProfile, getParentProfile } from "@/lib/actions"
import { PreferencesForm } from "@/components/settings/PreferencesForm"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function PreferencesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) redirect("/")

  let email = "N/A"
  let mobile = "N/A"

  if (session.user.role === 'FACULTY') {
      const profile = await getFacultyProfile()
      if (profile) {
          email = profile.user.email || "N/A"
          mobile = profile.mobile || "N/A"
      }
  } else if (session.user.role === 'PARENT') {
      const profile = await getParentProfile()
      if (profile) {
          email = profile.user.email || "N/A"
          mobile = profile.mobile || "N/A"
      }
  } else {
      const profile = await getStudentProfile()
      if (profile) {
          email = profile.user.email || "N/A"
          mobile = profile.mobile || "N/A"
      }
  }

  return (
    <PreferencesForm 
      email={email} 
      mobile={mobile} 
    />
  )
}
