import HowItWorksCard from './HowItWorksCard';

const HowItWorks = () => {
  // Data array for steps
  const steps = [
    {
      id: 1,
      image: '/src/assets/images/icon1.png', 
      number: 1,
      title: 'Sign Up',
      description: 'Create your free account in minutes with just your email and basic details.'
    },
    {
      id: 2,
      image: '/src/assets/images/icon2.png', 
      number: 2,
      title: 'Get yourself verified',
      description: 'Complete our quick verification process to ensure secure transactions.'
    },
    {
      id: 3,
      image: '/src/assets/images/icon3.png', 
      number: 3,
      title: 'Add a beneficiary',
      description: 'Save your recipient\'s details for fast and easy future transfers.'
    },
    {
      id: 4,
      image: '/src/assets/images/icon4.png', 
      number: 4,
      title: 'Send money',
      description: 'Enter the amount, choose your currency, and send money instantly.'
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-[#251412]">
            How Does It Work?
          </h2>
          <div className="w-16 h-1 bg-[#E91908] mx-auto mt-3 rounded-full" />
        </div>

        {/* Steps Grid - 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {steps.map((step) => (
            <HowItWorksCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;