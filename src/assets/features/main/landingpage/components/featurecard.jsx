const FeatureCard = ({ feature }) => {
  return (
    <div className="text-center p-4">
      {/* Illustration Image */}
      <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
        <img 
          src={feature.image} 
          alt={feature.title}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Title */}
      <h3 className="text-[#251412] font-semibold text-base sm:text-lg mb-2">
        {feature.title}
      </h3>
      
      {/* Description */}
      <p className="text-[#505050] text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;