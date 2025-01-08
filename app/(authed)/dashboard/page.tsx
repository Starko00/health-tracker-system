import { auth } from "@/auth";
import SignoutBtn from "@/components/functional/signout-btn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Clock1, Edit2, Plus } from "lucide-react";

import { redirect } from "next/navigation";
import React from "react";
import CreateAppointmentAvailability from "@/components/functional/create-appointment-availability";
import UpdateAppointmentAvailability from "@/components/functional/update-appointment-availability";
import { toast } from "sonner";
import { UserExtended } from "@/actions/auth/types";
import AppointmentsLink from "@/components/functional/appointments-link";
import Appointments from "@/components/functional/appointments";

export default async function Dashboard({searchParams}:{searchParams:Promise<{status:string}>}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const status =( await searchParams).status
  return (
    <div className="">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex flex-row justify-between items-center">
              <div className="flex flex-row justify-between w-full gap-2 items-center">
              <span>Available Appointments</span>{" "}
            
              <UpdateAppointmentAvailability>
                <Button variant="outline">
                  <Edit2 className="w-4 h-4" />
                  <span>Update Availability</span>
                </Button>
                
              </UpdateAppointmentAvailability>
              
              </div>
            </CardTitle>
            <CardDescription>Manage your available appointments here</CardDescription>
           <AppointmentsLink/>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>View your upcoming appointments here</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Appointments status={status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
