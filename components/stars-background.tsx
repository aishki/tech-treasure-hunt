"use client"

import { useEffect, useRef } from "react"

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Star properties
    class Star {
      x: number
      y: number
      size: number
      speed: number
      brightness: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5
        this.speed = Math.random() * 0.05 + 0.01
        this.brightness = Math.random() * 0.5 + 0.5
      }

      update() {
        // Move stars slightly
        this.y += this.speed

        // Reset position if star goes off screen
        if (this.y > canvas.height) {
          this.y = 0
          this.x = Math.random() * canvas.width
        }

        // Twinkle effect
        this.brightness = Math.max(0.5, Math.min(1, this.brightness + (Math.random() - 0.5) * 0.1))
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`
        ctx.fill()
      }
    }

    // Create stars
    const stars: Star[] = []
    const starCount = Math.floor((canvas.width * canvas.height) / 2000) // Adjust density

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars
      stars.forEach((star) => {
        star.update()
        star.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.8 }} />
}

