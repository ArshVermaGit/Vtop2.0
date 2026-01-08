import { getAllCourses, getFacultyList } from "@/lib/admin-actions"
import { CourseManagementClient } from "@/components/admin/CourseManagementClient"

export default async function AdminCoursesPage() {
  const [courses, faculty] = await Promise.all([
    getAllCourses(),
    getFacultyList()
  ])
  
  return <CourseManagementClient courses={courses} facultyList={faculty} />
}
