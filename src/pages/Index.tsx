import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <Features />
      </main>
    </div>
  );
};

export default Index;
