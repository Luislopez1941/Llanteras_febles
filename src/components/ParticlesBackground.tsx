"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  size: number // Radio exterior de la "llanta"
  speedX: number
  speedY: number
  opacity: number
  targetOpacity: number
  rotation: number // Ángulo de rotación actual
  rotationSpeed: number // Velocidad de rotación
}

const PARTICLE_CORE_COLOR_RGB = "255, 87, 0" // Naranja principal
const PARTICLE_DARK_FALLOFF_COLOR_RGB = "187, 72, 15" // Naranja oscuro
const LINK_DISTANCE = 90 // Aumentada ligeramente
const MOUSE_INTERACTION_DISTANCE = 130 // Aumentada ligeramente

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesArray = useRef<Particle[]>([])
  const mousePosition = useRef({ x: -9999, y: -9999 })
  const animationFrameId = useRef<number | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const size = Math.random() * 4 + 3 // Tamaño entre 3px y 7px (radio exterior)
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size,
      speedX: (Math.random() - 0.5) * 0.3, // Velocidad ligeramente reducida
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      targetOpacity: Math.random() * 0.5 + 0.3, // Opacidad entre 0.3 y 0.8
      rotation: Math.random() * Math.PI * 2, // Rotación inicial aleatoria
      rotationSpeed: (Math.random() - 0.5) * 0.01, // Velocidad de rotación sutil
    }
  }, [])

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      particlesArray.current = []
      const area = canvas.width * canvas.height
      // Reducir la cantidad de partículas ya que son más complejas de dibujar
      const particleCount = Math.min(Math.floor(area / 18000), 70)
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
      // Actualizar opacidad
      if (particle.opacity < particle.targetOpacity) {
        particle.opacity += 0.008 // Fade-in un poco más rápido
        if (particle.opacity > particle.targetOpacity) particle.opacity = particle.targetOpacity
      }

      // Actualizar posición y rotación
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.rotation += particle.rotationSpeed

      // Bordes (reaparecer)
      const particleBoundaryOffset = particle.size * 2 // Para que reaparezca completamente fuera
      if (particle.x > canvas.width + particleBoundaryOffset) particle.x = -particleBoundaryOffset
      else if (particle.x < -particleBoundaryOffset) particle.x = canvas.width + particleBoundaryOffset
      if (particle.y > canvas.height + particleBoundaryOffset) particle.y = -particleBoundaryOffset
      else if (particle.y < -particleBoundaryOffset) particle.y = canvas.height + particleBoundaryOffset

      // Interacción con el mouse
      const dxMouse = mousePosition.current.x - particle.x
      const dyMouse = mousePosition.current.y - particle.y
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

      if (distMouse < MOUSE_INTERACTION_DISTANCE) {
        const angle = Math.atan2(dyMouse, dxMouse)
        const force = (MOUSE_INTERACTION_DISTANCE - distMouse) / MOUSE_INTERACTION_DISTANCE
        const forceMultiplier = 0.5 // Reducir un poco la fuerza de empuje
        particle.x -= Math.cos(angle) * force * forceMultiplier
        particle.y -= Math.sin(angle) * force * forceMultiplier
      }

      // Control de velocidad máxima
      const maxSpeed = 0.5
      const currentSpeed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2)
      if (currentSpeed > maxSpeed) {
        particle.speedX = (particle.speedX / currentSpeed) * maxSpeed
        particle.speedY = (particle.speedY / currentSpeed) * maxSpeed
      }

      // Dibujar "llanta" estilizada
      ctx.save() // Guardar estado del canvas
      ctx.translate(particle.x, particle.y) // Mover origen al centro de la partícula
      ctx.rotate(particle.rotation) // Aplicar rotación

      const tireOuterRadius = particle.size
      const tireInnerRadius = particle.size * 0.6 // Radio del "rin" o interior
      const tireThickness = particle.size * 0.25 // Grosor del dibujo de la llanta

      // Color con opacidad
      const coreColor = `rgba(${PARTICLE_CORE_COLOR_RGB}, ${particle.opacity * 0.8})`
      const darkFalloffColor = `rgba(${PARTICLE_DARK_FALLOFF_COLOR_RGB}, ${particle.opacity * 0.5})`

      // Dibujar la parte exterior de la llanta (más gruesa)
      ctx.beginPath()
      ctx.arc(0, 0, tireOuterRadius, 0, Math.PI * 2)
      ctx.strokeStyle = coreColor
      ctx.lineWidth = tireThickness + 1 // Un poco más gruesa
      ctx.stroke()

      // Dibujar un "rin" interior más sutil
      ctx.beginPath()
      ctx.arc(0, 0, tireInnerRadius, 0, Math.PI * 2)
      ctx.strokeStyle = darkFalloffColor
      ctx.lineWidth = tireThickness * 0.5 // Más delgado
      ctx.stroke()

      // Opcional: Pequeños "radios" o detalles en el rin
      const spokes = 5 // Número de radios
      for (let i = 0; i < spokes; i++) {
        ctx.beginPath()
        const angle = (i / spokes) * Math.PI * 2
        ctx.moveTo(0, 0) // Desde el centro
        ctx.lineTo(Math.cos(angle) * tireInnerRadius * 0.8, Math.sin(angle) * tireInnerRadius * 0.8)
        ctx.strokeStyle = `rgba(${PARTICLE_DARK_FALLOFF_COLOR_RGB}, ${particle.opacity * 0.3})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.restore() // Restaurar estado del canvas

      // Dibujar líneas de conexión
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
            ((particle.opacity + otherParticle.opacity) / 2) * 0.15 * (1 - distLink / LINK_DISTANCE), // Líneas más tenues
          )
          ctx.strokeStyle = `rgba(${PARTICLE_DARK_FALLOFF_COLOR_RGB}, ${lineOpacity})`
          ctx.lineWidth = 0.2 // Líneas muy finas
          ctx.stroke()
        }
      }
    })

    animationFrameId.current = requestAnimationFrame(drawParticles)
  }, []) // No hay dependencias externas que cambien y requieran recrear drawParticles

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const performResize = () => {
      // Ajustar para que el canvas cubra toda la altura del contenido de la página
      const newHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
      )
      canvas.style.width = "100%" // CSS width
      canvas.style.height = `${newHeight}px` // CSS height

      // Ajustar el tamaño del elemento canvas para la resolución
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = newHeight * dpr
      canvas.getContext("2d")?.scale(dpr, dpr) // Escalar el contexto para alta resolución

      initParticles(canvas)
    }

    const debouncedResize = () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(performResize, 250)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Ajustar la posición del mouse por el scroll si el canvas es absoluto y scrollea con la página
      mousePosition.current = { x: e.clientX, y: e.clientY + window.scrollY }
    }

    const initialSetup = () => {
      performResize()
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = requestAnimationFrame(drawParticles)
    }

    // Usar 'load' para asegurar que scrollHeight sea preciso
    if (document.readyState === "complete") {
      initialSetup()
    } else {
      window.addEventListener("load", initialSetup, { once: true })
    }

    window.addEventListener("resize", debouncedResize)
    // Cambiar a 'document' para mousemove si el canvas es 'fixed' o cubre toda la ventana
    // Si el canvas es 'absolute' y scrollea, 'window' está bien pero hay que ajustar 'y'
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", debouncedResize)
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("load", initialSetup)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [initParticles, drawParticles, createParticle]) // createParticle es dependencia de initParticles

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", // Cambiado a absolute para que scrollee con la página
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0, // Detrás del contenido principal
        opacity: 0.35, // Opacidad general del canvas ligeramente ajustada
        // width y height se manejan por JS para el elemento canvas, CSS para el estilo
      }}
    />
  )
}
