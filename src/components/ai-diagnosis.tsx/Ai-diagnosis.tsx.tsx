"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { ScanLine, Cpu, Zap, ShieldCheck, Leaf, ArrowRight } from "lucide-react"
import Link from "next/link"
import styles from "./Ai-diagnosis.module.css"

// Placeholder para la imagen de la llanta
const TIRE_IMAGE_URL = "/placeholder.svg?height=500&width=500"

export default function AiDiagnosis() {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // La sección debe ser 20% visible
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  // Datos simulados del análisis
  const analysisData = [
    { label: "Integridad Estructural", value: 0, target: 92, unit: "%" },
    { label: "Desgaste Predictivo", value: 0, target: 75, unit: "%" }, // 75% vida útil restante
    { label: "Eficiencia Energética", value: 0, target: 88, unit: "%" },
    { label: "Presión Óptima", value: 0, target: 99, unit: "%" },
  ]

  const [displayData, setDisplayData] = useState(analysisData.map((d) => ({ ...d })))

  useEffect(() => {
    let animationFrameId: number
    if (isAnalyzing && !analysisComplete) {
      const startTime = Date.now()
      const duration = 2500 // Duración de la animación de los números

      const animateNumbers = () => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min(elapsedTime / duration, 1)

        setDisplayData(
          analysisData.map((item) => ({
            ...item,
            value: Math.round(item.target * progress),
          })),
        )

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateNumbers)
        } else {
          setAnalysisComplete(true)
          // Asegurar valores finales
          setDisplayData(analysisData.map((item) => ({ ...item, value: item.target })))
        }
      }
      animationFrameId = requestAnimationFrame(animateNumbers)
    }
    return () => cancelAnimationFrame(animationFrameId)
  }, [isAnalyzing, analysisComplete]) // analysisData no necesita estar aquí si sus targets no cambian

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisComplete(false) // Resetear si se vuelve a clickear
    // Resetear valores iniciales para la animación
    setDisplayData(analysisData.map((d) => ({ ...d, value: 0 })))
  }

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Seguridad Proactiva",
      text: "Detecta anomalías antes de que se conviertan en problemas críticos.",
    },
    {
      icon: Zap,
      title: "Rendimiento Optimizado",
      text: "Recomendaciones para maximizar la eficiencia y el agarre en carretera.",
    },
    {
      icon: Leaf,
      title: "Eco-Eficiencia",
      text: "Consejos para reducir el consumo de combustible y la huella de carbono.",
    },
  ]

  return (
    <section
      id="diagnostico-ia"
      ref={sectionRef}
      className={`${styles.aiDiagnosisSection} ${sectionInView ? styles.visible : ""}`}
    >
      <div className={styles.container}>
        <div className={`${styles.header} ${sectionInView ? "animate-fade-in-up" : ""}`}>
          <Cpu className={styles.headerIcon} />
          <h2 className={styles.title}>
            Análisis Predictivo <span className={styles.titleHighlight}>IA</span>
          </h2>
          <p className={styles.subtitle}>
            Nuestra tecnología de vanguardia redefine el cuidado de tus llantas para una seguridad y rendimiento sin
            precedentes.
          </p>
        </div>

        <div className={styles.mainContent}>
          <div className={`${styles.tireVisualWrapper} ${isAnalyzing ? styles.isAnalyzing : ""}`}>
            <img
              src={TIRE_IMAGE_URL || "/placeholder.svg"}
              alt="Llanta siendo analizada por IA"
              className={styles.tireImage}
            />
            {isAnalyzing && <div className={styles.scanLine}></div>}
            <div className={styles.hudElements}>
              {displayData.map((item, index) => (
                <div
                  key={item.label}
                  className={`${styles.hudItem} ${isAnalyzing ? styles.hudItemActive : ""}`}
                  style={{ animationDelay: `${index * 200 + 500}ms` }} // Delay para aparición escalonada
                >
                  <span className={styles.hudLabel}>{item.label}</span>
                  <div className={styles.hudValueWrapper}>
                    <span className={styles.hudValue}>
                      {item.value}
                      {item.unit}
                    </span>
                    <div className={styles.hudBarBackground}>
                      <div className={styles.hudBarFill} style={{ width: `${isAnalyzing ? item.value : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!isAnalyzing && sectionInView && (
              <button onClick={startAnalysis} className={`${styles.ctaButton} ${styles.analyzeButton}`}>
                <ScanLine width={20} height={20} />
                Iniciar Diagnóstico IA
              </button>
            )}
            {analysisComplete && (
              <Link href="#contacto" className={`${styles.ctaButton} ${styles.scheduleButton} animate-fade-in`}>
                Agendar Revisión Experta
                <ArrowRight width={18} height={18} />
              </Link>
            )}
          </div>

          <div className={styles.benefitsSection}>
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`${styles.benefitCard} ${sectionInView ? "animate-fade-in-up" : ""}`}
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <div className={styles.benefitIconWrapper}>
                  <benefit.icon className={styles.benefitIcon} />
                </div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitText}>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
