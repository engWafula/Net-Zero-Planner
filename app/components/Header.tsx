import React from "react";

export default function Header({ userName }: any) {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white shadow-sm">
      <div className="flex ml-20 justify-start items-center ">
      <h1 className="text-2xl font-semibold text-center text-green-700">
          Net Zero Planner
        </h1>  
         </div>
      <div className="flex flex-grow items-center justify-end py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex justify-end gap-3 2xsm:gap-7">
          <div className="relative">
            <div className="flex items-center gap-4">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                  {userName}
                </span>
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full  text-center text-white">
                <img
                  className="rounded-full"
                  src={`https://ui-avatars.com/api/name=${userName}&background=random`}
                  alt="User"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
