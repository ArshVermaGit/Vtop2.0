import { getAllAttendance } from "@/lib/admin-actions"
import { AttendanceManagementClient } from "@/components/admin/AttendanceManagementClient"

export default async function AdminAttendancePage() {
  const logs = await getAllAttendance()

  return <AttendanceManagementClient initialLogs={logs as any} />
}
