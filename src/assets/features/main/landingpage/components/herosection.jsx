import ExchangeRateCard from "./exchangeratecard";
import wallet2 from '/src/assets/images/wallet2.png';

const HeroSection = () => {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/signup';
  };
  
  return (
    <section className="w-full lg:min-h-screen bg-[#251412] relative flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
        style={{ 
          backgroundImage: `url(${wallet2})` 
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-[#251412]/60" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Send Money</span>
              <br />
              <span className="text-[#E91908]">without Borders</span>
            </h1>
            
            <p className="text-white/80 text-sm sm:text-base mt-4 max-w-md">
              Fast, secure, and affordable international money transfers across the globe.
            </p>
            
            <div className="flex  lg:hidden gap-3 mt-4">
              <button 
                onClick={handleLogin}
                className="text-white/80 text-[10px] hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={handleRegister}
                className="bg-[#E91908] text-white text-[10px] px-4 py-1.5 rounded-md hover:bg-[#cc1707] transition-colors"
              >
                Register
              </button>
            </div>

          </div>

          {/* Right: Exchange Rate Card */}
          <div className=" hidden lg:flex flex-1 justify-center lg:justify-end w-full">
            <ExchangeRateCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;