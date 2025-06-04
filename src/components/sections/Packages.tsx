'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function Packages() {
  const packages = [
    {
      label: "Double Jumbo",
      description:
        "Designed for the Odogwus who like to do it Big because of their big responsibility",
      price: "₦1100",
      per: "Per day",
      image: "/product.jpg",
    },
    {
      label: "Chickito Bumper",
      description:
        "It is designed to meet your craving for high-quality food supply without having to break the bank",
      price: "₦350",
      per: "Per day",
      image: "/product.jpg",
    },
    {
      label: "Minimini",
      description:
        "Minimini is packaged to suit your pocket. It is creatively packaged not to hurt your purse.",
      price: "₦1100",
      per: "Per day",
      image: "/product.jpg",
    },
  ];

  return (
    <section className="w-full bg-gray-100 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Plans and Packages We Offer
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the package that suits your needs without compromising quality or budget.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
        {packages.map((pkg) => (
          <Card
            key={pkg.label}
            className="hover:shadow-xl transition-shadow duration-300 ease-in-out grid md:grid-cols-2"
          >
            <Image
              src={pkg.image}
              alt={pkg.label}
              width={1000} height={1000}
              className="w-full h-48 object-cover rounded-t-md"
            />
            <div className="flex flex-col gap-4">
                <CardHeader className="space-y-2 text-left">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        {pkg.label}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {pkg.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-2 border-t">
                <p className="text-lg font-medium text-gray-800">
                    {pkg.price}
                    <span className="ml-1 text-sm text-gray-500">{pkg.per}</span>
                </p>
                </CardContent>

            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
