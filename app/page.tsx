import { Suspense } from "react"
import TreasureHunt from "@/components/treasure-hunt"
import Loading from "@/components/loading"
import StarsBackground from "@/components/stars-background"

export default function Home() {
  return (
    <main className="min-h-screen space-background text-cyan-400 flex flex-col relative">
      <div className="nebula" />
      <StarsBackground />

      <header className="p-6 border-b border-cyan-800/50 relative z-10 backdrop-blur-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-wider title-text font-orbitron">
          PROJECT DAGTAAN
        </h1>
        <p className="text-center mt-2 text-xl subtitle-text font-orbitron">CYBER WORLD TOUR</p>
        <div className="text-center mt-2 text-cyan-500 text-sm">
          Welcome, Traveller! Navigate the Treasure Hunt City
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 relative z-10">
        <Suspense fallback={<Loading />}>
          <TreasureHunt />
        </Suspense>
      </div>

      <footer className="p-4 text-center text-cyan-600 border-t border-cyan-800/50 relative z-10 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Project Dagtaan: Cyber World Tour</p>
      </footer>
    </main>
  )
}

