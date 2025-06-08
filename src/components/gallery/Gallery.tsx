"use client"

import { useState } from "react"
import { useInView } from "react-intersection-observer"
import { X } from "lucide-react"
import styles from "./Gallery.module.css" // Import CSS Module

export default function Gallery() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const imagesData = [
    {
      url: "/placeholder.svg?height=400&width=600",
      alt: "Instalación profesional de llantas",
    },
    {
      url: "/placeholder.svg?height=400&width=600",
      alt: "Alineación computarizada",
    },
    {
      url: "/placeholder.svg?height=400&width=600",
      alt: "Exhibición de llantas premium",
    },
    {
      url: "/placeholder.svg?height=400&width=600",
      alt: "Balanceo de llantas",
    },
    {
      url: "/placeholder.svg?height=400&width=600",
      alt: "Atención al cliente",
    },
    {
      url: "/placeholder.svg?height=400&width=600",
      alt: "Servicio a domicilio",
    },
  ]

  // ✅ Creamos un hook useInView por cada imagen
  const imageViews = imagesData.map(() =>
    useInView({
      triggerOnce: true,
      threshold: 0.1,
    })
  )

  return (
    <section id="galeria" className={styles.gallerySection}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}>
          <h2 className={styles.title}>
            Nuestra <span className={styles.titleHighlight}>galería</span>
          </h2>
          <p className={styles.subtitle}>
            Conoce nuestras instalaciones y servicios de primera calidad
          </p>
        </div>

        <div className={styles.grid}>
          {imagesData.map((image, index) => {
            const { ref, inView } = imageViews[index]

            return (
              <div
                key={index}
                ref={ref}
                className={`${styles.imageCard} ${inView ? styles.imageCardVisible : ""}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedImage(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedImage(index)}
              >
                <div className={styles.imageOverlay}>
                  <p className={styles.imageAltText}>{image.alt}</p>
                </div>
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className={styles.image}
                  loading="lazy"
                />
              </div>
            )
          })}
        </div>
      </div>

      {selectedImage !== null && (
        <div
          className={styles.modal}
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
            aria-label="Cerrar imagen ampliada"
          >
            <X width={24} height={24} />
          </button>
          <img
            src={imagesData[selectedImage].url || "/placeholder.svg"}
            alt={imagesData[selectedImage].alt}
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
