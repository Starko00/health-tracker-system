
import { handleGoogleSignIn } from "@/actions/auth";
import { Button } from "../ui/button";

import Image from "next/image";
export function GoogleSignInBtn() {
    return (
      <Button variant={"outline"} type="submit" onClick={handleGoogleSignIn} className="w-full mt-4">
        {" "}
        <span className="rounded-full bg-white border p-1  flex items-center justify-center aspect-square">
          <Image src="/assets/google.svg" alt="google" width={20} height={20} className="w-4 h-4 " />
        </span>
        Sign in with Google
      </Button>
    );
  }
