"use client"

import type React from "react"
import { useState } from "react"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Check } from "lucide-react"
import styles from "./Contact-form.module.css" // Import CSS Module

export default function ContactForm() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: formRef, inView: formInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    tireSize: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Example: Check if required fields are filled (basic validation)
    if (!formState.name || !formState.phone || !formState.email) {
      // alert("Por favor, completa los campos obligatorios: Nombre, Teléfono y Email.");
      setSubmitStatus("error") // You might want to handle this more gracefully
      setIsSubmitting(false)
      return
    }

    // Assuming submission is successful
    setSubmitStatus("success")
    setIsSubmitting(false)
    setFormState({ name: "", phone: "", email: "", vehicle: "", tireSize: "", message: "" }) // Reset form

    // Optionally hide success message after a few seconds
    setTimeout(() => {
      setSubmitStatus(null)
    }, 5000)
  }

  return (
    <section id="contacto" className={styles.contactSection}>
      <div className={styles.container}>
        <div ref={headerRef} className={`${styles.header} ${headerInView ? "animate-fade-in-up" : ""}`}>
          <h2 className={styles.title}>
            Solicita tu
            <span className={styles.titleHighlight}> cotización</span>
          </h2>
          <p className={styles.subtitle}>Completa el formulario y te contactaremos en menos de 30 minutos</p>
        </div>

        <div ref={formRef} className={`${styles.formContainer} ${formInView ? styles.formContainerVisible : ""}`}>
          <div className={styles.formBackgroundBlur}></div>
          <div className={styles.formContent}>
            {submitStatus === "success" ? (
              <div className={styles.successMessageContainer}>
                <div className={styles.successIconWrapper}>
                  <Check />
                </div>
                <h3 className={styles.successTitle}>¡Mensaje Enviado!</h3>
                <p className={styles.successText}>
                  Gracias por contactarnos. Un asesor se comunicará contigo en breve.
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.grid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className={styles.grid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="vehicle" className={styles.label}>
                      Vehículo (Opcional)
                    </label>
                    <input
                      type="text"
                      id="vehicle"
                      name="vehicle"
                      value={formState.vehicle}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Marca, modelo, año"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="tireSize" className={styles.label}>
                      Medida de Llanta (Opcional)
                    </label>
                    <input
                      type="text"
                      id="tireSize"
                      name="tireSize"
                      value={formState.tireSize}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Ej: 205/55R16"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Mensaje (Opcional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Cuéntanos qué necesitas..."
                  ></textarea>
                </div>

                {submitStatus === "error" && (
                  <p style={{ color: "#f87171", textAlign: "center" }}>
                    Error al enviar el formulario. Por favor, intenta de nuevo.
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                  {isSubmitting ? (
                    <>
                      <span>Enviando...</span>
                      <div className={styles.spinner}></div>
                    </>
                  ) : (
                    <>
                      <span>Enviar Cotización</span>
                      <ArrowRight width={16} height={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
