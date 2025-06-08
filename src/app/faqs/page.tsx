import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Blubs from "@/components/layout/blubs"
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "HAve any questions in mind to ask? We are here to help.",
  icons:'/globe.svg'
}

const Faqs = () => {


    const faqs = [
        {
          question: "What is CityGates Food Bank Ltd?",
          answer:
            "CityGates Food Bank Ltd is an independent organization focused on reducing hunger and poverty through food distribution and financial support. We use a savings-based model to make food accessible to the Not-Too-Poor in the community, helping them access nutritious food with minimal or no cash outlay."
        },
        {
          question: "Is CityGates Food Bank registered?",
          answer:
            "Yes, we are fully registered with the Corporate Affairs Commission (CAC) under the Company Act of 1982. We were formerly known as Champions Finance, a Multi-Purpose Cooperative Society registered in 2018."
        },
        {
          question: "What is the Food Bumper Package?",
          answer:
            "The Food Bumper Package is our flagship food security initiative. With daily contributions starting from just ₦200, participants are eligible for large food supplies at the end of a 3, 6, or 12-month tenure—based on their chosen plan."
        },
        {
          question: "Can I save money with CityGates Food Bank?",
          answer:
            "Yes. Our Personal Savings and Loan Scheme lets you save money regularly, redeemable at the end of your selected period or on request. It also qualifies you for low-interest, non-collateral loans and annual dividends."
        },
        {
          question: "Do you offer loans?",
          answer:
            "Absolutely. We provide instant loans to individuals in business or career fields who are part of our savings or cooperative plans. These loans help with personal or domestic financial needs, without requiring collateral."
        },
        {
          question: "What is 'Own Your Own Property' all about?",
          answer:
            "This scheme lets you acquire household and personal items (e.g., laptops, TVs, generators) by making small installment payments over 3, 6, or 12 months."
        },
        {
          question: "Can I buy food directly from CityGates Food Bank?",
          answer:
            "Yes! Our Store Front is an online shop where you can purchase food items directly at wholesale prices."
        },
        {
          question: "How do I become a member?",
          answer:
            "Join our Cooperative Membership Platform by opening a Cooperative Membership Account (CMA). This account allows you to open a Save As You Earn (SAYE) plan and gives you access to loans and dividends."
        },
        {
          question: "Do I need to be poor to benefit from this platform?",
          answer:
            "Not at all. CityGates Food Bank Ltd targets the Not-Too-Poor—those who may not be in extreme poverty but struggle to maintain consistent access to nutritious food."
        },
        {
          question: "Is there a minimum amount to participate in savings or food packages?",
          answer:
            "Yes, for the Food Bumper Package, the minimum daily contribution is ₦200. For other services, terms vary based on the plan."
        },
        {
          question: "What is the mission of CityGates Food Bank Ltd?",
          answer:
            "Our mission is to: Foster productivity and investment among members; Enhance food security via strategic packages; Offer accessible loans and encourage savings; Break the cycle of poverty through empowerment."
        },
        {
          question: "What’s your vision?",
          answer:
            "To creatively provide quality food to vulnerable individuals, empower communities, and improve lives—regardless of location or economic status."
        },
        {
          question: "Do you help rural communities?",
          answer:
            "Yes! Through our Communal Food Outreach Program, we visit rural communities to distribute food to vulnerable women and children—ensuring no one is left behind."
        },
        {
          question: "How can I get started or ask questions?",
          answer:
            "You can contact our support team through our website, social platforms, or visit our physical office. We’re always here to guide you every step of the way."
        }
    ];

  return (
    <section className="w-full">
      <div className="relative w-full h-80">
        <Image
          src="/faq2.jpg"
          alt="About us"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="text-white text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-lg text-white/60">
            Get answers to common questions about CityGate's platform, security, and support.</p>
        </div>
      </div>
      <div className="container mx-auto py-8 relative">
        <Blubs/>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full bg-white">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left px-4 font-medium text-lg bg-transparent text-black hover:bg-transparent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 px-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
