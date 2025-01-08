import WorkspaceCreationForm from '@/components/functional/workspace-creation-form'
import Providers from '@/utils/providers'
import React from 'react'

export default function WorkspaceSetup() {
  return (
    <div className='flex flex-col mx-auto items-center justify-center h-screen'>
      <Providers>
        <WorkspaceCreationForm />
      </Providers>
    </div>
  )
}
