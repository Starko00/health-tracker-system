'use server'
import { signIn } from "@/auth";

export   const handleGoogleSignIn = async function() {
   
    await signIn("google");
  };