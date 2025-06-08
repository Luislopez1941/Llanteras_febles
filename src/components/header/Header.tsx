"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Menu, X } from "lucide-react"
import styles from './Header.module.css';
import Image from 'next/image'
import logo from '../../assets/logo.png'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <nav className={`${styles.navbar} ${isVisible ? styles.navbarVisible : ""}`}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Logo" width={150} height={50} />
        </div>

        <div className={styles.navLinks}>
          <Link href="#servicios" className={styles.navLink}>
            Servicios
          </Link>
          <Link href="#marcas" className={styles.navLink}>
            Marcas
          </Link>
          <Link href="#galeria" className={styles.navLink}>
            Galería
          </Link>
          <Link href="#promociones" className={styles.navLink}>
            Promociones
          </Link>
          <Link href="#contacto" className={styles.navLink}>
            Contacto
          </Link>
        </div>

        <div className={styles.actionsContainer}>
          <Link href="tel:+1234567890" className={styles.phoneLink}>
            <Phone width={16} height={16} />
            <span>Llamar</span>
          </Link>
          <Link href="#contacto" className={styles.ctaButton}>
            Cotizar
          </Link>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileMenuNav}>
            <Link href="#servicios" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Servicios
            </Link>
            <Link href="#marcas" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Marcas
            </Link>
            <Link href="#galeria" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Galería
            </Link>
            <Link href="#promociones" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Promociones
            </Link>
            <Link href="#contacto" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </nav>
  )
}
