"use client"

import React, { useEffect, useRef, useState } from "react";
import PartnersSection from "@/components/sections/Partners";
import Purpose from "@/components/sections/Purpose";
import HeroSection from "@/components/sections/HeroSection";
import About from "@/components/sections/About";
import Packages from "@/components/sections/Packages";
import PackagesNew from "@/components/sections/bin3";
import Hero from "@/components/sections/Hero";
import HowItWorksPage from "@/components/sections/HowItWorks";


const Home = () => {

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen relative w-full overflow-hidden">
      {/* <HeroSection/> */}
      <Hero/>
      <About/>
      <Purpose/>
      {/* <PackagesNew/> */}
      <Packages/>
      <HowItWorksPage/>
      <PartnersSection/>
    </div>
  );
};

export default Home;
