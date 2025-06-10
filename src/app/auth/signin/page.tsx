"use client";

// export const dynamic = "force-dynamic";

import SigninTabs from "@/components/layout/signinTabs";
import Image from "next/image";

export default function Signin() {
  return (
    <div className="w-full flex h-full min-h-screen bg-gradient-to-r from-[#5B1A68] via-purple-800 to-[#5B1A68] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl animate-glow"></div>
      </div>
      <div className="m-auto w-full min-h-5/7 bg-white max-w-3xl grid md:grid-cols-2 rounded-md">
        <div className="w-full h-full">
          <Image
            src={"/investment.jpg"}
            className="w-full h-full object-cover rounded-md"
            width={1000}
            height={1000}
            alt="Investment"
          />
        </div>
        <div className="flex flex-col space-y-6 p-8">
          <SigninTabs />
        </div>
      </div>
    </div>
  );
}