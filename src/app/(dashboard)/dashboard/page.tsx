import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/")
  }

  const role = (session.user as any).role

  switch (role) {
    case "STUDENT":
      redirect("/student/dashboard")
    case "FACULTY":
      redirect("/faculty/dashboard")
    case "PARENT":
      redirect("/parent/dashboard")
    case "ADMIN":
      redirect("/admin/dashboard")
    default:
      redirect("/student/dashboard") // Fallback
  }
}
