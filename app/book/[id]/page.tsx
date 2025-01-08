import BookingCalendar from '@/components/functional/booking-calendar'
import Providers from '@/utils/providers'
import React from 'react'

export default async function BookingPage({params}:{params:Promise<{id:string}>}){
    const id = (await params).id
    return <div className='w-svw h-svh flex justify-center items-center'>
        <Providers>
        <BookingCalendar id={id}/>
 
        </Providers>
    </div>
}