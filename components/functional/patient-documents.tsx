'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getDocuments, deleteDocument, uploadDocument } from "@/actions/documents"
import { Loader2, Plus, FileText, Download, Trash2 } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { UploadDropzone } from "@/utils/uploadthing"

const documentSchema = z.object({
  description: z.string().optional(),
})

type DocumentFormValues = z.infer<typeof documentSchema>

interface Document {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size: number
  description: string | null
  status: 'pending' | 'done' | 'cancelled'
  created_at: Date
}

export function PatientDocuments({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['documents', patientId],
    queryFn: () => getDocuments(patientId),
  })

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      description: "",
    },
  })

  const { mutate: uploadDocumentMutation } = useMutation({
    mutationFn: (values: {
      name: string
      file_key: string
      file_url: string
      file_type: string
      file_size: number
      description?: string
    }) => uploadDocument({ ...values, patientId }),
    onSuccess: () => {
      toast.success("Document uploaded successfully")
      setOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['documents', patientId] })
    },
    onError: () => {
      toast.error("Failed to save document")
    },
  })

  const { mutate: deleteDocumentMutation } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success("Document deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['documents', patientId] })
    },
    onError: () => {
      toast.error("Failed to delete document")
    },
  })

  function onSubmit(data: DocumentFormValues) {
    // Form submission is handled by UploadThing
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (isLoadingDocuments) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload and manage patient documents
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a document for this patient
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a description..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <UploadDropzone 
                  endpoint="documentUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      const file = res[0]
                      const description = form.getValues("description")
                      
                      uploadDocumentMutation({
                        name: file.name,
                        file_key: file.key,
                        file_url: file.url,
                        file_type: file.type || 'application/octet-stream',
                        file_size: file.size,
                        description,
                      })
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Failed to upload: ${error.message}`)
                  }}
                />
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {documents?.data?.map((doc: Document) => (
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(doc.file_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteDocumentMutation(doc.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {!documents?.data?.length && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No documents found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 