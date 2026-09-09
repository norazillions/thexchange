const CTASection = ({ 
  title, 
  highlightedText, 
  description, 
  buttonText,
  buttonLink = "/register",
  bgImage = "https://images.unsplash.com/photo-1589519160732-57fc498292f6?w=800"
}) => {
  return (
    <section className="w-full py-16 sm:py-20 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${bgImage}')` 
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-[#251412]/80" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
          {title}
          {highlightedText && (
            <>
              <br />
              <span className="text-[#E91908]">{highlightedText}</span>
            </>
          )}
        </h2>
        
        {/* Description */}
        {description && (
          <p className="text-white/80 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        {/* Button */}
        <div className="mt-6 sm:mt-8">
          <a 
            href={buttonLink}
            className="inline-block bg-[#E91908] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#cc1707] transition-colors text-sm sm:text-base"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;