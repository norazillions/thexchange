import { Star } from 'lucide-react';
import phoneillu from '/src/assets/images/phoneillu.png';
const AppDownloadSection = () => {
  return (
    <section className="w-full py-16 sm:py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 w-full h-full " style={{
    background: 'linear-gradient(to bottom right, #E91908, #E91908CC, #251412)'
  }}/>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 w-full h-full opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }} />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="order-1 ">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Get the app
            </h2>
            
            {/* Description */}
            <p className="text-white/80 text-sm sm:text-base mt-4 max-w-md">
              Send money, pay bills, and manage your finances on the go. Available on iOS and Android.
            </p>
            
            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
              {/* App Store Button */}
              <button className="bg-black backdrop-blur-sm border border-white/20 rounded-lg px-4 sm:px-6 py-2.5 flex items-center gap-3 hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white/80 text-[10px] leading-none">Download on the</div>
                  <div className="text-white text-sm sm:text-base font-semibold leading-tight">App Store</div>
                </div>
              </button>
              
              {/* Google Play Button */}
              <button className="bg-black backdrop-blur-sm border border-white/20 rounded-lg px-4 sm:px-6 py-2.5 flex items-center gap-3 hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186c-.385-.385-.609-.91-.609-1.486V3.3c0-.576.224-1.101.609-1.486zM14.75 12.75L4.852 21.556 16.5 15.75l-1.75-3zM4.852 2.444L14.75 11.25l1.75-3L16.5 8.25z"/>
                  <path d="M19.5 8.25l-3 1.75v4l3 1.75c.5-.25.75-.75.75-1.25v-5c0-.5-.25-1-.75-1.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white/80 text-[10px] leading-none">Get it on</div>
                  <div className="text-white text-sm sm:text-base font-semibold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/80 text-sm">4.8</span>
              <span className="text-white/60 text-sm">(2.5K+ reviews)</span>
            </div>
          </div>
          
          {/* Right: Phone Illustration */}
          <div className="order-2  flex justify-center lg:justify-end">
            <div className="w-full max-w-md aspect-square  rounded-2xl flex items-center justify-center ">
              <div className="text-center">
                <img 
                src={phoneillu}
                alt="Money transfer illustration"
                className="w-full h-full object-cover"
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;