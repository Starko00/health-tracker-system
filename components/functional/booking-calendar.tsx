'use client'
import React, { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { addMinutes, format, isSameMinute, parseISO, startOfToday } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { useMutation, useQuery } from '@tanstack/react-query'
import { createAppointmentPublic, getAppointmentAvailabilityPublic } from '@/actions/availability'
import { Loader2 } from 'lucide-react'
import { appointment_availability } from '@/db/schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

type TimeSlot = {
  time: string
  available: boolean
}

type DayAvailability = {
  start_time: string
  end_time: string
  all_day: boolean
  disabled: boolean
}

type DailyAvailability = {
  [key: string]: DayAvailability
}

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export default function BookingCalendar({id}:{id:string}) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
  const [selectedTime, setSelectedTime] = useState<string>()
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      notes: "",
    },
  })

  const { data: availabilityResponse, isLoading } = useQuery({
    queryKey: ['availability', id, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => getAppointmentAvailabilityPublic(id, format(selectedDate, 'yyyy-MM-dd')),
  })

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      if (!selectedTime || !availabilityResponse?.data) return

      const startTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':')
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + availabilityResponse.data.duration)

      return createAppointmentPublic({
        ...data,
        notes: data.notes || '',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        appointment_availability_id: id,
        duration: availabilityResponse.data.duration,
      })
    },
    onSuccess: (response) => {
      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success("Appointment booked successfully")
        setShowBookingDialog(false)
        form.reset()
        setSelectedTime(undefined)
      }
    },
    onError: (error: Error) => {
      toast.error("Error booking appointment: " + error.message)
    }
  })

  // Generate time slots based on availability
  const getTimeSlots = (date: Date): TimeSlot[] => {
    if (!availabilityResponse?.data) return []

    const dayOfWeek = format(date, 'EEEE').toLowerCase()
    const dailyAvailability = availabilityResponse.data.daily_availability as DailyAvailability
    const dayAvailability = dailyAvailability[dayOfWeek]
    
    if (!dayAvailability || dayAvailability.disabled) return []

    const slots: TimeSlot[] = []
    const startTime = new Date(`1970-01-01T${dayAvailability.start_time}`)
    const endTime = new Date(`1970-01-01T${dayAvailability.end_time}`)
    let currentTime = startTime

    while (currentTime < endTime) {
      // Create a date object for the current time slot on the selected date
      const slotDate = new Date(selectedDate)
      slotDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0)
      
      // Check if this time slot overlaps with any existing bookings
      const isBooked = availabilityResponse.check_bookings?.some(booking => {
        const bookingStart = new Date(booking.date_time_start)
        const bookingEnd = new Date(booking.date_time_end)
        return slotDate >= bookingStart && slotDate < bookingEnd
      })

      slots.push({
        time: format(currentTime, 'HH:mm'),
        available: !isBooked
      })
      currentTime = addMinutes(currentTime, availabilityResponse.data.duration)
    }

    return slots
  }

  function onSubmit(data: BookingFormValues) {
    bookingMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!availabilityResponse?.data) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">No availability set</p>
      </div>
    )
  }

  const availability = availabilityResponse.data
  const timeSlots = getTimeSlots(selectedDate)

  return (
    <>
      <div className="flex border max-w-4xl w-full mx-auto my-auto shadow-md bg-white rounded-md flex-col md:flex-row gap-2 p-4">
        <div className="w-full h-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className='w-full h-full'
            classNames={{
              root: "w-full h-full",
              day:"min-w-12 min-h-12 rounded-md",
            }}
            disabled={(date) => {
              const dayOfWeek = format(date, 'EEEE').toLowerCase()
              const dailyAvailability = availability.daily_availability as DailyAvailability
              const dayAvailability = dailyAvailability[dayOfWeek]
              return date < startOfToday() || dayAvailability?.disabled
            }}
          />
        </div>

        <div className="w-full h-full">
          <div>
            <h3 className="font-medium "> 
              Book an appointment
            </h3>
            <p className="text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM do')}
            </p>
          </div>
          <ScrollArea className="h-[400px] rounded-md mt-4">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className={cn(
                    "w-full",
                    !slot.available && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!slot.available}
                  onClick={() => {
                    setSelectedTime(slot.time)
                    setShowBookingDialog(true)
                  }}
                >
                  {slot.time}, {availability.duration}min
                </Button>
              ))}
              {timeSlots.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-4">
                  No available slots for this day
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={(val)=>{
        setShowBookingDialog(val)
        form.reset()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {format(selectedDate, 'EEEE, MMMM do')} at {selectedTime}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+382671234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any additional information..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setShowBookingDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={bookingMutation.isPending}>
                  {bookingMutation.isPending ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
} 