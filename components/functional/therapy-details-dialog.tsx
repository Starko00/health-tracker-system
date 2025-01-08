'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Info } from "lucide-react"
import { TherapyActions } from "./therapy-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TherapyDetailsProps {
  therapy: {
    id: string
    name: string
    description: string | null
    start_date: Date
    end_date: Date | null
    status: 'active' | 'completed' | 'cancelled'
    notes: string | null
  }
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TherapyDetailsDialog({ therapy, patientId, open, onOpenChange }: TherapyDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{therapy.name}</DialogTitle>
              <DialogDescription>Therapy Details</DialogDescription>
            </div>
            <TherapyActions
              therapyId={therapy.id}
              patientId={patientId}
              currentStatus={therapy.status}
            />
          </div>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(therapy.start_date), "MMM d, yyyy")} - 
                {therapy.end_date ? format(new Date(therapy.end_date), " MMM d, yyyy") : " Ongoing"}
              </span>
            </div>
            <Badge variant={
              therapy.status === 'completed' ? 'default' :
              therapy.status === 'cancelled' ? 'destructive' :
              'secondary'
            }>
              {therapy.status}
            </Badge>
          </div>

          {therapy.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Info className="h-4 w-4" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{therapy.description}</p>
              </CardContent>
            </Card>
          )}

          {therapy.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{therapy.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 