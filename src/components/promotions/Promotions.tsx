"use client"

import type React from "react"
import { useState, useRef, type MouseEvent } from "react"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Tag } from "lucide-react" // Añadido Tag para un ícono
import Link from "next/link"
import styles from "./Promotions.module.css"

// --- Datos de las promociones ---
const promotionsData = [
  {
    icon: Tag, // Ícono para la promoción
    title: "2x1 en Alineación",
    description: "Por la compra de 4 llantas, recibe alineación y balanceo gratis.",
    validUntil: "31 de Diciembre, 2024",
    theme: "orange",
    isFeatured: true, // Para destacar la primera promoción
  },
  {
    icon: Tag,
    title: "Descuento Especial",
    description: "20% de descuento en llantas premium seleccionadas.",
    validUntil: "Hasta agotar existencias",
    theme: "gray",
    isFeatured: false,
  },
  {
    icon: Tag,
    title: "Servicio Express",
    description: "Cambio de llantas en menos de 30 minutos o es gratis.",
    validUntil: "Promoción permanente",
    theme: "orange",
    isFeatured: false,
  },
]

// --- Componente de Tarjeta Individual ---
function PromoCard({ promo, index }: { promo: (typeof promotionsData)[0]; index: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Un poco visible para activar
  })
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
      ref={ref}
      className={`${styles.promoCardWrapper} ${inView ? "animate-fade-in-up" : ""}`}
      style={{ animationDelay: `${index * 100}ms` }} // Delay más corto para entrada rápida
    >
      <div
        ref={cardRef}
        className={`
          ${styles.promoCard}
          ${promo.theme === "gray" ? styles.grayTheme : ""}
          ${promo.isFeatured ? styles.featuredCard : ""}
        `}
        onMouseMove={handleMouseMove}
        style={
          {
            "--mouse-x": `${mousePos.x}px`,
            "--mouse-y": `${mousePos.y}px`,
          } as React.CSSProperties
        }
      >
        <div className={styles.cardContent}>
          <div>
            <div className={styles.promoHeader}>
              {promo.icon && <promo.icon className={styles.promoIcon} />}
              <h3 className={styles.promoTitle}>{promo.title}</h3>
            </div>
            <p className={styles.promoDescription}>{promo.description}</p>
          </div>
          <div className={styles.promoFooter}>
            <span className={styles.validUntil}>Válido hasta: {promo.validUntil}</span>
            <Link href="#contacto" className={styles.ctaLink}>
              <span>Ver Oferta</span>
              <ArrowRight className={styles.ctaIcon} width={16} height={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Componente Principal de la Sección ---
export default function Promotions() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="promociones" className={styles.promotionsSection}>
      <div className={styles.container}>
        <div
          ref={headerRef}
          className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0ms" }}
        >
          <h2 className={`${styles.title} ${headerInView ? "animate-glow" : ""}`}>
            Ofertas <span className={styles.titleHighlight}>Imperdibles</span>
          </h2>
          <p className={styles.subtitle}>¡No te las pierdas! Calidad y ahorro en un solo lugar.</p>
        </div>

        <div className={styles.grid}>
          {promotionsData.map((promo, index) => (
            <PromoCard key={index} promo={promo} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
