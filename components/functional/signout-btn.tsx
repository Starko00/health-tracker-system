'use client'
import { LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'

import LoadingSpinner from '../ui/loading-spinner'
import { signOut } from 'next-auth/react'

export default function SignoutBtn() {
const [loading,setLoading] = useState(false)
  return (
   <Button size={'sm'} onClick={async()=>{
    setLoading(true)
    await signOut()
    setLoading(false)
   }}>
    {loading ? <LoadingSpinner /> : <span className='flex items-center gap-2'>Signout <LogOut className='w-4 h-4' /></span>}
   </Button>
  )
}
