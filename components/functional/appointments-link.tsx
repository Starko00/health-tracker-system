'use client'
import React from 'react'
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { UserExtended } from '@/actions/auth/types';
import { useSession } from 'next-auth/react';
import { getAppointmentAvailability } from '@/actions/availability';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Calendar1Icon, CalendarIcon, ClipboardIcon, Globe, Link2 } from 'lucide-react';

export default function AppointmentsLink() {
    const { data: session } = useSession()
    const appointment = useQuery({
        queryKey: ['appointment'],
        queryFn: () => getAppointmentAvailability()
    })

    if(!appointment.data || appointment.isLoading) return null
  return (
    <div className="flex items-center mt-4 gap-2  rounded-lg">
            <div className="flex-1 flex items-center gap-2">
              <Globe className="w-4 h-4"/>
              <Input 
                type="text" 
                readOnly
                value={'https://healthcare.starko.one/book/'+appointment.data.data?.id}
                className="w-full bg-background px-3 py-2 rounded-md text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <Button
              variant="default"
              onClick={() => {
                navigator.clipboard.writeText('https://healthcare.starko.one/book/'+appointment.data.data?.id);
                toast.success("Booking link copied to clipboard!");
              }}
            >
            <ClipboardIcon className="w-4 h-4"/>
              Copy Link
            </Button>
          </div>
  )
}
