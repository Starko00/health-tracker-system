"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { appointments, patients, therapies } from "@/db/schema"
import { UserExtended } from "../auth/types"
import { eq, sql, desc, and } from "drizzle-orm"

type PatientWithStats = {
    id: string
    name: string
    email: string
    phone: string
    created_at: Date
    updated_at: Date
    workspaceId: string
    last_visit: Date | null
    total_visits: number
    status: 'active' | 'inactive' | 'new'
    appointments?: {
        id: string
        date_time_start: Date
        date_time_end: Date
        duration: number
        status: 'pending' | 'done' | 'cancelled'
        notes?: string | null
    }[]
    therapies?: {
        id: string
        name: string
        description: string | null
        start_date: Date
        end_date: Date | null
        status: 'active' | 'completed' | 'cancelled'
        notes?: string | null
    }[]
}

export async function getPatients() {
    const session = await auth()
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }

    // Get patients with their last visit date and total visits
    const patients_list = await db.select({
        id: patients.id,
        name: patients.name,
        email: patients.email,
        phone: patients.phone,
        created_at: patients.created_at,
        updated_at: patients.updated_at,
        workspaceId: patients.workspaceId,
        last_visit: sql<Date | null>`MAX(${appointments.date_time_start})`.as('last_visit'),
        total_visits: sql<number>`COUNT(${appointments.id})`.as('total_visits'),
        // Calculate status based on last visit
        status: sql<'active' | 'inactive' | 'new'>`
            CASE 
                WHEN MAX(${appointments.date_time_start}) IS NULL THEN 'new'
                WHEN MAX(${appointments.date_time_start}) > NOW() - INTERVAL '3 months' THEN 'active'
                ELSE 'inactive'
            END
        `.as('status')
    })
    .from(patients)
    .leftJoin(
        appointments,
        and(
            eq(appointments.patientId, patients.id),
            eq(appointments.status, 'done')
        )
    )
    .where(eq(patients.workspaceId, user.workspaceId))
    .groupBy(patients.id)
    .orderBy(desc(sql`last_visit`))

    return { data: patients_list }
}

export async function getPatient(id: string) {
    const session = await auth()
    const user = session?.user as UserExtended | undefined
    if(!user?.id || !user?.workspaceId) {
        return {
            error: "User not authenticated or missing workspace"
        }
    }

    // Get patient with their stats and appointments
    const patient = await db.select({
        id: patients.id,
        name: patients.name,
        email: patients.email,
        phone: patients.phone,
        created_at: patients.created_at,
        updated_at: patients.updated_at,
        workspaceId: patients.workspaceId,
        last_visit: sql<Date | null>`MAX(CASE WHEN ${appointments.status} = 'done' THEN ${appointments.date_time_start} END)`.as('last_visit'),
        total_visits: sql<number>`COUNT(CASE WHEN ${appointments.status} = 'done' THEN 1 END)`.as('total_visits'),
        status: sql<'active' | 'inactive' | 'new'>`
            CASE 
                WHEN MAX(CASE WHEN ${appointments.status} = 'done' THEN ${appointments.date_time_start} END) IS NULL THEN 'new'
                WHEN MAX(CASE WHEN ${appointments.status} = 'done' THEN ${appointments.date_time_start} END) > NOW() - INTERVAL '3 months' THEN 'active'
                ELSE 'inactive'
            END
        `.as('status')
    })
    .from(patients)
    .leftJoin(appointments, eq(appointments.patientId, patients.id))
    .where(and(
        eq(patients.id, id),
        eq(patients.workspaceId, user.workspaceId)
    ))
    .groupBy(patients.id)

    if (!patient[0]) {
        return { error: "Patient not found" }
    }

    // Get all appointments for this patient
    const patientAppointments = await db.select({
        id: appointments.id,
        date_time_start: appointments.date_time_start,
        date_time_end: appointments.date_time_end,
        duration: appointments.duration,
        status: appointments.status,
        notes: appointments.notes,
    })
    .from(appointments)
    .where(and(
        eq(appointments.patientId, id),
        eq(appointments.workspaceId, user.workspaceId)
    ))
    .orderBy(desc(appointments.date_time_start))

    // Get all therapies for this patient
    const patientTherapies = await db.select({
        id: therapies.id,
        name: therapies.name,
        description: therapies.description,
        start_date: therapies.start_date,
        end_date: therapies.end_date,
        status: therapies.status,
        notes: therapies.notes,
    })
    .from(therapies)
    .where(and(
        eq(therapies.patientId, id),
        eq(therapies.workspaceId, user.workspaceId)
    ))
    .orderBy(desc(therapies.start_date))

    return { 
        data: {
            ...patient[0],
            appointments: patientAppointments,
            therapies: patientTherapies
        } as PatientWithStats
    }
}

