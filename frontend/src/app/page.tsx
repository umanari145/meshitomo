import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import EventPreview from "@/components/EventPreview";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <EventPreview />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
