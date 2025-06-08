
import ParticlesBackground from "@/components/ParticlesBackground";
import Hero from "@/components/header/Header";
import Layout from "@/components/header/Layout";
import Services from "@/components/services/Services";
import Brands from "@/components/brands/Brands";
import Gallery from "@/components/gallery/Gallery";
import Stats from "@/components/stats/Stats";
import Promotions from "@/components/promotions/Promotions";
import Testimonials from "@/components/testimonial/Testimonials";
import Faq from "@/components/faq/Faq";
import ContactForm from "@/components/contact/Contact-form";
import Footer from "@/components/footer/Footer";
import AiDiagnosis from "@/components/Diagnosis.tsx/Ai-diagnosis";

export default function Home() {
  return (
    <div style={{ position: "relative" }}>
      <ParticlesBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <Layout />
        <Stats />
        <Services />
        <AiDiagnosis />
        <Brands />
        <Gallery />
        <Promotions />
        <Testimonials />
        <Faq />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}
