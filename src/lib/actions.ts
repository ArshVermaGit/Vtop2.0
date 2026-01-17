"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import * as DocumentEngine from "@/lib/engine/docs"
import * as SyncEngine from "@/lib/engine/sync"
import * as NotifyEngine from "@/lib/engine/notify"
import crypto from "crypto"

function generateSecureCode(length: number): string {
  // Generate cryptographically secure random bytes and encode as an
  // uppercase base36-like string, trimming to the requested length.
  // We generate extra bytes to ensure enough characters after encoding.
  const bytes = crypto.randomBytes(Math.ceil((length * 2) / 3) + 2)
  const base36 = BigInt("0x" + bytes.toString("hex")).toString(36)
  const clean = base36.replace(/[^a-z0-9]/gi, "").toUpperCase()
  if (clean.length >= length) {
    return clean.substring(0, length)
  }
  // If, in rare cases, we didn't get enough characters, recursively top up.
  return clean + generateSecureCode(length - clean.length)
}

export async function getStudentProfile() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return await prisma.studentProfile.findFirst({
    where: {
      userId: session.user.id
    },
    include: {
      proctor: {
        include: {
          user: true
        }
      },
      user: true
    }
  })
}





export async function getTimetable() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.timeTable.findMany({
    where: { studentId: profile.id },
    include: { course: true }
  })
}

export async function getMarks() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.marks.findMany({
    where: { studentId: profile.id },
    include: { course: true }
  })
}

export async function getPayments() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.payment.findMany({
    where: { studentId: profile.id },
    orderBy: { dueDate: 'desc' }
  })
}


export async function getExamSchedule() {
  return await prisma.examSchedule.findMany({
    orderBy: { examDate: 'asc' }
  })
}

export async function getLeaveRequests() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.leaveRequest.findMany({
    where: { studentId: profile.id },
    orderBy: { fromDate: 'desc' }
  })
}

export async function getThesisSubmission() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  const profile = await getStudentProfile()
  if (!profile) return null

  return await prisma.thesisSubmission.findUnique({
    where: { studentId: profile.id }
  })
}

export async function getAttendance() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.attendance.findMany({
    where: { studentId: profile.id },
    include: { course: { include: { faculty: { include: { user: true } } } } }
  })
}

export async function getAttendanceLogs() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.attendanceLog.findMany({
    where: { studentId: profile.id },
    include: { course: true, faculty: { include: { user: true } }, student: { include: { user: true } } },
    orderBy: { date: 'desc' },
    take: 50
  })
}

export async function getGlobalAttendanceLogs() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") return []

  return await prisma.attendanceLog.findMany({
    include: { course: true, faculty: { include: { user: true } }, student: { include: { user: true } } },
    orderBy: { date: 'desc' },
    take: 100
  })
}

export async function getCourseDetails(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      faculty: { include: { user: true } },
      materials: true,
      assignments: {
        include: {
          submissions: {
            where: {
              student: {
                user: {
                  username: session.user.name || ""
                }
              }
            }
          }
        }
      },
      announcements: {
        orderBy: { createdAt: 'desc' }
      },
      forumPosts: {
        include: {
          author: true,
          replies: {
            include: { author: true },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function submitAssignment(assignmentId: string, fileUrl: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.assignmentSubmission.upsert({
    where: {
      id: `${assignmentId}_${profile.id}` // Temporary unique ID logic if needed, or handle by unique constraint
    },
    update: {
      fileUrl,
      submittedAt: new Date()
    },
    create: {
      assignmentId,
      studentId: profile.id,
      fileUrl,
      status: 'SUBMITTED'
    }
  })
}

export async function postForumPost(courseId: string, title: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !session.user.id) throw new Error("Unauthorized")

  return await prisma.forumPost.create({
    data: {
      courseId,
      authorId: session.user.id,
      title,
      content
    }
  })
}

export async function postForumReply(postId: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !session.user.id) throw new Error("Unauthorized")

  return await prisma.forumReply.create({
    data: {
      postId,
      authorId: session.user.id,
      content
    }
  })
}

export async function postCourseAnnouncement(courseId: string, title: string, content: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "FACULTY") throw new Error("Unauthorized")

  const faculty = await getFacultyProfile()
  if (!faculty) throw new Error("Faculty profile not found")

  return await prisma.courseAnnouncement.create({
    data: {
      courseId,
      title,
      content
    }
  })
}

export async function getExamSchedules() {
  const profile = await getStudentProfile()
  if (!profile) return []

  const registrations = await prisma.courseRegistration.findMany({
    where: { studentId: profile.id, status: 'REGISTERED' },
    select: { courseId: true }
  })

  const courseIds = registrations.map(r => r.courseId)

  return await prisma.examSchedule.findMany({
    where: {
      courseId: { in: courseIds }
    },
    orderBy: { examDate: 'asc' }
  })
}

export async function getSeatAllocations() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.seatAllocation.findMany({
    where: { studentId: profile.id },
    include: {
      examSchedule: true
    }
  })
}

