import { getFacultyList } from "@/lib/admin-actions"
import { FacultyManagementClient } from "@/components/admin/FacultyManagementClient"

export default async function AdminFacultyPage() {
  const faculty = await getFacultyList()

  return <FacultyManagementClient initialFaculty={faculty as any} />
}
