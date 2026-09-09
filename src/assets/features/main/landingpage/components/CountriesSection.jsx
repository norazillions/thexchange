const CountriesSection = () => {
  // Array of countries
  const countries = [
    'Nigeria',
    'Morroco',
    'Tanga',
    'France',
    'Samoa',
    'Agentina',
    'Bangladash',
    'Canada',
    'Austria',
    'Nepa',
    'Kenya',
    'USA',
    'Nepal',
    'Greece',
    'Ghana',
    'UAE',
    'Samoa',
    'Ethiopia',
    'France',
    'Sri Lanka',
    'United Kingdom'
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-[#505050]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Countries we send to
          </h2>
          <div className="w-16 h-1 bg-[#E91908] mx-auto mt-3 rounded-full" />
        </div>

        {/* Countries Grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {countries.map((country, index) => (
            <div 
              key={index}
              className="flex items-center gap-2  px-4 py-2 "
            >
              {/* Red Dot */}
              <span className="w-2 h-2 bg-[#E91908] rounded-full inline-block" />
              
              {/* Country Name */}
              <span className="text-white text-sm sm:text-base font-medium">
                {country}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;