import AppDownloadSection from "./components/AppDownloadSection";
import CountriesSection from "./components/CountriesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import HeroSection from "./components/herosection";
import HowItWorks from "./components/HowItWorks";
import MobileExchangeRateCard from "./components/MobileExchangeRateCard";
import Navbar from "./components/navbar";
import NewsFaqSection from "./components/NewsFaqSection";
import StatsSection from "./components/StatsSection";
import SubscribeSection from "./components/SubscribeSection";
import WhyChooseUs from "./components/whychooseus";

const Landing = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    {/* Mobile Exchange Rate Card - Only visible on mobile */}
    <div className="lg:hidden -mt-6 relative z-10 px-4 pt-18 border-none border-4">
      <MobileExchangeRateCard />
    </div>
    <WhyChooseUs />
    <CTASection 
        title="We are closer than you think"
        description="Connect with your loved ones instantly. Send money to over 20 countries with competitive rates and zero hidden fees."
        buttonText="Get Started"
        buttonLink="/register"
        bgImage="/src/assets/images/connect.png"
      />
      <HowItWorks />
      <CountriesSection />
      <StatsSection />
      <CTASection 
        title="We're the fastest way to"
        highlightedText="send money abroad"
        description="Join thousands of satisfied customers who trust us for fast, secure, and affordable international transfers."
        buttonText="Create Account"
        buttonLink="/register"
        bgImage="https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800"
      />
      <NewsFaqSection />
      <AppDownloadSection />
      <SubscribeSection />
      <Footer />
    </>
  );
};

export default Landing