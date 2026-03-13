import { TravelProvider } from "@/context/TravelContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import DestinationsGrid from "@/components/DestinationsGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <TravelProvider>
      <Navbar />
      <HeroSection />

      <div
        className="h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(0,109,119,0.25), transparent)" }}
      />

      <HowItWorks />

      <div
        className="h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(0,109,119,0.15), transparent)" }}
      />

      <DestinationsGrid />

      <div
        className="h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(226,149,120,0.2), transparent)" }}
      />

      <Testimonials />

      <CTASection />

      <Footer />
    </TravelProvider>
  );
}
