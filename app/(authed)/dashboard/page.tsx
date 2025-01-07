
import { auth } from '@/auth'
import SignoutBtn from '@/components/functional/signout-btn'


import { redirect } from 'next/navigation'
import React from 'react'

export default async function Dashboard() {
    const session = await auth()
    if(!session){
        redirect('/')
    }
   return (
    <div className=''>
       
      
    </div>
  )
}
