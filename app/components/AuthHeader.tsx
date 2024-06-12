import React from "react";

export default function AuthHeader() {
  return (
    <div className="p-5 lg:p-10 md:p-10 fixed top-0 left-0 w-full z-10">
      <div className="flex justify-end  lg:justify-between md:justify-end items-center max-w-7xl mx-auto hidden lg:block md:hidden">
        <div className="flex justify-start space-x-5">
          <div>
            <h1 className="text-3xl font-bold text-[#15803D]">
            Net Zero Planner
            </h1>
            <p className="text-sm text-[#2a2c30]">
            Plan Your Path to a Sustainable Future with Climate Actions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
