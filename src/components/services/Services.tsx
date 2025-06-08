"use client"

import { useRef, useState, type MouseEvent } from "react"
import { Shield, Zap, Clock, Star } from "lucide-react"
import { useInView } from "react-intersection-observer"
import styles from "./Services.module.css"

// --- Datos de los servicios ---
const servicesData = [
  {
    icon: Shield,
    title: "Instalación Premium",
    description: "Instalación profesional con balanceado computarizado y alineación de precisión.",
    features: ["Balanceado digital", "Alineación láser", "Garantía 2 años"],
  },
  {
    icon: Zap,
    title: "Servicio Express",
    description: "Cambio de llantas en tiempo récord sin comprometer la calidad del servicio.",
    features: ["30 min máximo", "Sin cita previa", "Servicio a domicilio"],
  },
  {
    icon: Clock,
    title: "Emergencias 24/7",
    description: "Servicio de emergencia las 24 horas para cuando más lo necesites.",
    features: ["Disponible 24/7", "Llegada en 30 min", "Cobertura total"],
  },
]

// --- Componente de Tarjeta Individual con lógica de animación y 3D ---
function ServiceCard({ service, index }: { service: (typeof servicesData)[0]; index: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const cardRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({})

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const { left, top, width, height } = card.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    const rotateX = -((height / 2 - y) / (height / 2)) * 8 // Rango de rotación de -8 a 8 grados
    const rotateY = ((width / 2 - x) / (width / 2)) * 8

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: "transform 0.1s linear",
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
      transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
    })
  }

  return (
    <div
      ref={ref}
      className={`${styles.serviceCardWrapper} ${inView ? "animate-fade-in-up" : ""}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div
        ref={cardRef}
        className={styles.serviceCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
      >
        <div className={styles.cardBorder}></div>
        <div className={styles.cardContent}>
          <div className={styles.iconWrapper}>
            <service.icon strokeWidth={1.5} className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>{service.title}</h3>
          <p className={styles.cardDescription}>{service.description}</p>
          <ul className={styles.featureList}>
            {service.features.map((feature, idx) => (
              <li key={idx} className={styles.featureItem} style={{ transitionDelay: `${100 + idx * 50}ms` }}>
                <Star className={styles.featureIcon} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// --- Componente Principal de la Sección ---
export default function Services() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="servicios" className={styles.servicesSection}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}>
          <h2 className={styles.title}>
            Servicios de
            <span className={styles.titleHighlight}> Vanguardia</span>
          </h2>
          <p className={styles.subtitle}>Tecnología y precisión para el máximo rendimiento de tu vehículo.</p>
        </div>

        <div className={styles.grid}>
          {servicesData.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
