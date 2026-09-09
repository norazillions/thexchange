const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg border border-[#F0F0F0] overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full h-48  flex items-center justify-center">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <h3 className="text-[#251412] font-semibold text-base sm:text-lg mb-2">
          {news.title}
        </h3>
        
        {/* Description */}
        <p className="text-[#505050] text-sm leading-relaxed">
          {news.description}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;