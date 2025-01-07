'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useMutation } from '@tanstack/react-query'
import { createAppointmentAvailability } from '@/actions/availability'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { inputAvailabilitySchema } from '@/actions/availability/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldPath, useForm } from "react-hook-form"
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
  
type FormValues = z.infer<typeof inputAvailabilitySchema>;

type DayAvailability = {
  start_time: string;
  end_time: string;
  all_day: boolean;
  disabled: boolean;
}

export default function CreateAppointmentAvailability({children}: {children: React.ReactNode}) {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const form = useForm<FormValues>({
    resolver: zodResolver(inputAvailabilitySchema),
    defaultValues: {
        start_time: "09:00",
        end_time: "17:00",
        duration: 15,
        daily_availability: {
            monday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
            tuesday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
            wednesday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
            thursday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
            friday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
            saturday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
            sunday: {
                start_time: "09:00",
                end_time: "17:00",
                all_day: false,
                disabled: false,
            },
        },
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const user = session?.user as UserExtended | undefined
      if (!user?.id || !user?.workspaceId) {
        throw new Error('User not authenticated or missing workspace')
      }
      return createAppointmentAvailability({
        ...data,
        start_time: new Date(`1970-01-01T${data.start_time}`),
        end_time: new Date(`1970-01-01T${data.end_time}`),
        user_id: user.id,
        workspaceId: user.workspaceId
      })
    },
    onSuccess: (data) => {
      if(data?.error){
        toast.error(data.error)
      }else{
        toast.success("Appointment availability created")
      }
    },
    onError: (error: Error) => {
      toast.error("Error creating appointment availability: " + error.message)
    }
  })

  function onSubmit(data: FormValues) {
    mutation.mutate(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Create Appointment Availability
          </DialogTitle>
          <DialogDescription>
            Set your weekly availability for appointments
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
                {Object.entries(form.getValues().daily_availability).map(([day]) => (
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
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  {...field} 
                                  value={field.value as string}
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
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  {...field} 
                                  value={field.value as string}
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
                {mutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
