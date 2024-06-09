import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type}) => {
  const [name,setName]= useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [email,setEmail] = useState<string>("")
  const router = useRouter();
  const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault()
    if(type=="login"){
     await signIn('credentials', {email, password, callbackUrl: '/'});
    }else if(type=="register"){
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name,email,password }),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        router.push("/signin")
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">
          {type === 'login' ? 'Login to Net Zero Planner' : 'Register for Net Zero Planner'}
        </h1>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form  className="px-5 py-7">
            <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input type="email" onChange={(e)=>setEmail(e.target.value)} name="email" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" required />
            {type === 'register' && (
              <>
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Name</label>
                <input type="text" onChange={(e)=>setName(e.target.value)}  name="name" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" required />
              </>
            )}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
              <input type="password" onChange={(e)=>setPassword(e.target.value)} name="password" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" required />
            <button onClick={(e)=>handleSubmit(e)} className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
              <span className="inline-block mr-2">{type === 'login' ? 'Login' : 'Register'}</span>
            </button>
          </form>
          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              {type === 'login' ? (
                <div className="text-center sm:text-left whitespace-nowrap">
                  <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                   <Link href="/signup">
                   <span className="inline-block ml-1">Don't have an account? Register</span>
                   </Link>
                  </button>
                </div>
              ) : (
                <div className="text-center sm:text-left whitespace-nowrap">
                  <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <Link href='/signin'>
                  <span className="inline-block ml-1">Already have an account? Login</span>
                  </Link> 
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
