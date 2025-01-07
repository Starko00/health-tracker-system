'use server'

import { auth } from "@/auth"
import {  users, workspaceMembers, workspaces } from "@/db/schema"
import { UserExtended } from "../auth/types"
import { eq } from "drizzle-orm"
import { db } from "@/db"


export const createWorkspace = async function(name: string){
    // Get the current user's session
    const session = await auth()
    if(!session) return
    const user = session.user as UserExtended

    // Only create a workspace if the user isn't already in one
    if(!user.workspaceId){
        // Create the new workspace
        const new_workspace = await db.insert(workspaces).values({
           name: name,
        }).returning()
      
        // Perform two operations in parallel:
        // 1. Add the user as a member of the workspace
        // 2. Update the user's workspaceId
        const results = await Promise.all([
             db.insert(workspaceMembers).values({
                userId: user.id,
                workspaceId: new_workspace[0].id,
                role: 'user'
            }),
             db.update(users).set({
                workspaceId: new_workspace[0].id
            }).where(eq(users.id, user.id))
        ])
        
        return {success: true, workspaceId: new_workspace[0].id}
    }
}