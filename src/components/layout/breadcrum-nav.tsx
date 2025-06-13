"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href =
      "/" +
      segments.slice(0, index + 1).join("/")

    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return {
      label,
      href,
      isLast: index === segments.length - 1,
    }
  })

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link href={`/dashboard`} className="flex items-center hover:text-gray-900">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((breadcrumb) => (
        <div key={breadcrumb.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {breadcrumb.isLast ? (
            <span className="font-medium text-gray-900">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="hover:text-gray-900">
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