export async function getDetailedMarks() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.marks.findMany({
    where: { studentId: profile.id },
    include: {
      course: {
        include: { faculty: { include: { user: true } } }
      },
      reevaluation: true
    }
  })
}

export async function getGradeHistory() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.gradeHistory.findMany({
    where: { studentId: profile.id },
    orderBy: [
      { semester: 'desc' },
      { courseCode: 'asc' }
    ]
  })
}

export async function getAcademicPerformance() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const history = await getGradeHistory()
  
  // Basic CGPA calculation logic
  const totalCredits = history.reduce((acc, curr) => acc + curr.credits, 0)
  const totalPoints = history.reduce((acc, curr) => acc + (curr.credits * curr.gradePoint), 0)
  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00"

  // Semester-wise grouping
  const semesterWise = history.reduce((acc: Record<string, { credits: number, points: number, courses: any[] }>, curr) => {
    if (!acc[curr.semester]) {
      acc[curr.semester] = { credits: 0, points: 0, courses: [] }
    }
    acc[curr.semester].credits += curr.credits
    acc[curr.semester].points += (curr.credits * curr.gradePoint)
    acc[curr.semester].courses.push(curr)
    return acc
  }, {})

  const semesterPerformance = Object.entries(semesterWise).map(([sem, data]: [string, any]) => ({
    semester: sem,
    gpa: (data.points / data.credits).toFixed(2),
    credits: data.credits,
    courses: data.courses
  }))

  return {
    cgpa,
    totalCredits,
    semesterPerformance: semesterPerformance.sort((a, b) => b.semester.localeCompare(a.semester))
  }
}

export async function applyForReevaluation(marksId: string, type: 'SEE' | 'REVAL') {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.reevaluationRequest.create({
    data: {
      marksId,
      studentId: profile.id,
      type,
      status: 'PENDING',
      feePaid: true // Assuming payment happens before this action in a real app
    }
  })
}

export async function getFacultyProfile() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return await prisma.facultyProfile.findUnique({
    where: {
      userId: session.user.id
    },
    include: {
      user: true,
      proctees: {
          include: {
              user: true,
              attendance: true,
              marks: true
          }
      },
      courses: {
        include: {
          timeTable: true,
          registrations: {
            include: {
              student: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }
    }
  })
}

export async function getParentProfile() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return await prisma.parentProfile.findUnique({
    where: {
      userId: session.user.id
    },
    include: {
      user: true
    }
  })
}

export async function getStudentProfileByParent() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'PARENT') return null

  const parent = await getParentProfile()
  if (!parent || !parent.studentId) return null

  return await prisma.studentProfile.findUnique({
    where: { id: parent.studentId },
    include: {
      user: true,
      proctor: {
        include: { user: true }
      }
    }
  })
}

export async function getMeetings() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.meeting.findMany({
    where: { studentId: profile.id },
    include: { faculty: { include: { user: true } } },
    orderBy: { date: 'desc' }
  })
}

