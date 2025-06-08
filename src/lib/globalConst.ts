import { Briefcase, BadgeCheck, Lightbulb, Headset, Calendar, Wallet, CheckCircle, FileText, Settings, Calculator, CreditCard, TrendingUp, ShoppingBag, Star, ArrowRight, Sparkles, Crown, Heart, Facebook, Instagram, Linkedin, MapPin, Store, X  } from "lucide-react"

export const features = [
    {
      label: "Expert Financial Guidance",
      description:
        "Our experienced team of financial experts provides personalized advice to help you make informed investment decisions and achieve your financial goals.",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      delay: 0,
    },
    {
      label: "Proven Track Record",
      description:
        "With a history of delivering consistent returns, we have built a reputation for trust and reliability in the investment industry.",
      icon: BadgeCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      delay: 200,
    },
    {
      label: "Innovative Investment Solutions",
      description:
        "We leverage cutting-edge technology and data-driven insights to offer innovative investment strategies tailored to meet the evolving needs of our clients.",
      icon: Lightbulb,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      delay: 400,
    },
    {
      label: "Comprehensive Support",
      description:
        "From account setup to portfolio management, our dedicated customer service team is here to provide you with full support every step of the way.",
      icon: Headset,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      delay: 600,
    },
]

export const investmentPlans = [
  {
    name: "CityMax",
    min: "₦1,000,000",
    rate: "12%",
    tenure: "365 Days",
    popular: false,
    classes: {
      bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600",
    },
  },
  {
    name: "CityFlex",
    min: "₦500,000",
    rate: "10%",
    tenure: "182 or 365 Days",
    popular: true,
    classes: {
      bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600",
    },
  },
  {
    name: "CityCrux",
    min: "₦50,000",
    rate: "7%",
    tenure: "90, 182 or 365 Days",
    popular: false,
    classes: {
      bg: "bg-green-50", border: "border-green-200", text: "text-green-600",
    },
  },
]

export const investmentSteps = [
  { title: "Pick Investment Form", description: "Choose a CityGatesFB Investment Form to get started", icon: FileText },
  { title: "Select Package", description: "Fill the form and select Investment Package of your choice", icon: Settings },
  { title: "Set Investment Amount", description: "Name your investment and input the amount to invest", icon: Calculator },
  { title: "Choose Payment Method", description: "Select method of payment to CityGatesFB", icon: CreditCard },
  { title: "Configure Top-ups", description: "Choose your periodic top-up type and value", icon: TrendingUp },
  { title: "Select Tenure", description: "Pick your preferred tenor from the available options", icon: Calendar },
  { title: "Set Payout Account", description: "Indicate where you want your investment paid at maturity", icon: Wallet },
  { title: "Review & Confirm", description: "Review summary, accept terms and get your investment certificate", icon: CheckCircle },
]

export const packages = [
  {
    label: "Double Jumbo",
    description:
      "Designed for the Odogwus who like to do it Big because of their big responsibility",
    price: "₦1100",
    per: "Per day",
    image: "/jumbo.jpg",
    icon: Crown,
    color: "from-purple-600 to-purple-800",
    bgGradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
  },
  {
    label: "Chickito Bumper",
    description:
      "It is designed to meet your craving for high-quality food supply without having to break the bank",
    price: "₦350",
    per: "Per day",
    image: "/product.jpg",
    icon: Star,
    color: "from-yellow-500 to-yellow-600",
    bgGradient: "from-yellow-50 to-yellow-100",
    borderColor: "border-yellow-200",
  },
  {
    label: "Minimini",
    description:
      "Minimini is packaged to suit your pocket. It is creatively packaged not to hurt your purse.",
    price: "₦1100",
    per: "Per day",
    image: "/mini.jpg",
    icon: Heart,
    color: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100",
    borderColor: "border-green-200",
  },
];

export const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
  { icon: X, href: "#", label: "Twitter", color: "hover:text-gray-300" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
]

export const quickLinks = [
  { name: "Store Front", href: "/store-front" },
  { name: "Plans & Packages", href: "#packages" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
]

export const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "FAQs", href: "/faqs" },
  { name: "Careers", href: "#" },
]

export const legalLinks = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Cookie Policy", href: "#" },
  { name: "Disclaimer", href: "#" },
]

export const sponsors = [
  { name: 'Activa', logo: '/activa.png' },
  { name: 'FCMB', logo: '/fcmb.png' },
  { name: 'Gando', logo: '/gando.jpg' },
  { name: 'Kings Oil', logo: '/kings.png' },
  { name: 'Milo', logo: '/milo.jpg' },
  { name: 'GB foods', logo: '/gb.svg' },
]