'use client'

import { useQuery } from '@tanstack/react-query'
import { getPatientData, getPatientDataForPortal } from '@/actions/patients'
import { Loader2, Calendar, FileText, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type AppointmentStatus = string
type TherapyStatus = string
type DocumentStatus = string

type Appointment = {
  id: string
  date_time_start: Date
  date_time_end: Date
  duration: number
  status: AppointmentStatus
  notes?: string | null
}

type Therapy = {
  id: string
  name: string
  description: string | null
  start_date: Date
  end_date: Date | null
  status: TherapyStatus
  notes: string | null
}

type Document = {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size: number
  description: string | null
  status: DocumentStatus
  created_at: Date
}

export default function PatientPortal({id}: {id: string}) {
  const { data: patientData, isLoading } = useQuery({
    queryKey: ['patient-data'],
    queryFn: () => getPatientDataForPortal(id),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!patientData?.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">No data found</p>
      </div>
    )
  }

  const { appointments, therapies, documents } = patientData.data

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Patient Portal</h1>
        <p className="text-muted-foreground">View your appointments, therapies, and documents</p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="therapies">
            <Activity className="h-4 w-4 mr-2" />
            Therapies
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>View your upcoming and past appointments</CardDescription>
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
                    {appointments?.map((appointment: Appointment) => (
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
                    {!appointments?.length && (
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
            <CardHeader>
              <CardTitle>Your Therapies</CardTitle>
              <CardDescription>View your active and completed therapies</CardDescription>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {therapies?.map((therapy: Therapy) => (
                      <TableRow key={therapy.id}>
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
                      </TableRow>
                    ))}
                    {!therapies?.length && (
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
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>Access your medical documents</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {documents?.map((doc: Document) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 border rounded-md">
                          <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(doc.file_size)} • {format(new Date(doc.created_at), 'MMM d, yyyy')}
                          </p>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                  {!documents?.length && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No documents found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 