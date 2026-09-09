import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const SubscribeSection = () => {
  // Initialize React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm();

  // Form submission handler
  const onSubmit = (data) => {
    console.log('Form data:', data);
    
    // Show success toast notification
    toast.success(`Thanks for subscribing, ${data.email}! You'll receive our rate alerts.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Reset the form
    reset();
  };

  // Handle form errors
  const onError = (errors) => {
    toast.error('Please fix the errors before submitting.', {
      position: "top-right",
      autoClose: 5000,
    });
  };

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#251412]">
          Subscribe to our rates alert
        </h2>
        
        {/* Subtext */}
        <p className="text-[#505050] text-sm sm:text-base mt-3 max-w-2xl mx-auto">
          Get notified whenever exchange rates change. Never miss an opportunity to send money at the best rate.
        </p>
        
        {/* Divider */}
        <div className="w-16 h-1 bg-[#E91908] mx-auto mt-4 rounded-full" />

        {/* Subscribe Form */}
        <form 
          onSubmit={handleSubmit(onSubmit, onError)}
          className="mt-8 sm:mt-10"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto">
            {/* Email Input */}
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`w-full px-4 sm:px-5 py-3 rounded-lg border ${
                  errors.email ? 'border-[#E91908]' : 'border-[#F0F0F0]'
                } focus:outline-none focus:ring-2 focus:ring-[#E91908]/50 focus:border-transparent text-sm sm:text-base bg-white text-[#251412] placeholder-[#505050]/50 transition-all`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {/* Error Message */}
              {errors.email && (
                <p className="text-[#E91908] text-xs mt-1 text-left">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Subscribe Button */}
            <button
              type="submit"
              className="bg-[#E91908] text-white font-semibold px-6 sm:px-8 py-3 rounded-lg hover:bg-[#cc1707] transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SubscribeSection;