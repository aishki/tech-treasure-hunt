"use client"

import { useEffect, useRef } from "react"

export default function WinAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      rotation: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5

        // More vibrant colors for space theme
        const hue = Math.random() * 360
        this.color = `hsl(${hue}, 100%, 70%)`

        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = Math.random() * 0.1 - 0.05
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        if (this.size > 0.2) this.size -= 0.05
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        ctx.fillStyle = this.color
        ctx.beginPath()

        // Star shape
        for (let i = 0; i < 5; i++) {
          const outerX = Math.cos((Math.PI * 2 * i) / 5) * this.size
          const outerY = Math.sin((Math.PI * 2 * i) / 5) * this.size
          const innerX = Math.cos((Math.PI * 2 * i + Math.PI) / 5) * (this.size / 2)
          const innerY = Math.sin((Math.PI * 2 * i + Math.PI) / 5) * (this.size / 2)

          if (i === 0) {
            ctx.moveTo(outerX, outerY)
          } else {
            ctx.lineTo(outerX, outerY)
          }

          ctx.lineTo(innerX, innerY)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }

    const particles: Particle[] = []

    // Create initial particles
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw cosmic background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      gradient.addColorStop(0, "rgba(0, 100, 255, 0.1)")
      gradient.addColorStop(0.5, "rgba(100, 0, 255, 0.05)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw congratulations text with glow
      ctx.shadowColor = "#00ffff"
      ctx.shadowBlur = 20

      ctx.fillStyle = "#00ffff"
      ctx.font = 'bold 40px "Orbitron", sans-serif'
      ctx.textAlign = "center"
      ctx.fillText("COSMIC DISCOVERY!", canvas.width / 2, canvas.height / 2 - 20)

      ctx.shadowBlur = 10
      ctx.fillStyle = "#ffffff"
      ctx.font = '24px "Orbitron", sans-serif'
      ctx.fillText("Excellent navigation, Traveller!", canvas.width / 2, canvas.height / 2 + 30)

      ctx.shadowBlur = 0

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        if (particles[i].size <= 0.2) {
          particles.splice(i, 1)
          i--

          // Add new particle to maintain count
          if (Math.random() < 0.5) {
            particles.push(new Particle())
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Clean up
    return () => {
      // Cancel animation frame if needed
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

