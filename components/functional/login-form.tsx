'use client'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { AlertCircle, Mail } from 'lucide-react'
import LoadingSpinner from '../ui/loading-spinner'


export default function LoginForm() {
  const [email,setEmail] = useState('')
  const [loading,setLoading] = useState(false)
  return (
    <form
    className="w-full flex flex-col gap-2"
    onSubmit={(e)=>{
        e.preventDefault()
        setLoading(true)
        toast('Sending magic link...',{
            id:'sending-magic-link',
            duration:Infinity,
            description:'We are sending you a magic link to sign in with',
            icon:<LoadingSpinner />
        })
        signIn('resend',{
            email,
            redirect:false,
            

        }).then((res)=>{
            console.log(res)
            if(res?.ok && res?.error===null){
                toast(' Check your email for the magic link',{
                    icon:<Mail className='w-4 h-4 ' />,
                    description:'We sent you a magic link to sign in with',
                    id:'sending-magic-link',
                    duration:3,
                    dismissible:true
                })
            }else if(res?.error){
                toast(res?.error,{
                    icon:<AlertCircle className='w-4 h-4' />,
                    description:'Something went wrong',
                    id:'sending-magic-link',
                    duration:3,
                    dismissible:true
                })
            }
        }).finally(()=>{
            setLoading(false)
        })
    }}
>
    <Input required  type="text" name="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
    <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? <LoadingSpinner /> : 'Signin with email'}
    </Button>
    
</form>
  )
}
