"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// --- ADMIN DASHBOARD ACTIONS ---

export async function getSystemAudit() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const models = ['user', 'studentProfile', 'facultyProfile', 'parentProfile', 'adminProfile', 'course', 'attendanceLog', 'marks', 'payment', 'leaveRequest', 'securityAudit']
  const counts: Record<string, number> = {}
  
  await Promise.all(models.map(async (m) => {
    counts[m] = await (prisma as unknown as Record<string, { count: () => Promise<number> }>)[m].count()
  }))

  return counts
}

export async function getAdminDashboardData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const [usersCount, studentsCount, facultyCount, parentsCount, logs] = await Promise.all([
    prisma.user.count(),
    prisma.studentProfile.count(),
    prisma.facultyProfile.count(),
    prisma.parentProfile.count(),
    prisma.securityAudit.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: { user: true }
    })
  ])

  return {
    stats: {
      users: usersCount,
      students: studentsCount,
      faculty: facultyCount,
      parents: parentsCount
    },
    logs
  }
}

// --- USER MANAGEMENT CRUD ---

export async function getAllUsers() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.user.findMany({
    include: {
      profile: true,
      facultyProfile: true,
      parentProfile: {
        include: {
          student: {
            include: { user: true }
          }
        }
      },
      adminProfile: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getUserById(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      facultyProfile: true,
      parentProfile: {
        include: {
          student: {
            include: { user: true }
          }
        }
      },
      adminProfile: true
    }
  })
}

export type CreateUserData = {
  username: string
  password: string
  name: string
  email?: string
  role: 'STUDENT' | 'FACULTY' | 'PARENT' | 'ADMIN'
  // Student-specific
  regNo?: string
  program?: string
  school?: string
  batch?: string
  // Faculty-specific
  empId?: string
  designation?: string
  cabin?: string
  // Parent-specific
  studentId?: string
  mobile?: string
}

export async function createUser(data: CreateUserData) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  // Check if username already exists
  const existing = await prisma.user.findUnique({ where: { username: data.username } })
  if (existing) throw new Error("Username already exists")

  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      role: data.role,
      ...(data.role === 'STUDENT' && data.regNo ? {
        profile: {
          create: {
            regNo: data.regNo,
            program: data.program || 'B.Tech',
            school: data.school || 'SCSE',
            batch: data.batch || '2024-2028'
          }
        }
      } : {}),
      ...(data.role === 'FACULTY' && data.empId ? {
        facultyProfile: {
          create: {
            empId: data.empId,
            designation: data.designation || 'Assistant Professor',
            school: data.school || 'SCSE',
            mobile: data.mobile || '0000000000',
            cabin: data.cabin || 'TBD'
          }
        }
      } : {}),
      ...(data.role === 'PARENT' ? {
        parentProfile: {
          create: {
            studentId: data.studentId,
            mobile: data.mobile
          }
        }
      } : {}),
      ...(data.role === 'ADMIN' ? {
        adminProfile: {
          create: {
            level: 1
          }
        }
      } : {})
    },
    include: {
      profile: true,
      facultyProfile: true,
      parentProfile: true,
      adminProfile: true
    }
  })

  // Log the action
  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `USER_CREATED: ${data.username} (${data.role})`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return user
}

export async function updateUser(id: string, data: Partial<CreateUserData>) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.password ? { password: data.password } : {})
    }
  })

  // Update profile based on role
  if (data.role === 'STUDENT' && (data.regNo || data.program || data.school || data.batch)) {
    await prisma.studentProfile.updateMany({
      where: { userId: id },
      data: {
        ...(data.regNo ? { regNo: data.regNo } : {}),
        ...(data.program ? { program: data.program } : {}),
        ...(data.school ? { school: data.school } : {}),
        ...(data.batch ? { batch: data.batch } : {})
      }
    })
  }

  if (data.role === 'FACULTY' && (data.empId || data.designation || data.cabin)) {
    await prisma.facultyProfile.updateMany({
      where: { userId: id },
      data: {
        ...(data.empId ? { empId: data.empId } : {}),
        ...(data.designation ? { designation: data.designation } : {}),
        ...(data.cabin ? { cabin: data.cabin } : {})
      }
    })
  }

  // Log the action
  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `USER_UPDATED: ${user.username}`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return user
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  // Don't allow deleting yourself
  if ((session.user as { id: string }).id === id) throw new Error("Cannot delete your own account")

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error("User not found")

  // Delete profile first based on role
  if (user.role === 'STUDENT') {
    await prisma.studentProfile.deleteMany({ where: { userId: id } })
  } else if (user.role === 'FACULTY') {
    await prisma.facultyProfile.deleteMany({ where: { userId: id } })
  } else if (user.role === 'PARENT') {
    await prisma.parentProfile.deleteMany({ where: { userId: id } })
  } else if (user.role === 'ADMIN') {
    await prisma.adminProfile.deleteMany({ where: { userId: id } })
  }

  // Delete the user
  await prisma.user.delete({ where: { id } })

  // Log the action
  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `USER_DELETED: ${user.username} (${user.role})`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return { success: true, deleted: user.username }
}

export async function linkParentToStudent(parentUserId: string, studentProfileId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const updated = await prisma.parentProfile.updateMany({
    where: { userId: parentUserId },
    data: { studentId: studentProfileId }
  })

  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `PARENT_LINKED: Parent ${parentUserId} -> Student ${studentProfileId}`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return updated
}
export async function getParentsList() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.parentProfile.findMany({
    include: { 
      user: true,
      student: {
        include: { user: true }
      }
    }
  })
}

export async function getStudentsList() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.studentProfile.findMany({
    include: { 
      user: true,
      _count: {
        select: {
          attendance: true,
          marks: true
        }
      }
    },
    orderBy: { regNo: 'asc' }
  })
}

