'use server'

import { auth } from "@/auth";
import { db } from "@/db";
import {appointment_availability} from "@/db/schema";
import { UserExtended } from "../auth/types";
import { z } from "zod";
import { inputAvailabilitySchema } from "./types";
import { eq } from "drizzle-orm";

type AvailabilityResponse = {
  error?: string;
  data?: typeof appointment_availability.$inferSelect;
}

export async function createAppointmentAvailability(data: typeof appointment_availability.$inferInsert): Promise<AvailabilityResponse> {
    const session = await auth();
    if(!session) {
        return {
            error: "Unauthorized"
        }
     }
     const user = session.user as UserExtended
     const new_availability = await db.insert(appointment_availability).values({
       duration: data.duration,
       end_time: data.end_time,
       start_time: data.start_time,
       user_id: user.id,
       workspaceId: user.workspaceId as string,
       daily_availability: data.daily_availability,
     }).returning()

     return { data: new_availability[0] }
}

export async function getAppointmentAvailability(): Promise<AvailabilityResponse> {
    const session = await auth();
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }
    const availability = await db.select().from(appointment_availability).where(eq(appointment_availability.user_id, user.id))
    return { data: availability[0] }
}

export async function updateAppointmentAvailability(data: typeof appointment_availability.$inferInsert): Promise<AvailabilityResponse> {
    const session = await auth();
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }

    const updated = await db.update(appointment_availability)
        .set({
            duration: data.duration,
            end_time: data.end_time,
            start_time: data.start_time,
            daily_availability: data.daily_availability,
        })
        .where(eq(appointment_availability.user_id, user.id))
        .returning()

    return { data: updated[0] }
}