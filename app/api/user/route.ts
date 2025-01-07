import { auth } from "@/auth";
import { db } from "@/db";
import { users, workspaceMembers, workspaces } from "@/db/schema";

import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type WorkspaceResponse = {
  workspaceId: string | null;
  role: 'owner' | 'admin' | 'member' | null;
}

type ApiResponse = {
  response: WorkspaceResponse;
  message: string;
}

export const GET = auth(async function (req) {
  try {
    const id = req.headers.get('Authorization')?.split(' ')[1] 
  
    
    if(!id){
        return NextResponse.json({
            response: null,
            message: "Unauthorized"
          }, { status: 401 });
    }
    const data = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: workspaceMembers.role,
        workspaceId: users.workspaceId,
        workspace_name: workspaces.name
    }).from(users).leftJoin(workspaceMembers,and( eq(users.id, workspaceMembers.userId),eq(workspaceMembers.workspaceId,users.workspaceId))).leftJoin(workspaces,eq(users.workspaceId,workspaces.id)).where(eq(users.id,id))
    return NextResponse.json({
        response: {
            id: data[0]?.id,
            name: data[0]?.name,
            email: data[0]?.email,
            image: data[0]?.image,
            role: data[0]?.role,
            workspace_name: data[0]?.workspace_name,
            workspaceId: data[0]?.workspaceId,
        },
        message: "Success"
      });
  } catch (error) {
    
    return NextResponse.json({
      response: null,
      message: "Server Error"
    }, { status: 500 });
  }
    
})  as any