export async function getFacultyList() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.facultyProfile.findMany({
    include: { 
      user: true,
      _count: {
        select: {
          courses: true,
          attendanceLogs: true
        }
      }
    },
    orderBy: { empId: 'asc' }
  })
}

// --- COURSE MANAGEMENT ---

export async function getAllCourses() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.course.findMany({
    include: {
      faculty: {
        include: { user: true }
      },
      _count: {
        select: { registrations: true }
      }
    },
    orderBy: { code: 'asc' }
  })
}

export async function createCourse(data: {
  code: string
  title: string
  credits: number
  type: string
  slot?: string
  venue?: string
  category?: string
  facultyId?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const course = await prisma.course.create({
    data
  })

  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `COURSE_CREATED: ${data.code}`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return course
}

export async function updateCourse(id: string, data: Partial<{
  code: string
  title: string
  credits: number
  type: string
  slot: string
  venue: string
  category: string
  facultyId: string
}>) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const course = await prisma.course.update({
    where: { id },
    data
  })

  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `COURSE_UPDATED: ${course.code}`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return course
}

export async function deleteCourse(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const course = await prisma.course.findUnique({ where: { id } })
  if (!course) throw new Error("Course not found")

  await prisma.course.delete({ where: { id } })

  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `COURSE_DELETED: ${course.code}`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return { success: true }
}

// --- MARKS MANAGEMENT ---

export async function getAllMarks() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.marks.findMany({
    include: {
      student: {
        include: { user: true }
      },
      course: true
    },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function updateMarks(id: string, data: Partial<{
  cat1: number
  cat2: number
  fat: number
  da1: number
  da2: number
  quiz: number
  pbl: number
  total: number
  grade: string
}>) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const marks = await prisma.marks.update({
    where: { id },
    data
  })

  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `MARKS_UPDATED: Student ${marks.studentId}, Course ${marks.courseId}`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return marks
}

// --- DATABASE CONTROLS ---

export async function getModelData(modelName: string, page: number = 1, pageSize: number = 20) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const prismaModel = (prisma as unknown as Record<string, { findMany: (args: Record<string, unknown>) => Promise<Record<string, unknown>[]>, count: () => Promise<number> }>)[modelName]
  if (!prismaModel) throw new Error("Invalid model name")

  const [data, total] = await Promise.all([
    prismaModel.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { id: 'desc' }
    }),
    prismaModel.count()
  ])

  return { data, total }
}

export async function deleteModelRecord(modelName: string, id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const prismaModel = (prisma as unknown as Record<string, { delete: (args: { where: { id: string } }) => Promise<Record<string, unknown>> }>)[modelName]
  if (!prismaModel) throw new Error("Invalid model name")

  return await prismaModel.delete({ where: { id } })
}

export async function clearDatabase() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  const models = ['securityAudit', 'facultyLeave', 'payroll', 'parentAnnouncement', 'eResource', 'libraryDue', 'bookReservation', 'bookIssue', 'book', 'feedbackResponse', 'feedbackSurvey', 'activityPoint', 'achievement', 'clubEvent', 'clubMembership', 'club', 'placementApplication', 'careerOpportunity', 'placementDrive', 'councilAnnouncement', 'communication', 'programmeMigration', 'digitalCredential', 'registrationWindow', 'serviceRequest', 'scholarship', 'feeStructure', 'permissionLetter', 'hostelConsentForm', 'messMenu', 'hostelMaintenance', 'hostelAdmission', 'researchLetter', 'progressReport', 'researchPublication', 'reevaluationRequest', 'gradeHistory', 'seatAllocation', 'examSchedule', 'forumReply', 'forumPost', 'courseAnnouncement', 'assignmentSubmission', 'assignment', 'academicEvent', 'semesterMilestone', 'biometricReport', 'examApplication', 'thesisSubmission', 'leaveRequest', 'payment', 'marks', 'attendance', 'timeTable', 'courseRegistration', 'courseMaterial', 'meeting', 'counsellingRecord', 'course', 'researchProfile', 'studentProfile', 'facultyProfile', 'parentProfile', 'adminProfile', 'user']
  
  for (const model of models) {
    const prismaModel = (prisma as unknown as Record<string, { deleteMany: () => Promise<{ count: number }> }>)[model]
    if (prismaModel) {
      await prismaModel.deleteMany()
    }
  }

  await prisma.securityAudit.create({
    data: {
      userId: (session.user as { id: string }).id,
      event: `DATABASE_CLEARED`,
      ipAddress: 'Admin Panel',
      device: 'VTOP 2.0 Admin'
    }
  })

  return { success: true }
}

export async function getAllAttendance() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.attendanceLog.findMany({
    include: {
      student: { include: { user: true } },
      course: true,
      faculty: { include: { user: true } }
    },
    orderBy: { date: 'desc' }
  })
}

export async function updateAttendance(id: string, data: Partial<{
  status: string
  date: Date
  slot: string
}>) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.attendanceLog.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.date ? { date: data.date } : {}),
      ...(data.slot ? { slot: data.slot } : {})
    }
  })
}

export async function deleteAttendance(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.attendanceLog.delete({ where: { id } })
}

export async function seedDatabase() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  await prisma.user.create({
    data: {
      username: `student_${Date.now()}`,
      password: 'password',
      name: 'Sample Student',
      role: 'STUDENT',
      profile: { create: { regNo: `REG${Math.floor(Math.random()*1000)}`, program: 'B.Tech', batch: '2024', school: 'SCSE' } }
    }
  })
  return { success: true }
}

export async function getAllPayments() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.payment.findMany({
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getAllLeaveRequests() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  return await prisma.leaveRequest.findMany({
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
  })
}
