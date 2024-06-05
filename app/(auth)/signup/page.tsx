'use client';
import AuthForm from "@/app/components/AuthForm";
import Image from "next/image";
import {useState} from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev: { preventDefault: () => void; }) {
    ev.preventDefault();
    setLoginInProgress(true);


    setLoginInProgress(false);
  }
  return (
    <div>
    <AuthForm type="register" onSubmit={handleFormSubmit} />
    </div>
  );
}