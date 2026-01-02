
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding for Arsh Verma (24BCG10026)...')

  // 1. Create Faculty (Proctor & Course Instructor)
  const facultyPassword = 'password123'
  const facultyUser = await prisma.user.upsert({
    where: { username: 'faculty1' },
    update: {
        name: 'Dr. Rajesh Kumar',
        password: facultyPassword
    },
    create: {
      username: 'faculty1',
      password: facultyPassword, // hashed password
      name: 'Dr. Rajesh Kumar',
      role: 'FACULTY',
      email: 'rajesh.kumar@vitbhopal.ac.in',
      facultyProfile: {
        create: {
          empId: '1001',
          designation: 'Senior Professor',
          school: 'SCOPE',
          mobile: '9876543210',
          cabin: 'AB-1 405',
          photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          joiningDate: new Date('2018-06-15'),
        }
      }
    },
    include: { facultyProfile: true }
  })
  
  const facultyProfile = await prisma.facultyProfile.upsert({
    where: { userId: facultyUser.id },
    update: {
        empId: '1001',
        designation: 'Senior Professor',
        school: 'SCOPE',
        mobile: '9876543210',
        cabin: 'AB-1 405',
        photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        joiningDate: new Date('2018-06-15'),
    },
    create: {
        userId: facultyUser.id,
        empId: '1001',
        designation: 'Senior Professor',
        school: 'SCOPE',
        mobile: '9876543210',
        cabin: 'AB-1 405',
        photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        joiningDate: new Date('2018-06-15'),
    }
  })

  // const facultyId = facultyUser.facultyProfile?.id 
  const facultyId = facultyProfile.id
  if (!facultyId) throw new Error("Faculty profile creation failed")

  console.log(`👨‍🏫 Created Faculty: ${facultyUser.name}`)

  // 2. Create Student (Arsh Verma)
  const studentPassword = 'password123'
  const studentUser = await prisma.user.upsert({
    where: { username: '24BCG10026' },
    update: {
        role: 'STUDENT',
        name: 'Arsh Verma',
        profile: {
            update: {
                regNo: '24BCG10026',
                program: 'B.Tech CSE (Gaming Technology)',
                school: 'SCOPE', 
                batch: '2024',
                cgpa: 9.42,
                proctorId: facultyId,
                hostelBlock: 'Block-3',
                hostelRoom: '402',
                hostelMess: 'Special Mess (Non-Veg)',
                dob: new Date('2005-08-15'),
                bloodGroup: 'O+',
                mobile: '9988776655',

                photoUrl: 'https://github.com/ArshVerma.png',
            }
        }
    },
    create: {
      username: '24BCG10026',
      password: studentPassword, 
      name: 'Arsh Verma',
      role: 'STUDENT',
      email: 'arsh.verma2024@vitbhopal.ac.in',
      profile: {
        create: {
          regNo: '24BCG10026',
          applicationNo: '2024100523',
          program: 'B.Tech CSE (Gaming Technology)',
          school: 'SCOPE',
          batch: '2024',
          cgpa: 9.42,
          proctorId: facultyId,
          hostelBlock: 'Block-3',
          hostelRoom: '402',
          hostelMess: 'Special Mess (Non-Veg)',
          dob: new Date('2005-08-15'),
          bloodGroup: 'O+',
          mobile: '9988776655',
          nationality: 'Indian',
          photoUrl: 'https://github.com/ArshVerma.png',
          joiningDate: new Date('2024-07-20'),
        }
      }
    },
    include: { profile: true }
  })
  
  const studentId = studentUser.profile?.id 
  if (!studentId) throw new Error("Student profile creation failed")

  console.log(`👨‍🎓 Created Student: ${studentUser.name} (${studentUser.profile?.regNo})`)

  // 3. Create Parent (Mr. Verma)
  const parentPassword = 'password123'
  const parentUser = await prisma.user.upsert({
    where: { username: 'parent_arsh' },
    update: {
        role: 'PARENT',
        parentProfile: {
            update: {
                studentId: studentId
            }
        }
    },
    create: {
      username: 'parent_arsh',
      password: parentPassword,
      name: 'Mr. Verma',
      role: 'PARENT',
      email: 'parent.arsh@example.com',
      parentProfile: {
        create: {
          studentId: studentId,
          mobile: '9876500000',
          emergencyName: 'Mrs. Verma',
          emergencyPhone: '9876500001'
        }
      }
    }
  })
  
  console.log(`👨‍👩‍👦 Created Parent: ${parentUser.name}`)

  // 4. Create Courses
  const coursesData = [
    { code: 'CSE1001', title: 'Problem Solving and Programming', credits: 3, type: 'Lab', slot: 'L25+L26', venue: 'AB-1 204' },
    { code: 'CSE2001', title: 'Data Structures and Algorithms', credits: 4, type: 'Theory', slot: 'A1+TA1', venue: 'AB-1 305' },
    { code: 'MAT1001', title: 'Calculus for Engineers', credits: 4, type: 'Theory', slot: 'B1+TB1', venue: 'AB-2 101' },
    { code: 'PHY1001', title: 'Engineering Physics', credits: 4, type: 'Lab', slot: 'L11+L12', venue: 'Lab Complex 2' },
    { code: 'ENG1001', title: 'Technical Communication', credits: 2, type: 'Theory', slot: 'C1', venue: 'AB-1 108' },
    { code: 'GAM1001', title: 'Introduction to Game Design', credits: 3, type: 'Project', slot: 'D1', venue: 'Gaming Lab' },
  ]

  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: {
        ...c,
        facultyId: facultyId
      }
    })

    // 5. Enroll Student (CourseRegistration)
    await prisma.courseRegistration.upsert({
      where: {
        studentId_courseId: { studentId, courseId: course.id }
      },
      update: {},
      create: {
        studentId,
        courseId: course.id,
        sem: 'Fall 2024',
        year: '2024-25'
      }
    })

    // 6. Create Attendance
    const attended = Math.floor(Math.random() * 10) + 30 // 30-40
    const total = 45
    const percentage = (attended / total) * 100

    await prisma.attendance.upsert({
      where: {
        studentId_courseId: { studentId, courseId: course.id }
      },
      update: { attendedClasses: attended, totalClasses: total, percentage },
      create: {
        studentId,
        courseId: course.id,
        attendedClasses: attended,
        totalClasses: total,
        percentage
      }
    })

    // 7. Create Marks
    await prisma.marks.upsert({
      where: {
        studentId_courseId: { studentId, courseId: course.id }
      },
      update: {},
      create: {
        studentId,
        courseId: course.id,
        cat1: Math.random() * 15 + 35, // 35-50
        cat2: Math.random() * 10 + 40, // 40-50
        fat: Math.random() * 20 + 70, // 70-90
        da1: 10,
        da2: 10,
        quiz: 10,
        total: 94,
        grade: 'S'
      }
    })
    
    // 8. Create TimeTable Entries
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    const day = days[Math.floor(Math.random() * days.length)]
    
    await prisma.timeTable.create({
        data: {
            studentId,
            courseId: course.id,
            day: day,
            startTime: '08:00 AM',
            endTime: '08:50 AM',
            venue: c.venue || 'AB-1',
            slot: c.slot || 'A1'
        }
    })

    console.log(`📚 Processed Course: ${c.code}`)

    // 9. Create Exam Schedule
    await prisma.examSchedule.createMany({
        data: [
            { courseId: course.id, courseCode: c.code, courseTitle: c.title, type: 'CAT-1', examDate: new Date('2025-02-15T09:00:00Z'), slot: 'A1', venue: 'AB-1 204' },
            { courseId: course.id, courseCode: c.code, courseTitle: c.title, type: 'FAT', examDate: new Date('2025-05-10T09:00:00Z'), slot: 'A1', venue: 'AB-2 301' }
        ]
    })
  }

  // 10. Create Financial Data
  await prisma.payment.createMany({
    data: [
        { studentId, amount: 98000, type: 'TUITION', description: 'Winter Semester 2024-25', status: 'PAID', dueDate: new Date('2024-12-15'), paidDate: new Date('2024-12-10') },
        { studentId, amount: 65000, type: 'HOSTEL', description: 'Hostel & Mess Charges', status: 'PENDING', dueDate: new Date('2025-01-31') }
    ]
  })

  // 11. Create Hostel Data
  await prisma.hostelAdmission.create({
    data: {
        studentId,
        block: 'Block-3',
        roomPref: '2 Bedded AC',
        status: 'APPROVED',
        appliedAt: new Date('2024-06-01')
    }
  })

  await prisma.hostelMaintenance.create({
    data: {
        studentId,
        block: 'Block-3',
        roomNo: '402',
        category: 'ELECTRICAL',
        issue: 'Fan Regulator Not Working',
        status: 'OPEN'
    }
  })

  // 12. Create Feedback/Survey
  const survey = await prisma.feedbackSurvey.create({
    data: {
        title: 'Course Evaluation Fall 2024',
        description: 'Mandatory feedback for registered courses.',
        type: 'COURSE',
        status: 'ACTIVE'
    }
  })

  // 13. Create Service Request History
  await prisma.serviceRequest.create({
    data: {
        studentId,
        type: 'BONAFIDE',
        status: 'COMPLETED',
        requestDate: new Date('2024-09-10'),
        completionDate: new Date('2024-09-12')
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
