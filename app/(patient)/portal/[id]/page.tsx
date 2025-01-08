import React from 'react'
import PatientPortal from './patient-portal'

export default async function Page({params}: {params:Promise<{id: string}>}) {
  const patientId = (await params).id
  return (
    <PatientPortal id={patientId} />
  )
}
