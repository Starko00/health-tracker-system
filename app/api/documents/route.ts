import { auth } from "@/auth"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { UserExtended } from "@/actions/auth/types"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  const session = await auth()
  const user = session?.user as UserExtended | undefined
  if(!user?.id || !user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const {
      name,
      file_key,
      file_url,
      file_type,
      file_size,
      description,
      patientId,
    } = await req.json()

    const document = await db.insert(documents).values({
      name,
      file_key,
      file_url,
      file_type,
      file_size,
      description: description || null,
      status: "pending",
      patient_id: patientId,
      workspaceId: user.workspaceId,
    }).returning()

    revalidatePath(`/dashboard/patients/${patientId}`)
    return NextResponse.json({ data: document[0] })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
} 