export async function getCounsellingRecords() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.counsellingRecord.findMany({
    where: { studentId: profile.id },
    include: { faculty: { include: { user: true } } },
    orderBy: { date: 'desc' }
  })
}

export async function getFacultyMeetings() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const faculty = await getFacultyProfile()
  if (!faculty) return []

  return await prisma.meeting.findMany({
    where: { facultyId: faculty.id },
    include: { student: { include: { user: true } } },
    orderBy: { date: 'desc' }
  })
}

export async function getFacultyCounsellingRecords() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const faculty = await getFacultyProfile()
  if (!faculty) return []

  return await prisma.counsellingRecord.findMany({
    where: { facultyId: faculty.id },
    include: { student: { include: { user: true } } },
    orderBy: { date: 'desc' }
  })
}

export async function getParentWardMeetings() {
  const student = await getStudentProfileByParent()
  if (!student) return []

  return await prisma.meeting.findMany({
    where: { studentId: student.id },
    include: { faculty: { include: { user: true } } },
    orderBy: { date: 'desc' }
  })
}

export async function getCourseStudents(courseId: string) {
  const registrations = await prisma.courseRegistration.findMany({
    where: { courseId, status: "REGISTERED" },
    include: { student: { include: { user: true } } }
  })
  return registrations.map(r => r.student)
}

export async function markAttendance(data: { courseId: string, date: Date, slot: string, students: { studentId: string, status: string }[] }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  const faculty = await getFacultyProfile()
  if (!faculty) throw new Error("Faculty profile not found")

  await prisma.attendanceLog.createMany({
    data: data.students.map(s => ({
      studentId: s.studentId,
      courseId: data.courseId,
      facultyId: faculty.id,
      date: data.date,
      status: s.status,
      slot: data.slot
    }))
  })

  for (const s of data.students) {
    const logs = await prisma.attendanceLog.findMany({
      where: { studentId: s.studentId, courseId: data.courseId }
    })

    const attended = logs.filter(l => l.status === "PRESENT" || l.status === "LATE" || l.status === "ON_DUTY").length
    const total = logs.length

    await prisma.attendance.upsert({
      where: { 
        studentId_courseId: {
          studentId: s.studentId,
          courseId: data.courseId
        }
      },
      update: {
        attendedClasses: attended,
        totalClasses: total,
        percentage: total > 0 ? (attended / total) * 100 : 0
      },
      create: {
        studentId: s.studentId,
        courseId: data.courseId,
        attendedClasses: attended,
        totalClasses: total,
        percentage: total > 0 ? (attended / total) * 100 : 0
      }
    })
  }

  return { success: true }
}

export async function adminOverrideAttendance(logId: string, newStatus: string) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized Admin")

    const log = await prisma.attendanceLog.update({
        where: { id: logId },
        data: { status: newStatus },
        include: { student: true, course: true }
    })

    const logs = await prisma.attendanceLog.findMany({
        where: { studentId: log.studentId, courseId: log.courseId }
    })
    const attended = logs.filter(l => l.status === "PRESENT" || l.status === "LATE" || l.status === "ON_DUTY").length
    const total = logs.length

    await prisma.attendance.update({
        where: { 
            studentId_courseId: {
                studentId: log.studentId,
                courseId: log.courseId
            }
        },
        data: {
            attendedClasses: attended,
            totalClasses: total,
            percentage: total > 0 ? (attended / total) * 100 : 0
        }
    })

    return log
}

export async function getParentWardAttendance() {
    const student = await getStudentProfileByParent()
    if (!student) return []

    return await prisma.attendance.findMany({
        where: { studentId: student.id },
        include: { course: { include: { faculty: { include: { user: true } } } } }
    })
}

export async function getParentWardAttendanceLogs() {
    const student = await getStudentProfileByParent()
    if (!student) return []

    return await prisma.attendanceLog.findMany({
        where: { studentId: student.id },
        include: { course: true, faculty: { include: { user: true } } },
        orderBy: { date: 'desc' },
        take: 30
    })
}

