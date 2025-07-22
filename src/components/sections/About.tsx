import Image from 'next/image'
import React from 'react'

export default function About() {
  return (
    <div className='w-full relative'>
        <div className="grid lg:grid-cols-2 w-full bg-white">
            <section className='w-full'>
                <Image alt='A man putting a coin in a jar' src='/growth.jpg' width={1000} height={1000}/>
            </section>
            {/* <section className='w-full flex p-8 md:p-12 bg-blue-900 text-white'> */}
            <section className='w-full bg-gray-200 flex p-8 md:p-12 text-black'>
                <div className="flex flex-col gap-4 my-auto">
                    <h1 className='text-3xl font-bold'>About Us?</h1>
                    <p>CityGates Food Bank provides strategic food supply chain and financial support in an ethical cooperative manner with a view to eradicate poverty and ensure food security in the land. We also grant instant loan to men and women in business and career to solve their immediate financial issues. In a bid to touch the lives of the most vulnerable, we also go to the rural community to provide food stuff to vulnerable women and children through our communal food outreach programme.</p>
                </div>
            </section>
        </div>
      
    </div>
  )
}
