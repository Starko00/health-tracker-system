"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverForm,
  PopoverLabel,
  PopoverRoot,
  PopoverSubmitButton,
  PopoverTextarea,
  PopoverTrigger,
} from "../ui/popover";
import { UploadDropzone } from "@/utils/uploadthing";
import { Edit, Edit2, Edit3Icon, PlusCircle, User2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { updateFirstTimeUser } from "@/actions/profile/first-time";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../ui/loading-spinner";

export default function FirstTimeProfile() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter()
  const mutate = useMutation({
    mutationFn:async()=>{
    return updateFirstTimeUser({
      name:name,
      image:image
    })},
    onSuccess:()=>{
        toast.success("Profile updated successfully")
        router.push("/")
    },
    onError:(error)=>{
        toast.error(error.message)
    }
    
    
  })
  return (
    <div className="flex flex-col gap-4 py-8 max-w-md ">
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-center">Welcome</h1>
          <p className="text-sm text-muted-foreground text-center">
            We will now set up your profile
          </p>
          <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
        </>
      )}

      {step === 2 && (
        <>
        <PopoverRoot>
          <PopoverTrigger className="  bg-white rounded-full relative p-2 aspect-square w-32 h-32 flex items-center text-center justify-center gap-4">
            {image.length>1 ? <Image src={image} alt="profile" fill className="w-full h-full object-cover rounded-full" /> : <Edit2 className="  mx-auto min-h-8 min-w-8" />}        
            <p className="text-xs">Add a profile picture</p>
            </PopoverTrigger>

        <PopoverContent className="p-0 m-0">
         
            <UploadDropzone onClientUploadComplete={(res)=>{
                setImage(res[0].url)
            }} className="mt-0 border-none cursor-pointer" endpoint="imageUploader" />
         
        </PopoverContent>
        </PopoverRoot>
        {image && image.length>1 && <Button className="w-full" onClick={() => setStep(3)}>Continue</Button>}
        </>)}
        {step === 3 && (
          <>
          <form className="w-full flex flex-col gap-4" onSubmit={(e)=>{
            e.preventDefault()
            mutate.mutate()
          }}>
            <Input value={name} required onChange={(e)=>setName(e.target.value)} placeholder="Name" />
            <Button type="submit" disabled={mutate.isPending}>{mutate.isPending ? <LoadingSpinner /> : "Save"}</Button>
            </form>
          </>
        )}
    </div>
  );
}