export async function getParentWardPayments() {
    const student = await getStudentProfileByParent()
    if (!student) return []

    return await prisma.payment.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getCourseRegistrations() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.courseRegistration.findMany({
    where: { studentId: profile.id },
    include: { course: { include: { faculty: { include: { user: true } } } } },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getCourses() {
  return await prisma.course.findMany({
    include: { faculty: { include: { user: true } } }
  })
}

export async function getCourseMaterials(courseId: string) {
  return await prisma.courseMaterial.findMany({
    where: { courseId }
  })
}

export async function registerCourse(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  const profile = await getStudentProfile()
  if (!profile) throw new Error("Profile not found")

  return await prisma.courseRegistration.create({
    data: {
      studentId: profile.id,
      courseId,
      status: "REGISTERED",
      sem: "Winter 2024-25"
    }
  })
}

export async function dropCourse(registrationId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  return await prisma.courseRegistration.delete({
    where: { id: registrationId }
  })
}

export async function getAcademicEvents() {
  return await prisma.academicEvent.findMany({
    orderBy: { date: 'asc' }
  })
}

export async function getSemesterMilestones() {
  return await prisma.semesterMilestone.findMany({
    orderBy: { date: 'asc' }
  })
}

export async function getWardTimetable() {
    const student = await getStudentProfileByParent()
    if (!student) return []
  
    return await prisma.timeTable.findMany({
      where: { studentId: student.id },
      include: { course: true }
    })
}

export async function createLeaveRequest(data: { type: string, fromDate: Date, toDate: Date, reason: string }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  const profile = await getStudentProfile()
  if (!profile) throw new Error("Profile not found")

  return await prisma.leaveRequest.create({
    data: {
      studentId: profile.id,
      ...data,
      status: "PENDING"
    }
  })
}

// --- RESEARCH MODULE ACTIONS ---

export async function getResearchProfile() {
  const profile = await getStudentProfile()
  if (!profile) return null

  return await prisma.researchProfile.findUnique({
    where: { studentId: profile.id },
    include: {
      supervisor: { include: { user: true } },
      publications: true,
      progressReports: { orderBy: { submittedAt: 'desc' } },
      researchLetters: true
    }
  })
}

export async function submitProgressReport(title: string, content: string, fileUrl?: string) {
  const profile = await getResearchProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.progressReport.create({
    data: {
      researchProfileId: profile.id,
      title,
      content,
      fileUrl,
      status: 'SUBMITTED'
    }
  })
}

export async function addResearchPublication(data: {
  title: string;
  journal: string;
  year: number;
  doi?: string;
  type: string;
  authors: string;
}) {
  const profile = await getResearchProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.researchPublication.create({
    data: {
      researchProfileId: profile.id,
      ...data
    }
  })
}

// --- HOSTEL MODULE ACTIONS ---

export async function getHostelStatus() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const admission = await prisma.hostelAdmission.findFirst({
    where: { studentId: profile.id, type: 'ADMISSION' },
    orderBy: { appliedAt: 'desc' }
  })

  const maintenanceTickets = await prisma.hostelMaintenance.findMany({
    where: { studentId: profile.id },
    orderBy: { createdAt: 'desc' }
  })

  const consentForms = await prisma.hostelConsentForm.findMany({
    where: { studentId: profile.id },
    orderBy: { appliedAt: 'desc' }
  })

  return {
    admission,
    maintenanceTickets,
    consentForms
  }
}

export async function createMaintenanceTicket(category: string, issue: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  // Find active room from admission
  const admission = await prisma.hostelAdmission.findFirst({
      where: { studentId: profile.id, status: 'APPROVED' },
      orderBy: { appliedAt: 'desc' }
  })

  return await prisma.hostelMaintenance.create({
    data: {
      studentId: profile.id,
      block: admission?.block || "TBD",
      roomNo: profile.hostelRoom || "Not Assigned",
      category,
      issue,
      status: 'OPEN'
    }
  })
}

export async function getMessMenus() {
    return await prisma.messMenu.findMany()
}

export async function submitHostelConsent(type: string, url: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.hostelConsentForm.create({
    data: {
      studentId: profile.id,
      type,
      status: 'PENDING',
      url
    }
  })
}

// --- LEAVE & PERMISSIONS ACTIONS ---

export async function getLeaveStatus() {
  const profile = await getStudentProfile()
  if (!profile) return null

  return await prisma.leaveRequest.findMany({
    where: { studentId: profile.id },
    orderBy: { createdAt: 'desc' }
  })
}

export async function submitLeaveRequest(data: { type: string, category: string, fromDate: Date, toDate: Date, reason: string }) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.leaveRequest.create({
    data: {
      studentId: profile.id,
      ...data,
      status: 'PENDING'
    }
  })
}

export async function cancelLeaveRequest(requestId: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.leaveRequest.update({
    where: { id: requestId, studentId: profile.id },
    data: { status: 'CANCELLED' }
  })
}

export async function getPermissionLetters() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.permissionLetter.findMany({
    where: { studentId: profile.id },
    orderBy: { createdAt: 'desc' }
  })
}

