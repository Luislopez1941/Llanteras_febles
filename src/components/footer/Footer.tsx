import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import styles from "./Footer.module.css"
import Image from 'next/image'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.companyInfo}>
            <div className={styles.logoContainer}>
              <Image src={logo} alt="Logo" width={150} height={50} />
            </div>
            <p className={styles.companyDescription}>
              Líderes en venta e instalación de llantas premium. Más de 15 años brindando calidad y confianza a nuestros
              clientes.
            </p>
            <div className={styles.socialLinks}>
              <Link href="#" className={styles.socialLink} aria-label="Facebook">
                <span>f</span>
              </Link>
              <Link href="#" className={styles.socialLink} aria-label="Instagram">
                <span>ig</span>
              </Link>
              <Link href="#" className={styles.socialLink} aria-label="WhatsApp">
                <span>wa</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className={styles.footerColumnTitle}>Contacto</h3>
            <div className={styles.contactList}>
              <a href="tel:+525551234567" className={styles.contactItem}>
                <Phone />
                <span>+52 (555) 123-4567</span>
              </a>
              <a href="mailto:info@llanterasfebles.com" className={styles.contactItem}>
                <Mail />
                <span>info@llanterasfebles.com</span>
              </a>
              <div className={styles.contactItem}>
                <MapPin />
                <span className={styles.contactItemAddress}>
                  Av. Principal 123
                  <br />
                  Col. Centro, CDMX
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.footerColumnTitle}>Horarios</h3>
            <div className={styles.hoursList}>
              <div className={styles.hoursItem}>
                <span>Lun - Vie:</span>
                <span>8:00 - 19:00</span>
              </div>
              <div className={styles.hoursItem}>
                <span>Sábado:</span>
                <span>8:00 - 17:00</span>
              </div>
              <div className={styles.hoursItem}>
                <span>Domingo:</span>
                <span>9:00 - 15:00</span>
              </div>
              <div className={styles.emergencyHours}>
                <div className={styles.emergencyTitle}>Emergencias 24/7</div>
                <div className={styles.emergencyText}>Servicio disponible toda la semana</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} Llanteras Febles. Todos los derechos reservados.</p>
          </div>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>
              Privacidad
            </Link>
            <Link href="#" className={styles.legalLink}>
              Términos
            </Link>
            <Link href="#" className={styles.legalLink}>
              Garantías
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
