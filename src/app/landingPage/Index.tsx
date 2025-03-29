
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen p-8">
      <div
        className="top-0 left-0 z-[10] absolute w-full h-[200px] rotate-[180deg]"
        style={{
          maskImage: "linear-gradient(transparent, black 85%)",
          backgroundColor: "#aba5e2",
        }}
      />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;