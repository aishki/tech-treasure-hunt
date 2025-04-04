export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
      <p className="mt-6 text-cyan-400 font-orbitron text-center">
        <span className="inline-block animate-pulse">Initializing</span> Cyber Grid...
      </p>
      <p className="text-xs text-cyan-600 mt-2 font-orbitron">Preparing Treasure Hunt City</p>
    </div>
  )
}

