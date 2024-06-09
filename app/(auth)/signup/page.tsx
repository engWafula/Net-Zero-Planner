'use client';
import AuthForm from "@/app/components/AuthForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function RegisterPage() {
  const session = useSession();
  const notLoggedIn = (session.status=="authenticated")

  if(notLoggedIn) redirect('/')
    
  return (
    <div>
    <AuthForm type="register" />
    </div>
  );
}