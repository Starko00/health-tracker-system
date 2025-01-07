'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"


export async function updateFirstTimeUser({ name, image }: { name: string, image: string }) {

    const session = await auth()
    console.log(session)
    if (!session) throw new Error("Unauthorized")
    const updateUser = await db.update(users).set({ name, image }).where(eq(users.email, session.user?.email as string))
    return { success: true }
}