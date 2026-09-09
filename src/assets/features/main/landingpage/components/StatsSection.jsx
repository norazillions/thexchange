const StatsSection = () => {
  // Array of statistics
  const stats = [
    {
      id: 1,
      number: '40+',
      label: 'Countries',
      description: 'Reach loved ones across the globe'
    },
    {
      id: 2,
      number: '10K+',
      label: 'Customers',
      description: 'Trusted by thousands worldwide'
    },
    {
      id: 3,
      number: '100K+',
      label: 'Completed transactions',
      description: 'Millions processed securely'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Illustration */}
          <div className="flex justify-center lg:justify-start order-1">
            <div className="w-full max-w-md aspect-square  rounded-2xl flex items-center justify-center ">
              <div className="text-center">
                <img 
                src="/src/assets/images/illu4.png"
                alt="Money transfer illustration"
                className="w-full h-full object-cover"
              />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className=" order-2">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#251412] leading-tight">
              Distance shouldn't
              <br />
              stand between you and
              <br />
              <span className="text-[#E91908]">your money</span>
            </h2>

            {/* Statistics Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-6 sm:gap-8 mt-8">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center sm:text-left">
                  {/* Number - Red */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E91908]">
                    {stat.number}
                  </div>
                  
                  {/* Label - Dark Brown */}
                  <div className="text-[#251412] font-semibold text-base sm:text-lg mt-1">
                    {stat.label}
                  </div>
                  
                  {/* Description - Gray */}
                  <p className="text-[#505050] text-sm mt-1">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 mt-8 lg:hidden ">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center sm:text-left">
                  {/* Number - Red */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E91908]">
                    {stat.number}
                  </div>
                  
                  {/* Label - Dark Brown */}
                  <div className="text-[#251412] font-semibold text-base sm:text-lg mt-1">
                    {stat.label}
                  </div>
                  
                  {/* Description - Gray */}
                  <p className="text-[#505050] text-sm mt-1">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
      </div>
    </section>
  );
};

export default StatsSection;