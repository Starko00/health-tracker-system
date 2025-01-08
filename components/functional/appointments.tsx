"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Clock1, PhoneCall } from "lucide-react";
import { getAppointments } from "@/actions/availability";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../ui/loading-spinner";
import { Badge } from "../ui/badge";
import AppointmentDialog from "./appointment-dialog";

export default function Appointments({status}:{status:string}) {

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", status],
    queryFn: () => getAppointments(status),
  });
  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="flex flex-col gap-2">
      {data?.data?.length === 0 && <span className="w-full text-center text-muted-foreground">No appointments found</span>}
      {data?.data?.map((appointment) => (
        <AppointmentDialog key={appointment.id} id={appointment.id}>
          <div className={`flex cursor-pointer ${appointment.status === 'pending' && 'bg-background' }  ${appointment.status === 'done' && 'bg-green-100'} ${appointment.status === 'cancelled' && 'bg-red-100'} items-center p-2 flex-row justify-between gap-2 w-full border rounded-md`}>
            <div className="flex flex-row gap-2 items-center">
              <Avatar className="w-10 bg-white h-10 border">
                <AvatarImage className="bg-white" src={"/avatar.png"} />
              <AvatarFallback className="bg-white">{appointment.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <span>{appointment.patientName}</span>
              <span className="text-muted-foreground text-xs">{appointment.patientEmail}</span>
            </div>
          </div>
       

          <div className="flex flex-col gap-0">
            <Badge className="flex text-xs flex-row gap-2 items-center">
              <Clock1 className="w-4 h-4" />
              {new Date(appointment.date_time_start).toLocaleString()}
            </Badge>
            </div>
          </div>
        </AppointmentDialog>
      ))}
    </div>
  );
}
