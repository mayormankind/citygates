import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorksPage() {
  const plans = [
    { name: "CityMax", min: "₦1,000,000", rate: "12%", tenure: "365 Days" },
    { name: "CityFlex", min: "₦500,000", rate: "10%", tenure: "182 or 365 Days" },
    { name: "CityCrux", min: "₦50,000", rate: "7%", tenure: "90, 182 or 365 Days" },
  ];

  const steps = [
    "Pick a CityGatesFB Investment Form",
    "Fill the form and select Investment Package of your choice",
    "Name your investment and input amount to invest",
    "Select method of payment to CityGatesFB",
    "Choose your periodic top-up type and value",
    "Select your preferred tenor from the options of boxes available",
    "Indicate the account you want your investment to be paid into at maturity",
    "A summary information about your investment including principal, tenure, interest rate, expected interest to be accrued at maturity and maturity date.",
    "Once you are fine with the summary, accept the terms and conditions to start investment.",
    "You will be issued a Certificate of Investment as evidence of your Investment with us.",
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-black text-center py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Join the CityGates iWorth Investment
        </h1>
        <p className="mt-4 text-lg text-gray-100">
          GROW WITH UP TO <span className="font-semibold text-blue-700">12%</span> ON YOUR INVESTMENTS
        </p>
        <Link href="/auth/register">
            <Button className="mt-6 bg-white text-black hover:bg-white/70 hover:text-white hover:scale-105 p-4 animate-pulse-glow transition-all px-8">Register Now</Button>
        </Link>
      </section>

      {/* Investment Plans Section */}
      {/* <section className="max-w-6xl mx-auto my-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          Investment Plans
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className="shadow-md border transition-transform hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <CardDescription>Minimum: {plan.min}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Interest Rate: {plan.rate}</p>
                <p className="text-gray-500">Tenure: {plan.tenure}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">How It Works</h2>
        <div className="flex gap-8 items-center">
            <div className="flex-1">
                <Image src={'/puzzle.svg'} width={1000} height={1000} alt="People collaborating"/>
            </div>
            <div className="w-full flex-2">
                <ol className="grid md:grid-cols-2 space-y-4 space-x-4">
                    {steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 flex-shrink-0 mt-1 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed max-w-prose">{step}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
      </section>
    </div>
  );
} 
