"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  targetOpacity: number
}

const PARTICLE_CORE_COLOR = "255, 87, 0"
const PARTICLE_DARK_FALLOFF_COLOR = "187, 72, 15"
const LINK_DISTANCE = 80
const MOUSE_INTERACTION_DISTANCE = 120

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesArray = useRef<Particle[]>([])
  const mousePosition = useRef({ x: -9999, y: -9999 })
  const animationFrameId = useRef<number | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);



  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const size = Math.random() * 3 + 2 // tamaño entre 2 y 5 px
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size,
      speedX: (Math.random() - 0.5) * 0.4, // más rápido
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: 0,
      targetOpacity: Math.random() * 0.6 + 0.4,
    }
  }, [])

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      particlesArray.current = []
      const area = canvas.width * canvas.height
      const particleCount = Math.min(Math.floor(area / 10000), 150)
      for (let i = 0; i < particleCount; i++) {
        particlesArray.current.push(createParticle(canvas))
      }
    },
    [createParticle],
  )

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesArray.current.forEach((particle, index) => {
      if (particle.opacity < particle.targetOpacity) {
        particle.opacity += 0.005
        if (particle.opacity > particle.targetOpacity) particle.opacity = particle.targetOpacity
      }

      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x > canvas.width + particle.size * 3) particle.x = -particle.size * 3
      else if (particle.x < -particle.size * 3) particle.x = canvas.width + particle.size * 3
      if (particle.y > canvas.height + particle.size * 3) particle.y = -particle.size * 3
      else if (particle.y < -particle.size * 3) particle.y = canvas.height + particle.size * 3

      const dxMouse = mousePosition.current.x - particle.x
      const dyMouse = mousePosition.current.y - particle.y
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

      if (distMouse < MOUSE_INTERACTION_DISTANCE) {
        const angle = Math.atan2(dyMouse, dxMouse)
        const force = (MOUSE_INTERACTION_DISTANCE - distMouse) / MOUSE_INTERACTION_DISTANCE
        const forceMultiplier = 0.6
        particle.x -= Math.cos(angle) * force * forceMultiplier
        particle.y -= Math.sin(angle) * force * forceMultiplier
      }

      const maxSpeed = 0.7
      const currentSpeed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2)
      if (currentSpeed > maxSpeed) {
        particle.speedX = (particle.speedX / currentSpeed) * maxSpeed
        particle.speedY = (particle.speedY / currentSpeed) * maxSpeed
      }

      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 1.8,
      )
      gradient.addColorStop(0, `rgba(${PARTICLE_CORE_COLOR}, ${particle.opacity})`)
      gradient.addColorStop(0.8, `rgba(${PARTICLE_DARK_FALLOFF_COLOR}, ${particle.opacity * 0.5})`)
      gradient.addColorStop(1, `rgba(${PARTICLE_DARK_FALLOFF_COLOR}, 0)`)

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      for (let j = index + 1; j < particlesArray.current.length; j++) {
        const otherParticle = particlesArray.current[j]
        const dxLink = particle.x - otherParticle.x
        const dyLink = particle.y - otherParticle.y
        const distLink = Math.sqrt(dxLink * dxLink + dyLink * dyLink)

        if (distLink < LINK_DISTANCE) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          const lineOpacity = Math.max(
            0,
            ((particle.opacity + otherParticle.opacity) / 2) * 0.2 * (1 - distLink / LINK_DISTANCE),
          )
          ctx.strokeStyle = `rgba(${PARTICLE_DARK_FALLOFF_COLOR}, ${lineOpacity})`
          ctx.lineWidth = 0.3
          ctx.stroke()
        }
      }
    })

    animationFrameId.current = requestAnimationFrame(drawParticles)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const performResize = () => {
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas)
    }

    const debouncedResize = () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current); // ✅ seguro
      }
      debounceTimer.current = setTimeout(performResize, 250)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const initialSetup = () => {
      performResize()
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      drawParticles()
    }

    if (document.readyState === "complete") {
      initialSetup()
    } else {
      window.addEventListener("load", initialSetup, { once: true })
    }

    window.addEventListener("resize", debouncedResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", debouncedResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("load", initialSetup)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current); // ✅ seguro
      }
    }
  }, [initParticles, drawParticles])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.4,
        width: "100%",
        height: "100%",
      }}
    />
  )
}
