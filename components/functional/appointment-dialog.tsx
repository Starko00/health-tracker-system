'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAppointment, updateAppointmentStatus } from '@/actions/availability'
import { Loader2, Calendar, Clock, Mail, Phone, User } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { toast } from 'sonner'
import { Button } from '../ui/button'

export default function AppointmentDialog({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  const { data: appointmentResponse, isLoading ,refetch} = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointment(id),
  })
  const queryClient = useQueryClient()
  const {mutate:updateStatus} = useMutation({
    mutationFn: (status:string) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      toast.success("Appointment status updated")
      refetch()
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: () => {
      toast.error("Failed to update appointment status")
    }
  })
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            Appointment Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View detailed appointment information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px]">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !appointmentResponse?.data ? (
          <div className="text-center p-8 text-muted-foreground">
            Appointment not found
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{appointmentResponse.data.patientName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p className="text-sm">{appointmentResponse.data.patientEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Phone
                  </p>
                  <p className="text-sm">{appointmentResponse.data.patientPhone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={
                    appointmentResponse.data.status === 'done' ? 'default' :
                    appointmentResponse.data.status === 'cancelled' ? 'destructive' :
                    'secondary'
                  } className="capitalize">
                    { appointmentResponse.data.status === 'pending' && <div className='w-4 mr-2 h-4 bg-yellow-500 rounded-full'></div>}
                    {appointmentResponse.data.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment Time
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm">{format(new Date(appointmentResponse.data.date_time_start), 'MMMM d, yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Time
                  </p>
                  <p className="text-sm">{format(new Date(appointmentResponse.data.date_time_start), 'h:mm a')} - {format(new Date(appointmentResponse.data.date_time_end), 'h:mm a')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm">{appointmentResponse.data.duration} minutes</p>
                </div>
              </div>
            </div>

            {appointmentResponse.data.appointment_notes && (
              <div className="space-y-2 border-t pt-4">
                <h3 className="text-lg font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {appointmentResponse.data.appointment_notes}
                </p>
              </div>
            )}
          </div>
        )}
        </ScrollArea>
        {appointmentResponse?.data?.status === 'pending' && <DialogFooter>
            <Button variant="outline" onClick={() => updateStatus('cancelled')}>Cancel Appointment</Button>
            <Button variant="outline" onClick={() => updateStatus('done')}>Mark as Done</Button>
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
