import Footer from "@/components/Footer";
import SimpleFeaturesSection from "@/components/Home/features-section";
import HeroSection from "@/components/Home/hero-section";
import InterfacesSection from "@/components/Home/interface";
import PricingSection from "@/components/Home/pricing";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SimpleFeaturesSection />
        {/* <InterfacesSection /> */}
        <PricingSection />
        {/* <CtaSection /> */}
      </main>
      <Footer/>
      {/* <ScrollToTop /> */}
    </div>
  );
}
