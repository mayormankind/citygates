"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function SigninTabs({ initialTab = "signin-as-customer" }) {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab") === "admin" ? "signin-as-admin" : "signin-as-customer";
    setSelectedTab(tab);
  }, [searchParams]);

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full space-y-6">
      <div className="w-fit flex flex-col mx-auto items-center">
        <div className="w-10 h-10">
          <Image
            src={"/logo.jpeg"}
            width={1000}
            height={1000}
            alt="CityGates Logo"
            className="h-full"
          />
        </div>
        <h2 className="text-2xl font-bold">CityGates Food Bank</h2>
      </div>
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger
            value="signin-as-customer"
            className="data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="signin-as-admin"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Admin
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="signin-as-customer" id="customer" className="w-full">
        <div className="w-full flex flex-col space-y-4">
          <div className="flex gap-4 items-center">
            <h3>+234</h3>
            <Input placeholder="Enter your phone number." />
          </div>
          <Button>Send OTP</Button>
          <p className="text-center text-sm">
            New user?{" "}
            <span className="text-blue-700">
              <Link href={"/auth/register"}>Register here.</Link>
            </span>
          </p>
        </div>
      </TabsContent>
      <TabsContent value="signin-as-admin" id="admin" className="w-full flex flex-col space-y-4">
        <Input placeholder="Enter your email" />
        <Input placeholder="Enter your password" />
        <Button>Signin</Button>
      </TabsContent>
    </Tabs>
  );
}