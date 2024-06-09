'use client';
import AuthForm from "@/app/components/AuthForm";
import Image from "next/image";
import {useState} from "react";

export default function LoginPage() {
  return (
    <div>
           <AuthForm type="login"/>
    </div>
  );
}