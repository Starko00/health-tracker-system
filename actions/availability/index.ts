'use server'

import { auth } from "@/auth";
import { db } from "@/db";
import {appointment_availability, appointments, patients} from "@/db/schema";
import { UserExtended } from "../auth/types";
import { z } from "zod";
import { inputAvailabilitySchema } from "./types";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";

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


export async function createAppointmentPublic(data:{
    email:string,
    phone_number:string,
    notes:string,
    name:string,
    start_time:string,
    end_time:string,
    appointment_availability_id:string,
    duration:number,
}) {
   
    const appointment_availability_exists = await db.select().from(appointment_availability).where(eq(appointment_availability.id, data.appointment_availability_id))
    if(!appointment_availability_exists[0]) {
        return {
            error: "Appointment availability not found"
        }
    }
    let check_patient = await db.select().from(patients).where(eq(patients.email, data.email))
    if(!check_patient[0]) {
         check_patient = await db.insert(patients).values({
            email:data.email,
            phone:data.phone_number,
            name:data.name,
            workspaceId:appointment_availability_exists[0].workspaceId,
        }).returning()
    }

    const check_availability = await db.select().from(appointments).where(and(
        eq(appointments.workspaceId, appointment_availability_exists[0].workspaceId),
        gte(appointments.date_time_start, new Date(data.start_time)),
        lte(appointments.date_time_end, new Date(data.end_time)),
        eq(appointments.status, 'pending'),
    ))
    if(check_availability[0]) {
        return {
            error: "Appointment already exists"
        }
    }
    const new_appointment = await db.insert(appointments).values({
        patientId:check_patient[0].id,
        date_time_start:new Date(data.start_time),
        date_time_end:new Date(data.end_time),
        notes:data.notes,
        
        duration:data.duration,
        workspaceId:appointment_availability_exists[0].workspaceId,
        status:"pending",
    }).returning()
    return { data: new_appointment[0] }
}

export async function getAppointmentAvailabilityPublic(id:string, date?:string) {
    const selected_date = date ? new Date(date) : new Date()
    const start_of_day = new Date(selected_date.setHours(0,0,0,0))
    const end_of_day = new Date(selected_date.setHours(23,59,59,999))
    const availability = await db.select().from(appointment_availability).where(eq(appointment_availability.id, id))
    const check_bookings = await db.select({
        date_time_start:appointments.date_time_start,
        date_time_end:appointments.date_time_end,
    }).from(appointments).where(and(
        eq(appointments.workspaceId, availability[0].workspaceId),
        gte(appointments.date_time_start, start_of_day),
        lte(appointments.date_time_end, end_of_day),
        eq(appointments.status, 'pending'),
    ))
    return { data: availability[0] , check_bookings:check_bookings }
}


export async function getAppointments(status: typeof appointments.$inferInsert.status = 'pending'){
    const session = await auth()
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }
    const appointments_list = await db.select({
        id:appointments.id,
        patientId:patients.id,
        patientName:patients.name,
        patientEmail:patients.email,
        patientPhone:patients.phone,
        date_time_start:appointments.date_time_start,
        date_time_end:appointments.date_time_end,
        duration:appointments.duration,
        status:appointments.status,
    })
    .from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(eq(appointments.workspaceId, user.workspaceId),eq(appointments.status, status)))
    .orderBy(asc(appointments.date_time_start))

    return { data: appointments_list }
}



export async function getAppointment(id:string) {
    const session = await auth()
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }
    const appointment = await db.select({
        id:appointments.id,
        patientId:patients.id,
        patientName:patients.name,
        patientEmail:patients.email,
        patientPhone:patients.phone,
        date_time_start:appointments.date_time_start,
        date_time_end:appointments.date_time_end,
        duration:appointments.duration,
        status:appointments.status,
        appointment_notes:appointments.notes,

    }).from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(
        eq(appointments.id, id),
        eq(appointments.workspaceId, user.workspaceId),

    ))
    return { data: appointment[0] }
}


export async function updateAppointmentStatus(id:string, status:typeof appointments.$inferInsert.status) {
    const session = await auth()
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }
    const updated = await db.update(appointments).set({status:status}).where(eq(appointments.id, id))
    return { data: updated }
}