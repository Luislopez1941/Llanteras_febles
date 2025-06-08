"use client"

import type React from "react"

import { useEffect, useState, useRef, type MouseEvent } from "react"
import { useInView } from "react-intersection-observer"
import { Award, Users, PackageCheck, Clock } from "lucide-react"
import styles from "./Stats.module.css"

// Función de easing para una animación de conteo más suave
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const ANIMATION_DURATION = 2000 // 2 segundos para la animación de conteo

// --- Componente de Tarjeta Individual con lógica de Spotlight ---
function StatCard({ stat, index, inView }: { stat: any; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.statItem} ${inView ? "animate-fade-in-up" : ""}`}
      style={
        {
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`,
          animationDelay: `${index * 150}ms`,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
    >
      <div className={styles.statIconWrapper}>
        <stat.icon className={styles.statIcon} />
      </div>
      <div className={styles.statNumber}>
        {typeof stat.number === "number" ? stat.number.toLocaleString("es-MX") : stat.number}
        {stat.suffix}
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
    </div>
  )
}

// --- Componente Principal de la Sección ---
export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [counts, setCounts] = useState({
    years: 0,
    clients: 0,
    brands: 0,
  })

  const animationFrameId = useRef<number>()
  const startTimeRef = useRef<number | null>(null)

  // Usamos `useRef` para los valores objetivo para evitar que el `useEffect` se vuelva a ejecutar innecesariamente.
  const targetCounts = useRef({
    years: 15,
    clients: 10000,
    brands: 50,
  }).current

  useEffect(() => {
    if (!inView) return

    const step = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsedTime = timestamp - startTimeRef.current
      const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1)
      const easedProgress = easeOutCubic(progress)

      setCounts({
        years: Math.floor(easedProgress * targetCounts.years),
        clients: Math.floor(easedProgress * targetCounts.clients),
        brands: Math.floor(easedProgress * targetCounts.brands),
      })

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(step)
      } else {
        setCounts({
          years: targetCounts.years,
          clients: targetCounts.clients,
          brands: targetCounts.brands,
        })
      }
    }

    animationFrameId.current = requestAnimationFrame(step)

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [inView, targetCounts])

  const statsData = [
    { icon: Award, number: counts.years, suffix: "+", label: "Años de Experiencia" },
    { icon: Users, number: counts.clients, suffix: "+", label: "Clientes Satisfechos" },
    { icon: PackageCheck, number: counts.brands, suffix: "+", label: "Marcas Premium" },
    { icon: Clock, number: "24/7", suffix: "", label: "Servicio de Emergencia" },
  ]

  return (
    <section ref={ref} className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {statsData.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
