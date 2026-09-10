import NewsCard from './NewsCard';
import FAQ from './FAQ';
import coin1 from '/src/assets/images/coin1.png';
import coin2 from '/src/assets/images/coin2.png';

const NewsFaqSection = () => {
  // News data array
  const newsItems = [
    {
      id: 1,
      image: coin1,
      title: 'TheXchange Expands to 20 New Countries',
      description: 'We\'re thrilled to announce our expansion into 20 new countries across Afri...'
    },
    {
      id: 2,
      image: coin2,
      title: 'Introducing Lower Transfer Fees',
      description: 'We\'ve reduced our transfer fees by up to 30%! Send money to your love...'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#251412]">
            News & FAQ
          </h2>
          <div className="w-16 h-1 bg-[#E91908] mx-auto mt-3 rounded-full" />
        </div>

        {/* Two Column Layout - News on left, FAQ on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: News Section - Flex row for cards side by side */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#251412] mb-4">
              Latest News
            </h3>
            <div className="grid grid-cols-2 sm:flex-row gap-4 sm:gap-6">
              {newsItems.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>

          {/* Right: FAQ Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#251412] mb-4">
              Frequently Asked Questions
            </h3>
            <FAQ />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsFaqSection;