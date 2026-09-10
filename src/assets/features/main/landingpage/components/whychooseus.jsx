import FeatureCard from './featurecard';
import illu1 from '/src/assets/images/illu1.png';
import illu2 from '/src/assets/images/illu2.png';
import illu3 from '/src/assets/images/illu3.png';
const WhyChooseUs = () => {
  // Data array for features with image paths
  const features = [
    {
      id: 1,
      image: illu1,  // Placeholder path
      title: 'Extremely Fast',
      description: 'Transactions processed in minutes, not days. Send money to loved ones instantly.'
    },
    {
      id: 2,
      image: illu2 ,  // Placeholder path
      title: 'Unbeatable Rates',
      description: 'Competitive exchange rates with no hidden fees. Get the best value for your money.'
    },
    {
      id: 3,
      image: illu3,  // Placeholder path
      title: 'Secure & Regulated',
      description: 'Fully licensed and regulated. Your money and data are protected with bank-grade security.'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#251412]">
            Why Choose TheXchange
          </h2>
          <div className="w-16 h-1 bg-[#E91908] mx-auto mt-3 rounded-full" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;