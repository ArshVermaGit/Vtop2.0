import { getStudentsList } from "@/lib/admin-actions"
import { StudentManagementClient } from "@/components/admin/StudentManagementClient"

export default async function AdminStudentsPage() {
  const students = await getStudentsList()

  return <StudentManagementClient initialStudents={students as any} />
}
