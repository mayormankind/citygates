"use client"

// import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Blubs from "@/components/layout/blubs"
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { Store } from '@/lib/types'
import { Crown, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRevealOnScroll } from '@/lib/useRevealOnScroll'

// export const metadata: Metadata = {
//   title: "Front Store",
//   description: "Wondering what we have in our store? You have a chance to take a peep at our catalogue.",
//   icons:'/globe.svg'
// }

export default function StoreFront() {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const { sectionRef, isVisible, visibleCards } = useRevealOnScroll(stores.length, 150, true)

    useEffect(() => {
      const unsubscribeStores = onSnapshot(collection(db, "stores"), (snapshot) => {
        const storesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Store[];
        setStores(storesData);
        setLoading(false);
      });
      return () => unsubscribeStores();
    }, []);

  return (
    <section ref={sectionRef} className="w-full">
      <div className="relative w-full h-80">
        <Image
          src="/store.jpg"
          alt="Our store front"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-white text-4xl font-bold">Our Store Front</h1>
        </div>
      </div>
      <main className="w-full bg-white p-6 px-0 md:p-12 relative">
        <Blubs/>
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
          
          <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-1 max-w-5xl mx-auto">
            {loading ? (
              <div className="col-span-2 text-center text-gray-500">
                <Loader2 className="inline-block mr-2" />
                  Loading packages...
              </div>
            ) : (
              stores.filter((store) => store.status === 'active').map((store,index) => (
                <Card
                  key={store.name}
                  className={`py-0 gap-0 min-w-2xs group relative delay-[${index * 200}ms] overflow-hidden transition-all duration-500 transform ${
                  visibleCards.includes(index)
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-10 scale-95"} hover:scale-105 hover:shadow-2xl bg-white border border-purple-200 rounded-xl`}
                >
                <div className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
          
                {/* Image section */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  <Image
                    src={store.image}
                    alt={store.name}
                    width={1000}
                    height={1000}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500 rounded-l-md"
                  />
                  {/* Floating Icon */}
                  <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg z-20`}>
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                </div>
          
                <div className="flex flex-col p-4">
                  <CardHeader className="space-y-2 text-left p-0">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors p-0">
                      {store.name}
                    </CardTitle>
                    <CardDescription className="leading-relaxed p-0 text-gray-500">
                      {store.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto border-t p-0">
                    <div className='w-full text-left'>
                      <span className="text-3xl font-bold text-[#5B1A68]">₦{store.price}</span>
                    </div>
                  </CardContent>
              </div>
            </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </section>
  )
}
