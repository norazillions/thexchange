import { Check } from 'lucide-react';

const StepProgress = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-4 sm:px-6 mb-6 sm:mb-8">
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`
                  flex items-center justify-center
                  w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]
                  rounded-[3px] sm:rounded-[4px]
                  text-[8px] sm:text-[9px] md:text-[10px]
                  font-semibold
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-[#E91908] text-white' 
                    : isCompleted 
                      ? 'bg-[#F0F0F0] text-[#E91908]' 
                      : 'bg-[#F0F0F0] text-[#8A8A8A]'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 stroke-[3]" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`
                  text-[8px] sm:text-[9px] md:text-[10px]
                  font-medium
                  whitespace-nowrap
                  transition-colors duration-300
                  ${isActive 
                    ? 'text-[#251412]' 
                    : isCompleted 
                      ? 'text-[#251412]/70' 
                      : 'text-[#8A8A8A]'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-2 sm:mt-3">
        <div className="w-full h-px bg-[#E5E5E5]" />
      </div>
    </div>
  );
};

export default StepProgress;