"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useInView } from "react-intersection-observer"
import styles from "./Layout.module.css"

export default function Layout() {
  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // Un poco más visible antes de animar
  })
  const { ref: tagRef, inView: tagInView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const { ref: titleRef, inView: titleInView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const { ref: subtitleRef, inView: subtitleInView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const { ref: buttonsRef, inView: buttonsInView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const { ref: scrollRef, inView: scrollInView } = useInView({ triggerOnce: true, threshold: 0.5 })


  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundGradient}></div>
      <div className={`${styles.blurElement1} animate-float`}></div>
      <div className={`${styles.blurElement2} animate-float-delayed`}></div>

      <div ref={contentRef} className={`${styles.content} ${contentInView ? 'animate-fade-in-up' : ''}`} style={{animationDelay: '0.1s'}}>
        <div ref={tagRef} className={`${styles.tag} ${tagInView ? 'animate-fade-in-up' : 'reveal-on-scroll'}`} style={{animationDelay: '0.2s'}}>
          <span className={styles.tagText}>🏆 Líderes en Llantas Premium</span>
        </div>

        <h1 ref={titleRef} className={`${styles.title} ${titleInView ? 'animate-text-reveal' : 'reveal-on-scroll'}`} style={{animationDelay: '0.4s'}}>
          Llanteras
          <br />
          <span className={`${styles.titleHighlight} ${titleInView ? 'animate-glow' : ''}`}>Febles</span>
        </h1>

        <p ref={subtitleRef} className={`${styles.subtitle} ${subtitleInView ? 'animate-fade-in-up' : 'reveal-on-scroll'}`} style={{animationDelay: '0.6s'}}>
          Revolucionamos tu experiencia de manejo con llantas de última generación. Calidad premium, instalación
          profesional y garantía total.
        </p>

        <div ref={buttonsRef} className={`${styles.buttonContainer} ${buttonsInView ? 'animate-fade-in-up' : 'reveal-on-scroll'}`} style={{animationDelay: '0.8s'}}>
          <Link href="#contacto" className={styles.primaryButton}>
            <span>Cotizar Ahora</span>
            <ArrowRight width={18} height={18} strokeWidth={2.5}/>
          </Link>
          <Link href="#servicios" className={styles.secondaryButton}>
            Ver Servicios
          </Link>
        </div>
      </div>
      <div ref={scrollRef} className={`${styles.scrollIndicator} ${scrollInView ? 'animate-bounce-slow' : 'reveal-on-scroll'}`} style={{animationDelay: '1s'}}>
        <ChevronDown width={28} height={28} />
      </div>
    </section>
  )
}
