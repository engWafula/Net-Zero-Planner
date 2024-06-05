
import { Main } from "next/document";
import Image from "next/image";
import { redirect } from "next/navigation";

export default   async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const loggedIn = false

    if(!loggedIn) redirect('/signin')



    return (
      <main className="flex h-screen w-full font-inter">
          <div className="flex size-full flex-col">
        <div className="root-layout">

        </div>
        {children}
      </div>
      </main>
    );
  }
  