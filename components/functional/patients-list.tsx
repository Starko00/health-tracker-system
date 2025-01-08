'use client'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '@/actions/patients'
import { Eye, Loader2, Mail, Phone, Search, User } from 'lucide-react'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '../ui/badge'
import { patients } from '@/db/schema'
import { useRouter } from 'next/navigation'

type Patient = typeof patients.$inferSelect & {
  last_visit?: Date | null
  total_visits?: number
  status?: 'active' | 'inactive' | 'new'
  notes?: string
}

export default function PatientsList() {
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const { data: patientsResponse, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatients(),
  })

  const filteredPatients = (patientsResponse?.data as Patient[] | undefined)?.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.email.toLowerCase().includes(search.toLowerCase()) ||
    patient.phone.toLowerCase().includes(search.toLowerCase())
  )
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex bg-white items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md bg-white border">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : !filteredPatients?.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      {patient.last_visit ? format(new Date(patient.last_visit), 'MMM d, yyyy') : 'Never'}
                    </TableCell>
                    <TableCell>{patient.total_visits || 0}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                        {patient.status || 'new'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                     
                          <Button
                            variant="outline"
                            onClick={() => {
                                router.push(`/dashboard/patients/${patient.id}`)

                            }}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                       
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
} 