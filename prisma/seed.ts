import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning database...')
  const models = ['securityAudit', 'facultyLeave', 'payroll', 'parentAnnouncement', 'eResource', 'libraryDue', 'bookReservation', 'bookIssue', 'book', 'feedbackResponse', 'feedbackSurvey', 'activityPoint', 'achievement', 'clubEvent', 'clubMembership', 'club', 'placementApplication', 'careerOpportunity', 'placementDrive', 'councilAnnouncement', 'communication', 'programmeMigration', 'digitalCredential', 'registrationWindow', 'serviceRequest', 'scholarship', 'feeStructure', 'permissionLetter', 'hostelConsentForm', 'messMenu', 'hostelMaintenance', 'hostelAdmission', 'researchLetter', 'progressReport', 'researchPublication', 'reevaluationRequest', 'gradeHistory', 'seatAllocation', 'examSchedule', 'forumReply', 'forumPost', 'courseAnnouncement', 'assignmentSubmission', 'assignment', 'academicEvent', 'semesterMilestone', 'adminActionLog', 'biometricReport', 'examApplication', 'thesisSubmission', 'leaveRequest', 'payment', 'marks', 'attendance', 'timeTable', 'courseRegistration', 'courseMaterial', 'meeting', 'counsellingRecord', 'course', 'researchProfile', 'studentProfile', 'facultyProfile', 'parentProfile', 'adminProfile', 'user']
  
  for (const model of models) {
    const table = (prisma as Record<string, any>)[model]
    if (table) {
      await table.deleteMany()
    }
  }

  console.log('Seeding database...')

  // 1. Create Faculty
  const facultyUser = await prisma.user.create({
    data: {
      username: 'faculty1',
      password: 'password123', // In production, hash passwords!
      name: 'Dr. Rajesh Kumar',
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

  // 4a. Create more students for Dr. Rajesh Kumar (Proctees)
  const procteesData = [
    { name: 'Siddharth Nair', regNo: '21BCE1002', email: 'sid@vit.edu' },
    { name: 'Ananya Iyer', regNo: '21BCE1003', email: 'ananya@vit.edu' },
    { name: 'Rohan Sharma', regNo: '21BDS0042', email: 'rohan@vit.edu' },
    { name: 'Ishani Gupta', regNo: '21BCI0015', email: 'ishani@vit.edu' },
  ]

  const createdProctees = []
  for (const s of procteesData) {
    const user = await prisma.user.create({
      data: {
        username: s.regNo.toLowerCase(),
        password: 'password123',
        name: s.name,
        role: 'STUDENT',
        email: s.email,
        profile: {
          create: {
            regNo: s.regNo,
            program: 'B.Tech CSE',
            school: 'SCSE',
            batch: '2021-2025',
            cgpa: 8.5 + Math.random(),
            proctorId: facultyProfile?.id,
            mobile: '98765432' + Math.floor(10 + Math.random() * 90),
          }
        }
      }
    })
    const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } })
    if (profile) createdProctees.push(profile)
  }


  // 5. Courses & Attendance
  const courses = [
    { code: 'CSE3002', title: 'Compiler Design', credits: 4, type: 'Theory', category: 'Program Core', slot: 'A1+TA1', venue: 'AB1-202', syllabusUrl: '#' },
    { code: 'CSE3001', title: 'Network Security', credits: 3, type: 'Theory', category: 'Program Core', slot: 'B1+TB1', venue: 'AB1-203', syllabusUrl: '#' },
    { code: 'CSE3005', title: 'Machine Learning', credits: 4, type: 'Theory', category: 'Program Elective', slot: 'C1+TC1', venue: 'AB1-204', syllabusUrl: '#' },
    { code: 'ENG1001', title: 'Professional Communication', credits: 2, type: 'Theory', category: 'University Core', slot: 'D1+TD1', venue: 'AB2-101', syllabusUrl: '#' },
    { code: 'CSE4001', title: 'Deep Learning', credits: 4, type: 'Theory', category: 'Program Elective', slot: 'E1+TE1', venue: 'AB1-502', syllabusUrl: '#' },
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

      // Seed TimeTable for Dr. Rajesh Kumar's courses
      const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
      await prisma.timeTable.create({
          data: {
              studentId: studentProfile.id,
              courseId: course.id,
              day: days[Math.floor(Math.random() * days.length)],
              startTime: '08:00 AM',
              endTime: '08:50 AM',
              venue: course.venue || 'AB1-202',
              slot: course.slot || 'A1'
          }
      })

      // Also register created proctees to these courses
      for (const proctee of createdProctees) {
          await prisma.courseRegistration.upsert({
              where: { studentId_courseId: { studentId: proctee.id, courseId: course.id } },
              update: {},
              create: {
                  studentId: proctee.id,
                  courseId: course.id,
                  status: 'REGISTERED',
                  sem: 'Winter 2024-25'
              }
          })

          // Also seed attendance for proctees
          await prisma.attendance.create({
              data: {
                  studentId: proctee.id,
                  courseId: course.id,
                  attendedClasses: 28,
                  totalClasses: 32,
                  percentage: 87.5
              }
          })
      }
    }
  }

  // 15. Library Module
  const books = [
      { isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', category: 'Computing', totalCopies: 5, availableCopies: 4, location: 'Floor 2, Section A' },
      { isbn: '9780201633610', title: 'Design Patterns', author: 'Erich Gamma', category: 'Computing', totalCopies: 3, availableCopies: 2, location: 'Floor 2, Section B' },
      { isbn: '9780135957059', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Computing', totalCopies: 4, availableCopies: 4, location: 'Floor 2, Section A' },
  ]

  for (const b of books) {
      const book = await prisma.book.create({ data: b })
      
      if (studentProfile && b.title === 'Clean Code') {
          await prisma.bookIssue.create({
              data: {
                  studentId: studentProfile.id,
                  bookId: book.id,
                  status: 'ISSUED',
                  dueDate: new Date('2025-01-25')
              }
          })
      }

      if (studentProfile && b.title === 'Design Patterns') {
          await prisma.bookReservation.create({
              data: {
                  studentId: studentProfile.id,
                  bookId: book.id,
                  status: 'PENDING'
              }
          })
      }
  }

  if (studentProfile) {
      await prisma.libraryDue.create({
          data: {
              studentId: studentProfile.id,
              amount: 5.50,
              reason: 'Late return of "Introduction to Algorithms"',
              status: 'UNPAID'
          }
      })
  }

  await prisma.eResource.createMany({
      data: [
          { title: 'IEEE Xplore Digital Library', type: 'JOURNAL', category: 'Engineering', url: 'https://ieeexplore.ieee.org' },
          { title: 'ACM Digital Library', type: 'JOURNAL', category: 'Computing', url: 'https://dl.acm.org' },
          { title: 'SpringerLink', type: 'EBOOK', category: 'Science', url: 'https://link.springer.com' },
      ]
  })

  // 16. Parent Portal Announcements
  const parent = await prisma.parentProfile.findFirst()
  if (parent) {
      await prisma.parentAnnouncement.createMany({
          data: [
              {
                  parentId: parent.id,
                  title: 'Annual Parent-Teacher Meeting 2025',
                  content: 'The annual PTM is scheduled for Feb 15th at AB1 Auditorium.',
                  priority: 'HIGH'
              },
              {
                  parentId: parent.id,
                  title: 'Quarterly Progress Report Published',
                  content: 'Ward academic performance for Q1 is now available for review.'
              }
          ]
      })
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

  // 6. Leaves & Outings
  if (studentProfile) {
    await prisma.leaveRequest.createMany({
      data: [
        {
          studentId: studentProfile.id,
          type: 'LEAVE',
          category: 'MEDICAL',
          fromDate: new Date('2024-10-01'),
          toDate: new Date('2024-10-10'),
          reason: 'Recovering from fever',
          status: 'APPROVED',
          leaveApproval: 'WARDEN_APPROVED'
        },
        {
          studentId: studentProfile.id,
          type: 'OUTING',
          category: 'WEEKEND',
          fromDate: new Date('2025-01-18'),
          toDate: new Date('2025-01-19'),
          reason: 'Visiting local relatives',
          status: 'PENDING'
        },
        {
          studentId: studentProfile.id,
          type: 'OD',
          category: 'TECHNICAL',
          fromDate: new Date('2025-02-05'),
          toDate: new Date('2025-02-07'),
          reason: 'Annual University Hackathon Participation',
          status: 'APPROVED',
          leaveApproval: 'PROCTOR_APPROVED'
        }
      ]
    })

    await prisma.permissionLetter.create({
        data: {
            studentId: studentProfile.id,
            title: 'Industrial Visit Permission - ISRO',
            type: 'INDUSTRIAL_VISIT',
            url: '#',
            status: 'VALID'
        }
    })
  }

  // 7. Financials
  if (studentProfile) {
    await prisma.feeStructure.createMany({
        data: [
            { name: 'Tuition Fee 2024-25', amount: 198000, category: 'TUITION', academicYear: '2024-25' },
            { name: 'Hostel Fee (Single AC)', amount: 125000, category: 'HOSTEL', academicYear: '2024-25' },
            { name: 'Special Mess Fee', amount: 65000, category: 'MESS', academicYear: '2024-25' }
        ]
    })

    await prisma.payment.createMany({
        data: [
            {
                studentId: studentProfile.id,
                amount: 198000,
                description: 'Annual Tuition Fee Payment',
                type: 'TUITION',
                status: 'PAID',
                dueDate: new Date('2024-07-31'),
                paidDate: new Date('2024-07-15'),
                receiptUrl: '#'
            },
            {
                studentId: studentProfile.id,
                amount: 125000,
                description: 'Hostel Accommodation Fee',
                type: 'HOSTEL',
                status: 'PAID',
                dueDate: new Date('2024-07-31'),
                paidDate: new Date('2024-07-20'),
                receiptUrl: '#'
            },
            {
                studentId: studentProfile.id,
                amount: 65000,
                description: 'Semester Mess Fee',
                type: 'MESS',
                status: 'PENDING',
                dueDate: new Date('2025-01-31')
            }
        ]
    })

    await prisma.scholarship.create({
        data: {
            studentId: studentProfile.id,
            name: 'Merit Scholarship',
            amount: 50000,
            status: 'DISBURSED',
            type: 'UNIVERSITY'
        }
    })

    // 8. Administrative Services
    await prisma.serviceRequest.createMany({
        data: [
            { studentId: studentProfile.id, type: 'BONAFIDE', status: 'COMPLETED', documentUrl: '#' },
            { studentId: studentProfile.id, type: 'TRANSCRIPT', status: 'PROCESSING' }
        ]
    })

    await prisma.digitalCredential.createMany({
        data: [
            { studentId: studentProfile.id, type: 'ID_CARD', cardNumber: '21BCE1001', validUntil: new Date('2025-06-30'), status: 'ACTIVE' },
            { studentId: studentProfile.id, type: 'LIBRARY_CARD', cardNumber: 'LIB-21BCE1001', validUntil: new Date('2025-06-30'), status: 'ACTIVE' },
            { studentId: studentProfile.id, type: 'BUS_PASS', cardNumber: 'BUS-R12-005', validUntil: new Date('2025-05-31'), status: 'ACTIVE' }
        ]
    })

    await prisma.programmeMigration.create({
        data: {
            studentId: studentProfile.id,
            type: 'PROGRAMME_CHANGE',
            currentProgram: 'B.Tech CSE',
            targetProgram: 'B.Tech CSE with AI/ML',
            reason: 'Interested in specialized AI research.',
            status: 'PENDING'
        }
    })

    // 10. Communication Hub
    await prisma.communication.createMany({
        data: [
            {
                type: 'SPOTLIGHT',
                title: 'Winter Semester 2024 Fees Extended',
                content: 'The deadline for Winter 2024-25 fee payment has been extended to Feb 15th without late fee.',
                authorName: 'Registrar Office',
                category: 'ACADEMIC'
            },
            {
                type: 'CIRCULAR',
                title: 'Library 24/7 Operations',
                content: 'Central Library will now remain open 24/7 for Exam preparations from Jan 5th.',
                authorName: 'Librarian',
                category: 'GENERAL'
            },
            {
                type: 'FACULTY_MESSAGE',
                title: 'Final Project Submission Reminder',
                content: 'Please ensure all capstone project documents are uploaded by Friday.',
                authorName: 'Dr. Sarah Wilson',
                targetId: studentProfile.id,
                category: 'ACADEMIC'
            }
        ]
    })

    await prisma.councilAnnouncement.create({
        data: {
            title: 'Cultural Fest Volunteers Needed',
            content: 'Register now to be a student coordinator for Rivera 2025!',
            authorRole: 'President, Student Council'
        }
    })

    // 11. Career & Placements
    const drive = await prisma.placementDrive.create({
        data: {
            companyName: 'Google',
            jobTitle: 'Software Engineer',
            salaryPackage: '32 LPA',
            eligibility: 'CGPA > 8.5',
            driveDate: new Date('2025-02-15'),
            deadline: new Date('2025-02-10'),
            status: 'ACTIVE'
        }
    })

    await prisma.placementApplication.create({
        data: {
            studentId: studentProfile.id,
            driveId: drive.id,
            status: 'SHORTLISTED'
        }
    })

    await prisma.careerOpportunity.createMany({
        data: [
            {
                type: 'INTERNSHIP',
                company: 'Microsoft',
                title: 'Summer Intern 2025',
                location: 'Remote/Bangalore',
                stipend: '1.25 Lakh/month',
                description: '3-month summer internship for pre-final year students.',
                deadline: new Date('2025-03-01')
            },
            {
                type: 'JOB',
                company: 'NVIDIA',
                title: 'AI Research Engineer',
                location: 'Hyderabad',
                salaryPackage: '45 LPA',
                description: 'Full-time role for students with strong AI/ML background.',
                deadline: new Date('2025-03-15')
            }
        ]
    })

    // 13. Extracurricular & Clubs
    const techClub = await prisma.club.create({
        data: {
            name: 'IEEE Computer Society',
            description: 'Advancing technology for humanity through workshops and technical projects.',
            category: 'TECHNICAL',
        }
    })

    const culturalClub = await prisma.club.create({
        data: {
            name: 'Dance Club',
            description: 'Promoting cultural expression through various dance forms.',
            category: 'CULTURAL',
        }
    })

    await prisma.clubMembership.createMany({
        data: [
            { studentId: studentProfile.id, clubId: techClub.id, role: 'COORDINATOR' },
            { studentId: studentProfile.id, clubId: culturalClub.id, role: 'MEMBER' }
        ]
    })

    await prisma.clubEvent.createMany({
        data: [
            {
                clubId: techClub.id,
                title: 'Data Science Workshop',
                description: 'A 2-day intensive workshop on modern data science techniques.',
                date: new Date('2025-02-20'),
                location: 'SJT-Seminar Hall',
                points: 10
            },
            {
                clubId: culturalClub.id,
                title: 'Annual Cultural Night',
                description: 'The biggest cultural extravaganza of the year.',
                date: new Date('2025-03-10'),
                location: 'Anna Auditorium',
                regLink: 'https://vtop.vit.edu/events/dance-night',
                points: 5
            }
        ]
    })

    await prisma.achievement.createMany({
        data: [
            {
                studentId: studentProfile.id,
                title: 'Global Hackathon 2024 - Winner',
                category: 'TECHNICAL',
                description: 'Won the first prize in the Smart City track.',
                date: new Date('2024-11-15'),
                status: 'VERIFIED'
            },
            {
                studentId: studentProfile.id,
                title: 'Inter-University Coding Contest',
                category: 'TECHNICAL',
                description: 'Top 10 finalist among 5000+ participants.',
                date: new Date('2025-01-05'),
                status: 'PENDING'
            }
        ]
    })

    await prisma.activityPoint.createMany({
        data: [
            { studentId: studentProfile.id, type: 'EXC', points: 15, description: 'Club coordination and event participation.' },
            { studentId: studentProfile.id, type: 'CO_CURRICULAR', points: 25, description: 'Technical workshops and certifications.' }
        ]
    })

    // 14. Feedback & Surveys
    const courseSurvey = await prisma.feedbackSurvey.create({
        data: {
            type: 'COURSE',
            title: 'Course Feedback - Winter 2024-25',
            description: 'Mandatory course evaluation for the current semester.',
        }
    })

    await prisma.feedbackSurvey.create({
        data: {
            type: 'FACULTY',
            title: 'Faculty Evaluation - Winter 2024-25',
            description: 'Evaluate faculty teaching effectiveness and responsiveness.',
        }
    })

    await prisma.feedbackResponse.create({
        data: {
            surveyId: courseSurvey.id,
            studentId: studentProfile.id,
            courseId: 'CSE3002', // Mapped to code for simplicity in mock
            content: JSON.stringify({
                q1: 5,
                q2: 4,
                comments: 'Excellent course content and delivery.'
            })
        }
    })
  }

  // 12. Registration Windows
  await prisma.registrationWindow.createMany({
      data: [
          {
              name: 'Winter 2024-25 Course Registration',
              type: 'COURSE',
              startDate: new Date('2024-01-10'),
              endDate: new Date('2024-01-20'),
              status: 'CLOSED',
              academicYear: '2024-25'
          },
          {
              name: 'Summer 2025 Semester Registration',
              type: 'SEMESTER',
              startDate: new Date('2025-05-15'),
              endDate: new Date('2025-05-25'),
              status: 'UPCOMING',
              academicYear: '2024-25'
          }
      ]
  })

  // 10. Research
  if (studentProfile && facultyProfile) {
    const researchProfile = await prisma.researchProfile.create({
      data: {
        studentId: studentProfile.id,
        supervisorId: facultyProfile.id,
        researchArea: 'Privacy Preserving Machine Learning',
        fellowshipStatus: 'SRF',
        publicationsCount: 3,
        citations: 12,
        hIndex: 2,
        thesisStatus: 'Mid-Term Review Completed'
      }
    })

    await prisma.researchPublication.createMany({
      data: [
        {
          researchProfileId: researchProfile.id,
          title: 'Secure Multi-party Computation for Federated Learning',
          journal: 'IEEE Transactions on Dependable and Secure Computing',
          year: 2023,
          doi: '10.1109/TDSC.2023.1234567',
          type: 'JOURNAL',
          authors: 'Verma, A., Smith, J.'
        },
        {
          researchProfileId: researchProfile.id,
          title: 'Efficient Privacy Protocols for Large Scale Learning',
          journal: 'ACM CCS',
          year: 2024,
          type: 'CONFERENCE',
          status: 'ACCEPTED',
          authors: 'Verma, A., Smith, J.'
        }
      ]
    })

    await prisma.progressReport.create({
      data: {
        researchProfileId: researchProfile.id,
        title: 'Quarterly Progress Report - Q4 2023',
        content: 'Completed the initial prototype for secure aggregation.',
        status: 'APPROVED',
        supervisorComment: 'Excellent progress, proceed to large scale testing.'
      }
    })

    await prisma.researchLetter.create({
      data: {
        researchProfileId: researchProfile.id,
        title: 'Fellowship Sanction Letter',
        type: 'FELLOWSHIP',
        url: '#'
      }
    })
  }

  // 8. Hostel
  if (studentProfile) {
      await prisma.hostelAdmission.create({
          data: {
              studentId: studentProfile.id,
              type: 'ADMISSION',
              status: 'APPROVED',
              block: 'Block-L',
              roomPref: 'Single AC',
              messPref: 'Special Mess'
          }
      })

      await prisma.hostelMaintenance.create({
          data: {
              studentId: studentProfile.id,
              block: 'Block-L',
              roomNo: '402',
              category: 'WIFI',
              issue: 'Low signal strength in the room',
              status: 'OPEN'
          }
      })

      await prisma.hostelConsentForm.create({
          data: {
              studentId: studentProfile.id,
              type: 'INTERNSHIP',
              status: 'APPROVED',
              url: '#'
          }
      })
  }

  await prisma.messMenu.createMany({
      data: [
          {
              messName: 'Special Mess',
              day: 'MONDAY',
              breakfast: 'Idli, Sambhar, Vada, Fruits',
              lunch: 'Paneer Butter Masala, Roti, Dal Makhani, Rice, Curd',
              snacks: 'Samosa, Tea/Coffee',
              dinner: 'Veg Biryani, Salan, Raita, Gulab Jamun'
          },
          {
              messName: 'Special Mess',
              day: 'TUESDAY',
              breakfast: 'Puri, Aloo Sabzi, Sprouts',
              lunch: 'Kadai Chicken/Paneer, Naan, Jeera Rice, Dal Tadka',
              snacks: 'Sandwich, Juice',
              dinner: 'Malai Kofta, Paratha, Rice, Ice Cream'
          }
      ]
  })

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

  // --- FACULTY ADMIN SEEDING ---
  if (facultyProfile) {
    console.log('Seeding Faculty Admin data...')
    await prisma.payroll.createMany({
        data: [
            {
                facultyId: facultyProfile.id,
                month: 'December',
                year: '2025',
                basePay: 120000,
                allowances: 15000,
                deductions: 5000,
                netPay: 130000,
                status: 'PAID'
            },
            {
                facultyId: facultyProfile.id,
                month: 'November',
                year: '2025',
                basePay: 120000,
                allowances: 15000,
                deductions: 5000,
                netPay: 130000,
                status: 'PAID'
            }
        ]
    })

    await prisma.facultyLeave.createMany({
        data: [
            {
                facultyId: facultyProfile.id,
                type: 'CASUAL',
                fromDate: new Date('2026-01-10'),
                toDate: new Date('2026-01-12'),
                reason: 'Family event',
                status: 'APPROVED'
            },
            {
                facultyId: facultyProfile.id,
                type: 'MEDICAL',
                fromDate: new Date('2026-02-05'),
                toDate: new Date('2026-02-06'),
                reason: 'Dental checkup',
                status: 'PENDING'
            }
        ]
    })
  }

  // --- SECURITY AUDIT SEEDING ---
  console.log('Seeding Security Audit logs...')
  await prisma.securityAudit.createMany({
      data: [
          {
              userId: facultyUser.id,
              event: 'LOGIN',
              ipAddress: '192.168.1.1',
              device: 'MacBook Pro / Chrome'
          },
          {
              userId: studentUser.id,
              event: 'PASSWORD_CHANGE',
              ipAddress: '192.168.1.5',
              device: 'iPhone 15 / Safari'
          },
          {
              userId: studentUser.id,
              event: '2FA_ENABLED',
              ipAddress: '192.168.1.5',
              device: 'iPhone 15 / Safari'
          }
      ]
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
