"use client";

import { ReactNode, useState } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div>Something went wrong. Please sign in again.</div>;
  }

  return children;
}
