'use client'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useMutation, useQuery } from '@tanstack/react-query'
import { getAppointmentAvailability, updateAppointmentAvailability } from '@/actions/availability'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { inputAvailabilitySchema } from '@/actions/availability/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldPath } from "react-hook-form"
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useSession } from 'next-auth/react'
import { UserExtended } from '@/actions/auth/types'
import { CalendarIcon, Loader2 } from 'lucide-react'
import CreateAppointmentAvailability from './create-appointment-availability'
import { appointment_availability } from '@/db/schema'
  
type FormValues = z.infer<typeof inputAvailabilitySchema>;
type AvailabilityResponse = {
  error?: string;
  data?: typeof appointment_availability.$inferSelect;
}

export default function UpdateAppointmentAvailability({children}: {children: React.ReactNode}) {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  const { data: availabilityResponse, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: () => getAppointmentAvailability(),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(inputAvailabilitySchema),
  })

  useEffect(() => {
    if (availabilityResponse?.data) {
      form.reset({
        start_time: new Date(availabilityResponse.data.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        end_time: new Date(availabilityResponse.data.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: availabilityResponse.data.duration,
        daily_availability: availabilityResponse.data.daily_availability as FormValues['daily_availability'],
      })
    }
  }, [availabilityResponse, form])

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const user = session?.user as UserExtended | undefined
      if (!user?.id || !user?.workspaceId) {
        throw new Error('User not authenticated or missing workspace')
      }
      return updateAppointmentAvailability({
        ...data,
        start_time: new Date(`1970-01-01T${data.start_time}`),
        end_time: new Date(`1970-01-01T${data.end_time}`),
        user_id: user.id,
        workspaceId: user.workspaceId
      })
    },
    onSuccess: (response) => {
      if(response.error){
        toast.error(response.error)
      }else{
        toast.success("Appointment availability updated")
        setOpen(false)
      }
    },
    onError: (error: Error) => {
      toast.error("Error updating appointment availability: " + error.message)
    }
  })

  function onSubmit(data: FormValues) {
    mutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if(!availabilityResponse?.data || availabilityResponse.error){
    return <CreateAppointmentAvailability>
      <Button variant="outline" className="gap-2">
        <CalendarIcon className="w-4 h-4" />
        <span>Setup Availability</span>
      </Button>
    </CreateAppointmentAvailability>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Update Appointment Availability
          </DialogTitle>
          <DialogDescription>
            Update your weekly availability for appointments
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Hours</h3>
              <div className="space-y-4">
                {Object.entries(form.getValues()?.daily_availability || {}).map(([day]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <FormField
                          control={form.control}
                          name={`daily_availability.${day}.disabled` as FieldPath<FormValues>}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch
                                  checked={!field.value as boolean}
                                  onCheckedChange={(checked) => field.onChange(!checked)}
                                />
                              </FormControl>
                              <FormLabel className="w-24 font-medium capitalize">{day}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name={`daily_availability.${day}.start_time` as FieldPath<FormValues>}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  value={value as string}
                                  onChange={onChange}
                                  {...field}
                                  className="w-32"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <span className="text-muted-foreground">-</span>
                        <FormField
                          control={form.control}
                          name={`daily_availability.${day}.end_time` as FieldPath<FormValues>}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  value={value as string}
                                  onChange={onChange}
                                  {...field}
                                  
                                  className="w-32"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 