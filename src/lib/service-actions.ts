"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStudentProfile } from "@/lib/actions"

export async function getServiceRequests() {
  const profile = await getStudentProfile()
  if (!profile) return []

  return await prisma.serviceRequest.findMany({
    where: { studentId: profile.id },
    orderBy: { requestDate: 'desc' }
  })
}

export async function createServiceRequest(type: string, details?: string) {
  const profile = await getStudentProfile()
  if (!profile) throw new Error("Unauthorized")

  return await prisma.serviceRequest.create({
    data: {
      studentId: profile.id,
      type,
      status: 'PENDING',
      requestDate: new Date(),
    }
  })
}
