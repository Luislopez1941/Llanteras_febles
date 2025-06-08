"use client"

import React, { useState } from "react"
import { useInView } from "react-intersection-observer"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./Faq.module.css"

export default function Faq() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqsData = [
    {
      question: "¿Cuánto tiempo toma cambiar las llantas de mi vehículo?",
      answer:
        "El tiempo promedio para cambiar las 4 llantas de un vehículo es de aproximadamente 30 a 45 minutos.",
    },
    {
      question: "¿Ofrecen garantía en sus productos y servicios?",
      answer:
        "Sí, todas nuestras llantas nuevas cuentan con garantía del fabricante contra defectos de fabricación.",
    },
    {
      question: "¿Necesito cita previa para cambiar mis llantas?",
      answer:
        "No es estrictamente necesario, pero recomendamos agendar una cita para garantizar atención rápida.",
    },
    {
      question: "¿Qué marcas de llantas manejan?",
      answer:
        "Trabajamos con marcas reconocidas como Michelin, Bridgestone, Pirelli, Continental, Goodyear, etc.",
    },
    {
      question: "¿Ofrecen servicio a domicilio?",
      answer:
        "Sí, contamos con servicio a domicilio para cambio de llantas y emergencias en nuestra área de cobertura.",
    },
  ]

  // ✅ Llama a useInView manualmente y fuera de map
  const faqInViewRefs = faqsData.map(() => useInView({ triggerOnce: true, threshold: 0.1 }))

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}>
          <h2 className={styles.title}>
            Preguntas <span className={styles.titleHighlight}>frecuentes</span>
          </h2>
          <p className={styles.subtitle}>Resolvemos tus dudas para que tengas la mejor experiencia</p>
        </div>

        <div className={styles.faqList}>
          {faqsData.map((faq, index) => {
            const { ref, inView } = faqInViewRefs[index]

            return (
              <div
                key={index}
                ref={ref}
                className={`${styles.faqItem} ${inView ? styles.faqItemVisible : ""}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  className={styles.faqButton}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className={styles.faqQuestion}>{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className={`${styles.faqIcon} ${styles.faqIconOpen}`} />
                  ) : (
                    <ChevronDown className={`${styles.faqIcon} ${styles.faqIconClosed}`} />
                  )}
                </button>
                <div
                  className={`${styles.faqAnswerContainer} ${
                    openIndex === index ? styles.faqAnswerContainerOpen : ""
                  }`}
                >
                  <div className={styles.faqAnswer}>{faq.answer}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