// --- FINANCIAL MODULE ACTIONS ---

export async function getFinancialStatus() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const payments = await prisma.payment.findMany({
    where: { studentId: profile.id },
    orderBy: { createdAt: 'desc' }
  })

  const scholarships = await prisma.scholarship.findMany({
    where: { studentId: profile.id },
    orderBy: { appliedDate: 'desc' }
  })

  const feeStructure = await prisma.feeStructure.findMany()

  return {
    payments,
    scholarships,
    feeStructure
  }
}

export async function makePayment(paymentId: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.payment.update({
    where: { id: paymentId, studentId: profile.id },
    data: {
      status: 'PAID',
      paidDate: new Date(),
      receiptUrl: '#' // Mock receipt
    }
  })
}

export async function applyScholarship(data: { name: string, type: string, amount: number }) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.scholarship.create({
    data: {
      studentId: profile.id,
      ...data,
      status: 'APPLIED'
    }
  })
}

// --- ADMINISTRATIVE SERVICES ACTIONS ---

export async function getServiceRequests() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.serviceRequest.findMany({
    where: { studentId: profile.id },
    orderBy: { requestDate: 'desc' }
  })
}

export async function submitServiceRequest(type: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.serviceRequest.create({
    data: {
      studentId: profile.id,
      type,
      status: 'PENDING'
    }
  })
}

export async function getDigitalCredentials() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.digitalCredential.findMany({
    where: { studentId: profile.id },
    orderBy: { type: 'asc' }
  })
}

// --- ACADEMIC PROGRAMS & REGISTRATION ACTIONS ---

export async function getRegistrationWindows() {
  return await prisma.registrationWindow.findMany({
    orderBy: { startDate: 'desc' }
  })
}

export async function getProgrammeMigrations() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.programmeMigration.findMany({
    where: { studentId: profile.id },
    orderBy: { appliedAt: 'desc' }
  })
}

export async function submitProgrammeMigration(data: { type: string, targetProgram: string, reason: string }) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.programmeMigration.create({
    data: {
      studentId: profile.id,
      currentProgram: profile.program,
      ...data,
      status: 'PENDING'
    }
  })
}

// --- COMMUNICATION MODULE ACTIONS ---

export async function getCommunications() {
  const profile = await getStudentProfile()
  if (!profile) return { communications: [], councilAnnouncements: [] }

  // Fetching Global communications and specific ones for this student
  const communications = await prisma.communication.findMany({
    where: {
      OR: [
        { targetId: null }, // Global
        { targetId: profile.id }, // Direct Message
        { targetId: profile.batch }, // Batch-wide (mocked via targetId for now)
      ]
    },
    orderBy: { date: 'desc' }
  })

  const councilAnnouncements = await prisma.councilAnnouncement.findMany({
    orderBy: { date: 'desc' }
  })

  return {
    communications,
    councilAnnouncements
  }
}

// --- CAREER & PLACEMENTS MODULE ACTIONS ---

