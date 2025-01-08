'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Check, X, Edit } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTherapyStatus } from "@/actions/therapies"
import { toast } from "sonner"

type TherapyStatus = 'active' | 'completed' | 'cancelled'

interface TherapyActionsProps {
  therapyId: string
  patientId: string
  currentStatus: TherapyStatus
}

export function TherapyActions({ therapyId, patientId, currentStatus }: TherapyActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionType, setActionType] = useState<'complete' | 'cancel' | null>(null)
  const queryClient = useQueryClient()

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status: TherapyStatus) => updateTherapyStatus(therapyId, status),
    onSuccess: () => {
      toast.success(`Therapy ${actionType === 'complete' ? 'completed' : 'cancelled'} successfully`)
      setShowConfirmDialog(false)
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] })
    },
    onError: () => {
      toast.error("Failed to update therapy status")
    },
  })

  const handleAction = (type: 'complete' | 'cancel') => {
    setActionType(type)
    setShowConfirmDialog(true)
  }

  const confirmAction = () => {
    if (actionType === 'complete') {
      updateStatus('completed')
    } else if (actionType === 'cancel') {
      updateStatus('cancelled')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus === 'active' && (
            <>
              <DropdownMenuItem
                onClick={() => handleAction('complete')}
                className="text-green-600"
              >
                <Check className="mr-2 h-4 w-4" />
                Complete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction('cancel')}
                className="text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'complete' ? 'Complete Therapy' : 'Cancel Therapy'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType === 'complete' ? 'complete' : 'cancel'} this therapy?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'complete' ? 'default' : 'destructive'}
              onClick={confirmAction}
              disabled={isPending}
            >
              {actionType === 'complete' ? 'Complete' : 'Cancel'} Therapy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 