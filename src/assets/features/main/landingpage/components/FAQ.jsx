import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  // State to track which FAQ is open
  const [openIndex, setOpenIndex] = useState(null);

  // FAQ data array
  const faqs = [
    {
      id: 1,
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Simply click the "Register" button at the top right of the page, fill in your details, and follow the verification process. You\'ll be ready to send money in minutes.'
    },
    {
      id: 2,
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Login" button and then select "Forgot Password". We\'ll send a password reset link to your registered email address. Follow the link to create a new password.'
    },
    {
      id: 3,
      question: 'How do I change my personal details?',
      answer: 'Once logged in, go to your account settings. From there, you can update your personal information including your name, email address, phone number, and payment preferences.'
    },
    {
      id: 4,
      question: 'How do I contact support?',
      answer: 'You can reach our support team through multiple channels: email us at support@thexchange.com, use the live chat feature on our website, or call our 24/7 customer service hotline.'
    }
  ];

  // Toggle function
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div 
          key={faq.id}
          className="border border-[#F0F0F0] rounded-lg overflow-hidden"
        >
          {/* Question (clickable) */}
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-[#F0F0F0]/50 transition-colors text-left"
          >
            <span className="text-[#251412] font-medium text-sm sm:text-base">
              {faq.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-[#E91908] flex-none ml-4" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#E91908] flex-none ml-4" />
            )}
          </button>
          
          {/* Answer (conditionally rendered) */}
          {openIndex === index && (
            <div className="p-4 sm:p-5 bg-[#F0F0F0]/30 border-t border-[#F0F0F0]">
              <p className="text-[#505050] text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;