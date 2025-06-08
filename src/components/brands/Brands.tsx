"use client"
import { useInView } from "react-intersection-observer"
import styles from "./Brands.module.css"

// --- Datos de las Marcas ---
const brandsData = [
  "Michelin",
  "Bridgestone",
  "Pirelli",
  "Continental",
  "Goodyear",
  "Dunlop",
  "Firestone",
  "Hankook",
  "Yokohama", // Añadida una más para probar el grid
  "Toyo Tires",
  "Kumho",
  "Falken",
]

// --- Componente de Tarjeta de Marca Individual ---
function BrandCard({ brandName, index }: { brandName: string; index: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05, // Umbral bajo para que se active pronto al scrollear
  })

  return (
    <div
      ref={ref}
      className={`${styles.brandCardWrapper} ${inView ? "animate-fade-in-up" : ""}`}
      style={{ animationDelay: `${index * 75}ms` }} // Delay más corto para una aparición rápida
    >
      <div className={styles.brandCard}>
        {/* Si tuvieras logos, irían aquí. Por ahora, estilizamos el texto. */}
        <span className={styles.brandName}>{brandName}</span>
      </div>
    </div>
  )
}

// --- Componente Principal de la Sección ---
export default function Brands() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="marcas" className={styles.brandsSection}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}>
          <h2 className={styles.title}>
            Confianza <span className={styles.titleHighlight}>Garantizada</span>
          </h2>
          <p className={styles.subtitle}>
            Solo trabajamos con las marcas líderes que aseguran rendimiento, seguridad y durabilidad.
          </p>
        </div>

        <div className={styles.grid}>
          {brandsData.map((brand, index) => (
            <BrandCard key={brand} brandName={brand} index={index} />
          ))}
        </div>

        <div
          className={`${styles.footerText} ${headerInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "300ms" }} // Delay para que aparezca después de las tarjetas
        >
          <p>Y muchas más opciones disponibles para cada tipo de vehículo y necesidad.</p>
        </div>
      </div>
    </section>
  )
}