export async function getCareerStatus() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const drives = await prisma.placementDrive.findMany({
    orderBy: { driveDate: 'asc' },
    include: {
      applications: {
        where: { studentId: profile.id }
      }
    }
  })

  const opportunities = await prisma.careerOpportunity.findMany({
    orderBy: { postedAt: 'desc' }
  })

  return {
    drives,
    opportunities
  }
}

export async function applyForDrive(driveId: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.placementApplication.create({
    data: {
      studentId: profile.id,
      driveId,
      status: 'APPLIED'
    }
  })
}

// --- CLUBS & EXTRACURRICULAR ACTIONS ---

export async function getClubsAndEvents() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const clubs = await prisma.club.findMany({
    include: {
      members: {
        where: { studentId: profile.id }
      }
    }
  })

  const events = await prisma.clubEvent.findMany({
    orderBy: { date: 'asc' },
    include: {
      club: true
    }
  })

  return {
    clubs,
    events
  }
}

export async function getAchievementsData() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const achievements = await prisma.achievement.findMany({
    where: { studentId: profile.id },
    orderBy: { date: 'desc' }
  })

  const activityPoints = await prisma.activityPoint.findMany({
    where: { studentId: profile.id },
    orderBy: { date: 'desc' }
  })

  return {
    achievements,
    activityPoints
  }
}

export async function submitAchievement(data: any) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.achievement.create({
    data: {
      studentId: profile.id,
      ...data,
      status: 'PENDING'
    }
  })
}

// --- FEEDBACK & SURVEYS ACTIONS ---

export async function getPendingFeedbacks() {
  const profile = await getStudentProfile()
  if (!profile) return []

  const surveys = await prisma.feedbackSurvey.findMany({
    where: { status: 'ACTIVE' },
    include: {
      responses: {
        where: { studentId: profile.id }
      }
    }
  })

  // Filter out already answered surveys
  return surveys.filter(s => s.responses.length === 0)
}

export async function submitFeedback(surveyId: string, content: any, courseId?: string, facultyId?: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.feedbackResponse.create({
    data: {
      surveyId,
      studentId: profile.id,
      courseId,
      facultyId,
      content: JSON.stringify(content)
    }
  })
}

// --- LIBRARY ACTIONS ---

export async function getLibraryStatus() {
  const profile = await getStudentProfile()
  if (!profile) return null

  const issuedBooks = await prisma.bookIssue.findMany({
    where: { studentId: profile.id },
    include: { book: true }
  })

  const reservations = await prisma.bookReservation.findMany({
    where: { studentId: profile.id },
    include: { book: true }
  })

  const dues = await prisma.libraryDue.findMany({
    where: { studentId: profile.id }
  })

  const eResources = await prisma.eResource.findMany()

  return {
    issuedBooks,
    reservations,
    dues,
    eResources
  }
}

export async function searchBooks(query: string) {
  return await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { author: { contains: query } },
        { isbn: { contains: query } },
        { category: { contains: query } }
      ]
    }
  })
}

export async function reserveBook(bookId: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.bookReservation.create({
    data: {
      studentId: profile.id,
      bookId,
      status: 'PENDING'
    }
  })
}

// --- PARENT PORTAL ACTIONS ---

export async function getParentDashboardData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'PARENT') return null

  const parentProfile = await prisma.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      student: {
        include: {
          user: true,
          proctor: {
            include: {
              user: true
            }
          },
          attendance: {
            include: {
              course: true
            }
          },
          marks: {
            include: {
              course: true
            }
          },
          gradeHistories: true,
          payments: true,
          timeTable: {
            include: {
              course: true
            }
          }
        }
      }
    }
  })

  if (!parentProfile) return null

  const announcements = await prisma.parentAnnouncement.findMany({
    where: { 
      OR: [
        { parentId: parentProfile.id },
        { parentId: null }
      ]
    },
    orderBy: { date: 'desc' }
  })

  return {
    profile: parentProfile,
    announcements
  }
}

// --- FACULTY ORACLE ACTIONS ---

