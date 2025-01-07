'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Clock1 } from 'lucide-react'

export default function Appointments() {
  return (
    <div className="flex flex-col gap-2">
        <span className='w-full text-center text-muted-foreground'>No appointments found</span>
      {/* {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex bg-background items-center p-2 flex-row justify-between gap-2 w-full border rounded-md">
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <span>Marko Markovic</span>
              <span className="text-muted-foreground text-xs">marko@test.me</span>
            </div>
          </div>
          <span className="flex text-xs flex-row gap-2 items-center">
            <Clock1 className="w-4 h-4" />
            2025-01-01 12:00
          </span>
        </div>
      ))} */}
    </div>
  )
}
