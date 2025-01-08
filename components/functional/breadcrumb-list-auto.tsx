'use client'
import React, { useEffect, useState } from 'react'
import { BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import { BreadcrumbItem } from '../ui/breadcrumb'
import { BreadcrumbList } from '../ui/breadcrumb'
import { usePathname } from 'next/navigation'

export default function BreadcrumbListAuto() {
    const pathname = usePathname()
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
    useEffect(() => {
        const breadcrumbs = pathname.split('/').filter(Boolean)
        setBreadcrumbs(breadcrumbs)
    }, [pathname])
  return (
    <BreadcrumbList>
    {breadcrumbs.map((breadcrumb, index) => ( 
        <React.Fragment key={index}>
        <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/${breadcrumb}`} className='capitalize'>{breadcrumb}</BreadcrumbLink>
        </BreadcrumbItem>
        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
        </React.Fragment>
    ))}
    
   
  </BreadcrumbList>
  )
}
