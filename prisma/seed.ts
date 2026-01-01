import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning database...')
  const models = ['reevaluationRequest', 'gradeHistory', 'seatAllocation', 'examSchedule', 'forumReply', 'forumPost', 'courseAnnouncement', 'assignmentSubmission', 'assignment', 'academicEvent', 'semesterMilestone', 'adminActionLog', 'biometricReport', 'examApplication', 'thesisSubmission', 'leaveRequest', 'payment', 'marks', 'attendance', 'timeTable', 'courseRegistration', 'courseMaterial', 'meeting', 'counsellingRecord', 'course', 'researchProfile', 'studentProfile', 'facultyProfile', 'parentProfile', 'adminProfile', 'user']
  
  for (const model of models) {
    if ((prisma as any)[model]) {
      await (prisma as any)[model].deleteMany()
    }
  }

  console.log('Seeding database...')

  // 1. Create Faculty
  const facultyUser = await prisma.user.create({
    data: {
      username: 'faculty1',
      password: 'password', // In production, hash passwords!
      name: 'Dr. John Smith',
      role: 'FACULTY',
      email: 'john.smith@vit.edu',
      facultyProfile: {
        create: {
          empId: 'FAC001',
          designation: 'Professor',
          school: 'SCSE',
          mobile: '9876543210',
          cabin: 'AB1-402',
          photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
          apaarId: 'APAAR-FAC-001',
          emergencyName: 'Mary Smith',
          emergencyPhone: '9876543211',
          joiningDate: new Date('2015-06-01')
        }
      }
    }
  })

  const facultyProfile = await prisma.facultyProfile.findUnique({ where: { userId: facultyUser.id } })

  // 2. Create Student
  const studentUser = await prisma.user.create({
    data: {
      username: 'student1',
      password: 'password',
      name: 'Arsh Verma',
      role: 'STUDENT',
      email: 'arsh@vit.edu',
      profile: {
        create: {
          regNo: '21BCE1001',
          applicationNo: 'APP20210001',
          program: 'B.Tech Computer Science and Engineering',
          school: 'School of Computer Science and Engineering',
          batch: '2021-2025',
          cgpa: 9.05,
          proctorId: facultyProfile?.id,
          dob: new Date('2003-08-15'),
          bloodGroup: 'B+',
          mobile: '9988776655',
          aadharNo: '1234-5678-9012',
          nativePlace: 'New Delhi',
          nationality: 'Indian',
          apaarId: 'APAAR-STU-001',
          emergencyName: 'Mr. Verma',
          emergencyPhone: '9988776644',
          bankAccount: '123456789012',
          bankIfsc: 'SBIN0001234',
          joiningDate: new Date('2021-07-15'),
          abcId: 'ABC-123-456-789',
          hostelBlock: 'BLOCK-1',
          hostelRoom: '402-A',
          hostelMess: 'VEG-MESS',
          photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'
        }
      }
    }
  })

  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentUser.id } })

  // 3. Create Parent
  await prisma.user.create({
    data: {
      username: 'parent1',
      password: 'password',
      name: 'Mr. Verma',
      role: 'PARENT',
      email: 'parent@example.com',
      parentProfile: {
        create: {
          studentId: studentProfile?.id,
          mobile: '9988776655',
          emergencyName: 'Mrs. Verma',
          emergencyPhone: '9988776633'
        }
      }
    }
  })

  // 4. Create Admin
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'password',
      name: 'System Administrator',
      role: 'ADMIN',
      email: 'admin@vit.edu',
      adminProfile: {
        create: {
          level: 3
        }
      }
    }
  })

  // 5. Courses & Attendance
  const courses = [
    { code: 'CSE3002', title: 'Compiler Design', credits: 4, type: 'Theory', category: 'Program Core', slot: 'A1+TA1', venue: 'AB1-202', syllabusUrl: '#' },
    { code: 'CSE3001', title: 'Network Security', credits: 3, type: 'Theory', category: 'Program Core', slot: 'B1+TB1', venue: 'AB1-203', syllabusUrl: '#' },
    { code: 'CSE3005', title: 'Machine Learning', credits: 4, type: 'Theory', category: 'Program Elective', slot: 'C1+TC1', venue: 'AB1-204', syllabusUrl: '#' },
    { code: 'ENG1001', title: 'Professional Communication', credits: 2, type: 'Theory', category: 'University Core', slot: 'D1+TD1', venue: 'AB2-101', syllabusUrl: '#' },
  ]

  for (const c of courses) {
    const course = await prisma.course.create({
      data: { ...c, facultyId: facultyProfile?.id }
    })

    if (studentProfile) {
      await prisma.attendance.create({
        data: {
          studentId: studentProfile.id,
          courseId: course.id,
          attendedClasses: 32,
          totalClasses: 36,
          percentage: 88.8
        }
      })

      await prisma.courseRegistration.create({
          data: {
              studentId: studentProfile.id,
              courseId: course.id,
              status: 'REGISTERED',
              sem: 'Winter 2024-25'
          }
      })

      await prisma.courseMaterial.createMany({
          data: [
              { courseId: course.id, title: 'Lecture Notes - Module 1', type: 'NOTES', url: '#' },
              { courseId: course.id, title: 'Lab Manual', type: 'ASSIGNMENT', url: '#' },
              { courseId: course.id, title: 'Reference Video', type: 'VIDEO', url: '#' },
          ]
      })


      // Seed Assignments
      const assignment = await prisma.assignment.create({
          data: {
              courseId: course.id,
              title: `Digital Assignment 1 - ${c.code}`,
              description: `Implement the core concepts of ${c.title} as discussed in Module 1.`,
              dueDate: new Date('2025-02-15'),
              fileUrl: '#'
          }
      })

      await prisma.assignmentSubmission.create({
          data: {
              assignmentId: assignment.id,
              studentId: studentProfile.id,
              fileUrl: '#',
              status: 'SUBMITTED'
          }
      })

      // Seed Announcements
      await prisma.courseAnnouncement.create({
          data: {
              courseId: course.id,
              title: 'Class Postponed',
              content: `The class for ${c.code} scheduled for tomorrow is postponed to Friday.`
          }
      })

      // Seed Forum Post
      const post = await prisma.forumPost.create({
          data: {
              courseId: course.id,
              authorId: studentUser.id,
              title: `Doubt in ${c.title}`,
              content: `Can someone explain the integration of modules in ${c.code}?`
          }
      })

      await prisma.forumReply.create({
          data: {
              postId: post.id,
              authorId: facultyUser.id,
              content: 'I will explain this in the next class session.'
          }
      })

      // Seed Exam Schedules
      const examTypes = ['CAT-1', 'CAT-2', 'FAT', 'QUIZ']
      for (const type of examTypes) {
          const exam = await prisma.examSchedule.create({
              data: {
                  courseId: course.id,
                  courseCode: c.code,
                  courseTitle: c.title,
                  examDate: type === 'CAT-1' ? new Date('2025-02-10') : 
                            type === 'CAT-2' ? new Date('2025-03-25') :
                            type === 'FAT' ? new Date('2025-05-05') : new Date('2025-02-20'),
                  slot: c.slot || "TBD",
                  venue: 'AB1-404',
                  type,
                  mode: 'OFFLINE'
              }
          })

          if (studentProfile) {
              await prisma.seatAllocation.create({
                  data: {
                      examScheduleId: exam.id,
                      studentId: studentProfile.id,
                      roomNo: 'SJT-505',
                      seatNo: `B-${Math.floor(Math.random() * 50) + 1}`
                  }
              })
          }
      }

      // Seed Marks (Enhanced)
      if (studentProfile) {
          const marks = await prisma.marks.create({
              data: {
                  studentId: studentProfile.id,
                  courseId: course.id,
                  cat1: Math.floor(Math.random() * 15) + 30, // out of 50
                  cat2: Math.floor(Math.random() * 15) + 30, // out of 50
                  da1: 10,
                  da2: 10,
                  quiz: 8,
                  pbl: 18,
                  fat: Math.floor(Math.random() * 30) + 60, // out of 100
                  total: 82,
                  grade: 'A',
                  attendance: 92.5
              }
          })

          // Seed Grade History
          await prisma.gradeHistory.create({
              data: {
                  studentId: studentProfile.id,
                  semester: 'Winter 2024',
                  courseCode: c.code,
                  courseTitle: c.title,
                  credits: c.credits,
                  grade: 'A',
                  gradePoint: 9,
                  result: 'PASS'
              }
          })

          // Seed Re-evaluation (Optional)
          if (c.code === 'CSE1001') {
              await prisma.reevaluationRequest.create({
                  data: {
                      marksId: marks.id,
                      studentId: studentProfile.id,
                      type: 'SEE',
                      status: 'COMPLETED',
                      feePaid: true
                  }
              })
          }
      }
    }
  }

  // Seed some historical grade records across semesters
  const student = await prisma.studentProfile.findFirst()
  if (student) {
      const historicalRecords = [
          { sem: 'Fall 2023', code: 'MAT1011', title: 'Calculus', credits: 4, grade: 'S', point: 10 },
          { sem: 'Fall 2023', code: 'PHY1011', title: 'Physics', credits: 4, grade: 'B', point: 8 },
          { sem: 'Winter 2023', code: 'ENG1011', title: 'English', credits: 2, grade: 'A', point: 9 },
      ]

      for (const rec of historicalRecords) {
          await prisma.gradeHistory.create({
              data: {
                  studentId: student.id,
                  semester: rec.sem,
                  courseCode: rec.code,
                  courseTitle: rec.title,
                  credits: rec.credits,
                  grade: rec.grade,
                  gradePoint: rec.point,
                  result: 'PASS'
              }
          })
      }
  }

  // 6. Leaves
  if (studentProfile) {
    await prisma.leaveRequest.create({
      data: {
        studentId: studentProfile.id,
        type: 'Scholar',
        fromDate: new Date('2024-10-01'),
        toDate: new Date('2024-10-10'),
        reason: 'Research conference attendance',
        status: 'PENDING'
      }
    })
  }

  // 7. Research
  if (studentProfile) {
    await prisma.researchProfile.create({
      data: {
        studentId: studentProfile.id,
        publications: 3,
        citations: 12,
        hIndex: 2,
        thesisStatus: 'Researching'
      }
    })
  }

  // 9. Meetings & Counselling
  if (studentProfile && facultyProfile) {
    await prisma.meeting.createMany({
        data: [
            {
                studentId: studentProfile.id,
                facultyId: facultyProfile.id,
                title: 'Monthly Progress Review',
                date: new Date('2024-11-20'),
                time: '10:00 AM',
                venue: facultyProfile.cabin,
                status: 'COMPLETED',
                notes: 'Student is performing well in all subjects. Recommended for research internship.'
            },
            {
                studentId: studentProfile.id,
                facultyId: facultyProfile.id,
                title: 'Semester Registration Discussion',
                date: new Date('2025-01-15'),
                time: '02:30 PM',
                venue: 'Virtual (Zoom)',
                status: 'SCHEDULED'
            }
        ]
    })

    await prisma.counsellingRecord.create({
        data: {
            studentId: studentProfile.id,
            facultyId: facultyProfile.id,
            date: new Date('2024-11-25'),
            summary: 'Discussed career goals and placement preparation. Encouraged participation in hackathons.',
            actionTaken: 'Shared resources for interview prep.',
            priority: 'NORMAL'
        }
    })
  }

  // 10. Academic Events & Milestones
  await prisma.academicEvent.createMany({
      data: [
          { title: 'Republic Day', date: new Date('2025-01-26'), type: 'HOLIDAY', description: 'National Holiday' },
          { title: 'University Cultural Fest', date: new Date('2025-02-14'), endDate: new Date('2025-02-16'), type: 'CULTURAL', description: 'Annual cultural extravaganza' },
          { title: 'Holi', date: new Date('2025-03-14'), type: 'HOLIDAY', description: 'Festival of Colors' },
      ]
  })

  await prisma.semesterMilestone.createMany({
      data: [
          { title: 'CAT-1 Examinations', date: new Date('2025-02-10'), type: 'EXAM', sem: 'Winter 24-25' },
          { title: 'CAT-2 Examinations', date: new Date('2025-03-25'), type: 'EXAM', sem: 'Winter 24-25' },
          { title: 'Course Add/Drop Period Ends', date: new Date('2025-01-20'), type: 'REGISTRATION', sem: 'Winter 24-25' },
          { title: 'Final Assessment Test (FAT)', date: new Date('2025-05-05'), type: 'EXAM', sem: 'Winter 24-25' },
      ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
