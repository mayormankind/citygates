"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Zap, Eye, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const router = useRouter();

  useEffect(() => {
    // Initialize particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    // Handle mouse movement for background effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-redirect to dashboard after 5 seconds (optional)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/dashboard/admin");
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-amber-900 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-amber-400/20 transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-amber-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              boxShadow: "0 0 6px #fbbf24",
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute left-20 top-20 h-32 w-32 animate-spin-slow border border-purple-400/30" />
        <div className="absolute bottom-20 right-20 h-24 w-24 animate-bounce-slow border border-amber-400/30" />
        <div className="absolute left-10 top-1/2 h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20" />
      </div>

      {/* Main Content */}
      <Card className="relative z-10 w-full max-w-md border-purple-500/30 bg-black/40 shadow-2xl backdrop-blur-xl sm:max-w-lg md:max-w-2xl">
        <div className="space-y-8 p-6 text-center md:p-8">
          {/* Animated 401 */}
          <div className="relative">
            <h1 className="bg-gradient-to-r from-purple-400 via-amber-400 to-purple-400 bg-clip-text text-7xl font-bold text-transparent animate-pulse sm:text-8xl md:text-9xl">
              401
            </h1>
            <div className="absolute inset-0 animate-ping text-7xl font-bold text-purple-400/20 sm:text-8xl md:text-9xl">
              401
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Access Denied
              </span>
            </h2>
            <p className="mx-auto max-w-md text-base text-gray-300 leading-relaxed sm:text-lg">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="border-amber-400/50 bg-transparent text-amber-400 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:scale-105"
              onClick={() => router.push("/dashboard/admin")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>

          {/* Error Code */}
          <div className="border-t border-purple-500/20 pt-4">
            <p className="text-sm text-gray-500">
              Error Code:{" "}
              <span className="font-mono text-amber-400">
                UNAUTHORIZED_ACCESS_401
              </span>
            </p>
          </div>
        </div>
      </Card>

      {/* Glowing Orbs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
      <div
        className="absolute bottom-1/4 right-1/4 h-48 w-48 animate-pulse rounded-full bg-amber-500/10 blur-3xl"
        style={{ animationDelay: "1s" }}
      />
    </div>
  );
}