export async function getFacultyDashboardData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'FACULTY') throw new Error("Unauthorized")

  const faculty = await prisma.facultyProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      courses: {
        include: {
          registrations: {
            include: {
              student: {
                include: {
                  user: true
                }
              }
            }
          },
          attendance: true,
          timeTable: true
        }
      },
      proctees: {
        include: {
          user: true,
          attendance: true,
          marks: true
        }
      },
      supervisedScholars: true,
      meetings: true,
      counsellingRecords: {
        include: {
          student: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })

  return faculty
}

export async function getFacultyAdminData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'FACULTY') throw new Error("Unauthorized")

  const faculty = await prisma.facultyProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      payrolls: {
        orderBy: { processedAt: 'desc' }
      },
      leaves: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  return faculty
}

export async function markAttendanceBulk(courseId: string, studentIds: string[], status: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'FACULTY') throw new Error("Unauthorized")

  const faculty = await prisma.facultyProfile.findUnique({
    where: { userId: session.user.id }
  })
  if (!faculty) throw new Error("Faculty profile not found")

  const date = new Date()
  
  const entries = studentIds.map(studentId => ({
    studentId,
    courseId,
    facultyId: faculty.id,
    status,
    date
  }))

  return await prisma.attendanceLog.createMany({
    data: entries
  })
}

export async function updateMarksBulk(courseId: string, marksData: { studentId: string, cat1?: number, cat2?: number, fat?: number, da1?: number, da2?: number, quiz?: number }[]) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'FACULTY') throw new Error("Unauthorized")

  const updates = marksData.map(async (data) => {
    const total = (data.cat1 || 0) + (data.cat2 || 0) + (data.fat || 0) + (data.da1 || 0) + (data.da2 || 0) + (data.quiz || 0)
    return prisma.marks.upsert({
      where: { 
        studentId_courseId: { 
          studentId: data.studentId, 
          courseId 
        } 
      },
      update: {
        cat1: data.cat1,
        cat2: data.cat2,
        fat: data.fat,
        da1: data.da1,
        da2: data.da2,
        quiz: data.quiz,
        total
      },
      create: {
        studentId: data.studentId,
        courseId,
        cat1: data.cat1 || 0,
        cat2: data.cat2 || 0,
        fat: data.fat || 0,
        da1: data.da1 || 0,
        da2: data.da2 || 0,
        quiz: data.quiz || 0,
        total
      }
    })
  })

  return await Promise.all(updates)
}

export async function getFacultyTimetable() {
  const faculty = await getFacultyProfile()
  if (!faculty) return []

  const courses = await prisma.course.findMany({
    where: { facultyId: faculty.id },
    include: {
      timeTable: true,
      registrations: {
        include: {
          student: true
        }
      }
    }
  })

  return courses.flatMap(c => c.timeTable.map(t => ({ ...t, course: c })))
}

export async function getProctees() {
  const faculty = await getFacultyProfile()
  if (!faculty) return []

  return await prisma.studentProfile.findMany({
    where: { proctorId: faculty.id },
    include: {
      user: true,
      attendance: {
        include: {
          course: true
        }
      },
      marks: {
        include: {
          course: true
        }
      }
    }
  })
}

export async function getClassesForAttendance() {
  const faculty = await getFacultyProfile()
  if (!faculty) return []

  return await prisma.course.findMany({
    where: { facultyId: faculty.id },
    select: {
      id: true,
      code: true,
      title: true,
      slot: true,
    }
  })
}

// --- SECURITY MATRIX ACTIONS ---

export async function getSecurityStatus() {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      twoFactorEnabled: true,
      lastLogin: true,
      securityAudits: {
        orderBy: { timestamp: 'desc' },
        take: 10
      },
      backupCodes: true
    }
  })
}

