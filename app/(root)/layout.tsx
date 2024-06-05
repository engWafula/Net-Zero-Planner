
import { Main } from "next/document";
import Image from "next/image";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default   async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const loggedIn = true

    if(!loggedIn) redirect('/signin')



    return (
      <div className='h-full'>
        <div className='h-[80px] md:pl-56 fixed insert-y-0 w-full z-50'>
          <Header/>
        </div>
        <div className='hidden md:flex h-[100%] w-70 flex-col fixed insert-y-0 z-50'>
         <Sidebar/>
        </div>
        <main className='md:pl-56 bg-gray-100 pt-[80px] h-full'>
        {children}
        </main>
      </div>

    );
  }
  