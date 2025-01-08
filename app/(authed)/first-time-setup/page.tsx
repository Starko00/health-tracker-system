import FirstTimeProfile from '@/components/functional/first-time-profile'
import Providers from '@/utils/providers'
import React from 'react'

export default function FirstTimeSetup() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Providers>
        <FirstTimeProfile/>
      </Providers>
    </div>
  )
}
