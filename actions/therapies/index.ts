"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { therapies } from "@/db/schema"
import { UserExtended } from "../auth/types"
import { eq, and } from "drizzle-orm"

type CreateTherapyInput = {
  patientId: string
  name: string
  description?: string | null
  start_date: Date
  end_date?: Date | null
  notes?: string | null
}

export async function createTherapy(input: CreateTherapyInput) {
  const session = await auth()
  const user = session?.user as UserExtended | undefined
  if(!user?.id || !user?.workspaceId) {
    return {
      error: "User not authenticated or missing workspace"
    }
  }

  try {
    const therapy = await db.insert(therapies).values({
      patientId: input.patientId,
      name: input.name,
      description: input.description || null,
      start_date: input.start_date,
      end_date: input.end_date || null,
      notes: input.notes || null,
      status: "active",
      workspaceId: user.workspaceId,
    }).returning()

    return { data: therapy[0] }
  } catch (error) {
    console.error("Error creating therapy:", error)
    return { error: "Failed to create therapy" }
  }
}

export async function updateTherapyStatus(therapyId: string, status: 'active' | 'completed' | 'cancelled') {
  const session = await auth()
  const user = session?.user as UserExtended | undefined
  if(!user?.id || !user?.workspaceId) {
    return {
      error: "User not authenticated or missing workspace"
    }
  }

  try {
    const therapy = await db.update(therapies)
      .set({ 
        status,
        end_date: status === 'completed' ? new Date() : null,
        updated_at: new Date()
      })
      .where(and(
        eq(therapies.id, therapyId),
        eq(therapies.workspaceId, user.workspaceId)
      ))
      .returning()

    return { data: therapy[0] }
  } catch (error) {
    console.error("Error updating therapy status:", error)
    return { error: "Failed to update therapy status" }
  }
} 