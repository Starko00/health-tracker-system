'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTherapy } from "@/actions/therapies"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const therapySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  notes: z.string().optional(),
})

type TherapyFormValues = z.infer<typeof therapySchema>

export function CreateTherapyDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<TherapyFormValues>({
    resolver: zodResolver(therapySchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  })

  const { mutate: createTherapyMutation, isPending } = useMutation({
    mutationFn: (values: TherapyFormValues) => createTherapy({ 
      ...values, 
      patientId,
      start_date: new Date(values.start_date),
      end_date: values.end_date ? new Date(values.end_date) : null,
    }),
    onSuccess: () => {
      toast.success("Therapy created successfully")
      setOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] })
    },
    onError: (error) => {
      toast.error("Failed to create therapy")
    },
  })

  function onSubmit(data: TherapyFormValues) {
    createTherapyMutation(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Therapy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Therapy</DialogTitle>
          <DialogDescription>
            Add a new therapy plan for the patient
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
                    <Input placeholder="Physical Therapy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the therapy plan..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      min={form.getValues("start_date")}
                    />
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
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Therapy
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 