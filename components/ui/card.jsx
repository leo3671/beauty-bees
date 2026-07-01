import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white text-bb-heading shadow-sm overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "font-heading text-base font-bold leading-none tracking-tight text-bb-heading",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs text-slate-400 font-medium", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
