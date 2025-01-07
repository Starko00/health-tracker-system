'use server'
import { auth, signIn } from "@/auth";
import { db } from "@/db";
import { users, workspaceMembers, workspaces } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export   const handleGoogleSignIn = async function() {
   
    await signIn("google");
  };

  export const getUserDetails = async ()=> {
    const session = await auth()
    if(!session) return null
    const data = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: workspaceMembers.role,
        workspaceId: users.workspaceId,
        workspace_name: workspaces.name
    }).from(users).leftJoin(workspaceMembers,and( eq(users.id, workspaceMembers.userId),eq(workspaceMembers.workspaceId,users.workspaceId))).leftJoin(workspaces,eq(users.workspaceId,workspaces.id)).where(eq(users.id,session.user?.id as string))
    if(data.length === 0) return null
    return data[0]
  }