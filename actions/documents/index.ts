"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { UserExtended } from "../auth/types"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"

type CreateDocumentInput = {
  name: string
  file_key: string
  file_url: string
  file_type: string
  file_size: number
  description?: string | null
  patientId: string
}

export async function uploadDocument(input: CreateDocumentInput) {
  const session = await auth()
  const user = session?.user as UserExtended | undefined
  if(!user?.id || !user?.workspaceId) {
    return {
      error: "User not authenticated or missing workspace"
    }
  }

  try {
    const document = await db.insert(documents).values({
      name: input.name,
      file_key: input.file_key,
      file_url: input.file_url,
      file_type: input.file_type,
      file_size: input.file_size,
      description: input.description || null,
      status: "pending",
      patient_id: input.patientId,
      workspaceId: user.workspaceId,
    }).returning()

    revalidatePath(`/dashboard/patients/${input.patientId}`)
    return { data: document[0] }
  } catch (error) {
    console.error("Error creating document:", error)
    return { error: "Failed to create document" }
  }
}

export async function getDocuments(patientId: string) {
  const session = await auth()
  const user = session?.user as UserExtended | undefined
  if(!user?.id || !user?.workspaceId) {
    return {
      error: "User not authenticated or missing workspace"
    }
  }

  try {
    const documentsList = await db.select()
      .from(documents)
      .where(and(
        eq(documents.patient_id, patientId),
        eq(documents.workspaceId, user.workspaceId)
      ))
      .orderBy(documents.created_at)

    return { data: documentsList }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return { error: "Failed to fetch documents" }
  }
}

export async function deleteDocument(documentId: string) {
  const session = await auth()
  const user = session?.user as UserExtended | undefined
  if(!user?.id || !user?.workspaceId) {
    return {
      error: "User not authenticated or missing workspace"
    }
  }

  try {
    const document = await db.delete(documents)
      .where(and(
        eq(documents.id, documentId),
        eq(documents.workspaceId, user.workspaceId)
      ))
      .returning()

    if (document[0]) {
      const ut = new UTApi()
      await ut.deleteFiles([document[0].file_key])
      revalidatePath(`/dashboard/patients/${document[0].patient_id}`)
    }
    return { data: document[0] }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { error: "Failed to delete document" }
  }
} 