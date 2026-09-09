import { UserPlus, ShieldCheck, UserPlus as Beneficiary, Send } from 'lucide-react';

const HowItWorksCard = ({ step }) => {
  return (
    <div className="bg-white rounded-lg border border-[#D99F9A] p-4 sm:p-5  hover:shadow-md transition-shadow">
      {/* Red Circle with Icon */}
      <div className="w-10 h-10  mb-3 flex items-center justify-center">
        <img 
          src={step.image} 
          alt={step.title}
          className="w-full h-full object-contain"
        />
      </div>
      

      
      {/* Title */}
      <h3 className="text-[#251412] font-semibold text-base sm:text-lg mt-1 mb-2">
        {step.title}
      </h3>
      
      {/* Description */}
      <p className="text-[#505050] text-sm leading-relaxed">
        {step.description}
      </p>
    </div>
  );
};

export default HowItWorksCard;