export async function toggle2FA(enabled: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  const userId = session.user.id

  if (enabled) {
      // Generate a secret and backup codes for 2FA using a cryptographically secure PRNG
      const secret = generateSecureCode(10)
      const codes = Array.from({ length: 5 }, () => generateSecureCode(6))
      
      await prisma.user.update({
          where: { id: userId },
          data: {
              twoFactorEnabled: true,
              twoFactorSecret: secret,
              backupCodes: JSON.stringify(codes)
          }
      })

      await prisma.securityAudit.create({
          data: {
              userId,
              event: '2FA_ENABLED',
              ipAddress: 'Unknown',
              device: 'Web Client'
          }
      })
      
      return { secret, codes }
  } else {
      await prisma.user.update({
          where: { id: userId },
          data: {
              twoFactorEnabled: false,
              twoFactorSecret: null,
              backupCodes: null
          }
      })

      await prisma.securityAudit.create({
          data: {
              userId,
              event: '2FA_DISABLED',
              ipAddress: 'Unknown',
              device: 'Web Client'
          }
      })

      return { success: true }
  }
}

// --- BACKEND ENGINE & UTILITY ACTIONS ---

export async function exportAcademicReport(type: 'GRADES' | 'ATTENDANCE' | 'FINANCE') {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  let data: any[] = []
  
  if (type === 'GRADES') {
      const student = await getStudentProfile()
      if (student) {
          const grades = await prisma.gradeHistory.findMany({ where: { studentId: student.id } })
          data = grades.map(g => ({ Course: g.courseTitle, Code: g.courseCode, Grade: g.grade, Credits: g.credits }))
      }
  } else if (type === 'ATTENDANCE') {
      const student = await getStudentProfile()
      if (student) {
          const att = await prisma.attendance.findMany({ where: { studentId: student.id }, include: { course: true } })
          data = att.map(a => ({ Course: a.course.title, Code: a.course.code, Percentage: a.percentage }))
      }
  }

  return await DocumentEngine.generateCSVExport(type, data)
}

export async function syncInstitutionalData(target: 'ATTENDANCE' | 'MARKS' | 'PROFILE') {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  const result = await SyncEngine.syncLegacyData(target)
  
  // Create security audit for the sync action
  await prisma.securityAudit.create({
      data: {
          userId: session.user.id,
          event: `LEGACY_SYNC_${target}`,
          ipAddress: '127.0.0.1',
          device: 'VTOP 2.0 Engine'
      }
  })

  return result
}

export async function triggerNotification(target: 'EMAIL' | 'SMS', message: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  return await NotifyEngine.sendNotification(target, {
      to: session.user.email || session.user.mobile || "user@university.edu",
      subject: "VTOP 2.0 Institutional Alert",
      message: message
  })
}

export async function downloadTimetableICS() {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Unauthorized")

  const student = await getStudentProfile()
  if (!student) return null

  const timetable = await prisma.timeTable.findMany({
      where: { studentId: student.id },
      include: { course: true }
  })

  const events = timetable.map(t => ({
      title: t.course.title,
      description: `Type: ${t.course.type} | Venue: ${t.venue}`,
      location: t.venue,
      start: new Date().toISOString(), // Simplified for demonstration
      end: new Date().toISOString()
  }))

  return NotifyEngine.generateICS(events)
}

// --- MISSING EXPORTS FOR BUILD COMPATIBILITY ---

export async function getBiometricReports() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  const student = await getStudentProfile()
  if (!student) return []

  return await prisma.biometricReport.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' }
  })
}

export async function getHallTicketEligibility() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { eligible: true, blockers: [] }

  const student = await getStudentProfile()
  if (!student) return { eligible: false, blockers: ['Profile not found'] }

  // Check attendance and dues
  const attendance = await prisma.attendance.findMany({
    where: { studentId: student.id }
  })
  
  const avgAttendance = attendance.length > 0 
    ? attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length 
    : 100

  const dues = await prisma.payment.findMany({
    where: { studentId: student.id, status: 'PENDING' }
  })

  const blockers: string[] = []
  if (avgAttendance < 75) blockers.push('Attendance below 75%')
  if (dues.length > 0) blockers.push('Outstanding fee dues')

  return {
    eligible: blockers.length === 0,
    blockers,
    attendance: avgAttendance.toFixed(1),
    pendingDues: dues.length
  }
}
