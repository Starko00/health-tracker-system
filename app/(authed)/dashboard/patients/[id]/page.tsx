'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPatient } from '@/actions/patients'
import { Loader2, Mail, Phone, User, Calendar, Clock, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateTherapyDialog } from '@/components/functional/create-therapy-dialog'
import { TherapyActions } from '@/components/functional/therapy-actions'
import { TherapyDetailsDialog } from '@/components/functional/therapy-details-dialog'
import { PatientDocuments } from '@/components/functional/patient-documents'
import { useParams } from 'next/navigation'

type Appointment = {
  id: string
  date_time_start: Date
  date_time_end: Date
  duration: number
  status: 'pending' | 'done' | 'cancelled'
  notes?: string | null
}

type Therapy = {
  id: string
  name: string
  description: string | null
  start_date: Date
  end_date: Date | null
  status: 'active' | 'completed' | 'cancelled'
  notes: string | null
}

type Patient = {
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
  appointments?: Appointment[]
  therapies?: Therapy[]
}

export default function PatientsSinglePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const pageParams = useParams()
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null)
  
  const { data: patientResponse, isLoading } = useQuery({
    queryKey: ['patient', pageParams.id],
    queryFn: () => getPatient(pageParams.id as string),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!patientResponse?.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Patient not found</p>
      </div>
    )
  }

  const patient = patientResponse.data as Patient

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">Patient Profile</p>
        </div>
        <Badge variant={patient.status === 'active' ? 'default' : 'secondary'} className="text-base py-1">
          {patient.status || 'new'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {patient.phone}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p>{format(new Date(patient.created_at), 'MMMM d, yyyy')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Visit Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                <p>{patient.last_visit ? format(new Date(patient.last_visit), 'MMMM d, yyyy') : 'Never'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
                <p>{patient.total_visits || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="therapies">Therapies</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>View and manage upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.appointments?.map((appointment: Appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {format(new Date(appointment.date_time_start), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(appointment.date_time_start), 'h:mm a')}
                        </TableCell>
                        <TableCell>{appointment.duration} minutes</TableCell>
                        <TableCell>
                          <Badge variant={
                            appointment.status === 'done' ? 'default' :
                            appointment.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {appointment.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!patient.appointments?.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No appointments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="therapies" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Therapies</CardTitle>
                <CardDescription>View and manage patient therapies</CardDescription>
              </div>
              <CreateTherapyDialog patientId={patient.id} />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.therapies?.map((therapy: Therapy) => (
                      <TableRow 
                        key={therapy.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedTherapy(therapy)}
                      >
                        <TableCell className="font-medium">{therapy.name}</TableCell>
                        <TableCell>{format(new Date(therapy.start_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          {therapy.end_date ? format(new Date(therapy.end_date), 'MMM d, yyyy') : 'Ongoing'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            therapy.status === 'completed' ? 'default' :
                            therapy.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }>
                            {therapy.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {therapy.description || '-'}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <TherapyActions
                            therapyId={therapy.id}
                            patientId={patient.id}
                            currentStatus={therapy.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {!patient.therapies?.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No therapies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <PatientDocuments patientId={patient.id} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient History</CardTitle>
              <CardDescription>View patient history and notes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...(patient.appointments?.filter((a: Appointment) => a.status === 'done') || []).map((appointment: Appointment) => ({
                        id: appointment.id,
                        date: appointment.date_time_start,
                        type: 'Appointment',
                        notes: appointment.notes
                      })),
                      ...(patient.therapies?.filter((t: Therapy) => t.status === 'completed') || []).map((therapy: Therapy) => ({
                        id: therapy.id,
                        date: therapy.end_date || therapy.start_date,
                        type: 'Therapy',
                        notes: therapy.notes
                      }))
                    ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="max-w-[400px] whitespace-pre-wrap">
                          {item.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!patient.appointments?.filter((a: Appointment) => a.status === 'done').length && 
                     !patient.therapies?.filter((t: Therapy) => t.status === 'completed').length && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No history found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedTherapy && (
        <TherapyDetailsDialog
          therapy={selectedTherapy}
          patientId={patient.id}
          open={!!selectedTherapy}
          onOpenChange={(open) => !open && setSelectedTherapy(null)}
        />
      )}
    </div>
  )
}
