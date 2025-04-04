"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type BoxProps = {
  number: number
  status: "unanswered" | "correct" | "failed"
  onClick: () => void
}

export default function Box({ number, status, onClick }: BoxProps) {
  return (
    <button
      onClick={onClick}
      disabled={status === "correct" || status === "failed"}
      className={cn(
        "tech-box aspect-square flex items-center justify-center rounded-md border text-lg font-bold transition-all duration-300 relative overflow-hidden",
        status === "unanswered" &&
          "border-cyan-600/70 bg-black/60 hover:bg-cyan-900/40 hover:border-cyan-400 hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] active:scale-95 backdrop-blur-sm",
        status === "correct" && "border-green-600/70 bg-green-900/20 text-green-400 cursor-not-allowed",
        status === "failed" && "border-red-600/70 bg-red-900/20 text-red-400 cursor-not-allowed",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cyan-900/20 pointer-events-none" />

      {status === "unanswered" && <div className="absolute inset-0 hologram opacity-30 pointer-events-none"></div>}

      <span className="relative z-10">{number}</span>

      {status === "correct" && <CheckCircle className="absolute bottom-1 right-1 w-4 h-4 text-green-400" />}

      {status === "failed" && <XCircle className="absolute bottom-1 right-1 w-4 h-4 text-red-400" />}
    </button>
  )
}

