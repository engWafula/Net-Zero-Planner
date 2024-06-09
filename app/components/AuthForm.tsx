import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './FormInput';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (type === "login") {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid Email or Password");
      } else {
        router.push('/');
      }
    } else if (type === "register") {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">
          {type === 'login' ? 'Login to Net Zero Planner' : 'Register for Net Zero Planner'}
        </h1>
        <div className="bg-white shadow w-full  rounded-lg divide-y divide-gray-200">
          <form className="px-5 py-7">
            <FormInput
              label="E-mail"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {type === 'register' && (
              <FormInput
                label="Name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleSubmit} className="transition duration-200 bg-blue-500 hover:bg-blue-600   text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
              <span className="inline-block mr-2">{type === 'login' ? 'Login' : 'Register'}</span>
            </button>
            {error && (
              <div className='flex items-center justify-center mt-2'>
                <p className="font-semibold mt-5 text-sm text-red-500 pb-1 block">{error}</p>
              </div>
            )}
          </form>
          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              {type === 'login' ? (
                <div className="text-center sm:text-left whitespace-nowrap ">
                  <div className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <Link href="/signup">
                      <span className="inline-block ml-1">Don't have an account? Register</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center sm:text-left whitespace-nowrap">
                  <div className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <Link href='/signin'>
                      <span className="inline-block ml-1">Already have an account? Login</span>
                    </Link>
                  </div>
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
