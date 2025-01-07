'use client'
import { createWorkspace } from '@/actions/workspace'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Button } from '../ui/button'
import LoadingSpinner from '../ui/loading-spinner'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(3, { message: "Workspace name must be at least 3 characters long" }),
})
export default function WorkspaceCreationForm() {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn:(name:string)=> createWorkspace(name),
    onSuccess:()=>{
        router.push('/')
        toast.success('Workspace created successfully')
    },
    onError:(error)=>{
        toast.error('Failed to create workspace' + error.message)
    }
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })
  const onSubmit = form.handleSubmit((data)=>{
    mutation.mutate(data.name)
  })

  return (
   <Form {...form}>
    <h2 className='text-2xl font-bold'>Let's get you started</h2>
    <p className='text-sm mb-12  text-gray-500'>Create a workspace to get started</p>
    <form onSubmit={onSubmit} className='flex flex-col items-center justify-center gap-4 w-full max-w-md' >
        <FormField   control={form.control} name="name" render={({field})=>(
            <FormItem className='w-full'>
                {/* <FormLabel>Workspace Name</FormLabel> */}
                <FormControl>
                    <Input placeholder='Workspace Name' {...field} />
                </FormControl>
            </FormItem>
        )} />
        <Button type="submit" className='w-full' disabled={mutation.isPending}>
            {mutation.isPending ? <LoadingSpinner /> : 'Create'}
        </Button>
    </form>
   </Form>
  )
}
