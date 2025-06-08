"use client"

import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"
import styles from "./Testimonials.module.css" // Import CSS Module

export default function Testimonials() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: sliderRef, inView: sliderInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeIndex, setActiveIndex] = useState(0)

  const testimonialsData = [
    {
      name: "Carlos Rodríguez",
      vehicle: "Toyota Camry",
      comment:
        "Excelente servicio y atención. Cambiaron mis llantas en tiempo récord y el precio fue muy competitivo. Definitivamente regresaré.",
      rating: 5,
    },
    {
      name: "María González",
      vehicle: "Honda CR-V",
      comment:
        "Me encantó la asesoría personalizada. Me explicaron todas las opciones disponibles para mi vehículo y me ayudaron a elegir las mejores llantas según mi presupuesto.",
      rating: 5,
    },
    {
      name: "Juan Pérez",
      vehicle: "Ford F-150",
      comment:
        "Servicio de primera calidad. Las llantas que me recomendaron son excelentes para mi camioneta y el agarre en terrenos difíciles es impresionante.",
      rating: 4,
    },
    {
      name: "Ana Martínez",
      vehicle: "Volkswagen Golf",
      comment:
        "Llegué sin cita previa con una emergencia y me atendieron de inmediato. Repararon mi llanta ponchada en minutos. Muy profesionales.",
      rating: 5,
    },
  ]

  useEffect(() => {
    if (sliderInView) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonialsData.length)
      }, 5000) // Change testimonial every 5 seconds
      return () => clearInterval(interval)
    }
  }, [sliderInView, testimonialsData.length])

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}>
          <h2 className={styles.title}>
            Lo que dicen
            <span className={styles.titleHighlight}> nuestros clientes</span>
          </h2>
          <p className={styles.subtitle}>La satisfacción de nuestros clientes es nuestra mejor carta de presentación</p>
        </div>

        <div ref={sliderRef} className={styles.sliderContainer}>
          <div className={styles.sliderBackgroundBlur}></div>
          <div
            className={`${styles.sliderContent} ${sliderInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className={styles.testimonialWrapper}>
              <div className={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`${styles.starIcon} ${
                      i < testimonialsData[activeIndex].rating ? styles.starFilled : styles.starEmpty
                    }`}
                  />
                ))}
              </div>

              <div className={styles.testimonialTextContainer}>
                {testimonialsData.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`${styles.testimonialItem} ${index === activeIndex ? styles.testimonialItemActive : ""}`}
                  >
                    <p className={styles.comment}>"{testimonial.comment}"</p>
                    <div className={styles.authorInfo}>
                      <p className={styles.authorName}>{testimonial.name}</p>
                      <p className={styles.authorVehicle}>{testimonial.vehicle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.dotsContainer}>
                {testimonialsData.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Ver testimonio ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
