"use client"

import { useEffect, useRef } from "react"

export default function LoseAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Glitch effect parameters
    let glitchInterval: NodeJS.Timeout
    let textOpacity = 1
    let fadeDirection = -0.02

    // Create wormhole effect
    class WormholeRing {
      x: number
      y: number
      radius: number
      speed: number
      color: string
      opacity: number

      constructor() {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.radius = Math.random() * 50 + 10
        this.speed = Math.random() * 2 + 0.5

        const hue = Math.floor(Math.random() * 60) + 240 // Blue to purple
        this.color = `hsl(${hue}, 100%, 50%)`
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.radius += this.speed
        this.opacity -= 0.005
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const rings: WormholeRing[] = []

    // Animation loop
    function animate() {
      // Clear canvas with dark background
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw wormhole rings
      for (let i = 0; i < rings.length; i++) {
        rings[i].update()
        rings[i].draw()

        if (rings[i].opacity <= 0) {
          rings.splice(i, 1)
          i--
        }
      }

      // Add new rings
      if (Math.random() < 0.1 && rings.length < 20) {
        rings.push(new WormholeRing())
      }

      // Draw red glitch lines
      for (let i = 0; i < 5; i++) {
        const y = Math.random() * canvas.height
        const height = Math.random() * 20 + 5
        const opacity = Math.random() * 0.5 + 0.2

        ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`
        ctx.fillRect(0, y, canvas.width, height)
      }

      // Update text opacity for pulsing effect
      textOpacity += fadeDirection
      if (textOpacity <= 0.4 || textOpacity >= 1) {
        fadeDirection *= -1
      }

      // Draw failure text with glow
      ctx.shadowColor = "rgba(255, 0, 0, 0.8)"
      ctx.shadowBlur = 15

      ctx.fillStyle = `rgba(255, 50, 50, ${textOpacity})`
      ctx.font = 'bold 40px "Orbitron", sans-serif'
      ctx.textAlign = "center"
      ctx.fillText("NAVIGATION FAILED", canvas.width / 2, canvas.height / 2 - 20)

      ctx.shadowBlur = 5
      ctx.fillStyle = `rgba(200, 200, 200, ${textOpacity * 0.8})`
      ctx.font = '24px "Orbitron", sans-serif'
      ctx.fillText("Sector security breach detected", canvas.width / 2, canvas.height / 2 + 30)

      ctx.shadowBlur = 0

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Add glitch effect at intervals
    glitchInterval = setInterval(() => {
      // Simulate screen shake
      canvas.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`

      // Reset after short delay
      setTimeout(() => {
        canvas.style.transform = "translate(0, 0)"
      }, 100)
    }, 500)

    // Clean up
    return () => {
      clearInterval(glitchInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

