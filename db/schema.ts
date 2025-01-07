import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    uuid,
    pgEnum,
    jsonb,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"

const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle"
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)
export const workspaceMemberRole = pgEnum("workspace_member_role", ["user","patient"])

export const workspaces = pgTable("workspaces",{
    id: uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    created_at: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    updated_at: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
})

export const workspaceMembers = pgTable("workspace_members",{
    id: uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    workspaceId: uuid().notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid().notNull().references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    updated_at: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    role: workspaceMemberRole("role").default("patient").notNull(),
})

export const status = pgEnum("status", ["pending", "done", "cancelled"])

export const users = pgTable("user", {
    id: uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    workspaceId: uuid().references(() => workspaces.id, { onDelete: "cascade" }),
})

export const accounts = pgTable(
    "account",
    {
        userId: uuid().primaryKey().notNull().references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid().notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: uuid().primaryKey().notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
)



export const patients = pgTable("patients",{
    id: uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    workspaceId: uuid().notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    assigned_to: uuid().references(() => users.id, { onDelete: "cascade" }),
    phone: text("phone").notNull(),
    created_at: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    updated_at: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
})

export const appointments = pgTable("appointments",{
    id: uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    workspaceId: uuid().notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    patientId: uuid().notNull().references(() => patients.id, { onDelete: "cascade" }),
    date_time: timestamp("date_time", { mode: "date" }).notNull(),
    status: text("status").notNull(),
    notes: text("notes"),
    created_at: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    updated_at: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
})

export const documents = pgTable("documents",{
    id: uuid().primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    workspaceId: uuid().notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    file_key: text("file_key").notNull(),
    file_size: integer("file_size").notNull(),
    file_type: text("file_type").notNull(),
    file_url: text("file_url").notNull(),
    description: text("description"),
    status: status("status").default("pending").notNull(),
    appointment_id: uuid().references(() => appointments.id, { onDelete: "cascade" }),
    editor_data: jsonb("editor_data"),
    created_at: timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
    updated_at: timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date()),
})






