const ExchangeRateCard = () => {
  return (
    <div className="bg-[#E91908]/15 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10 max-w-md w-full">
      {/* Exchange Rate Display */}
      <div className="flex justify-between items-center text-sm mb-4">
        <div>
        <span className="text-white font-bold">Rate</span>
        <div className="mt-3 px-2  justify-center items-center  text-white font-semibold py-0.5 rounded-lg transition-colors">
          Best rate guarantee
        </div>
        </div>
        <div className="mt-3 py-1">
          <span className="text-white font-semibold ">1 UK = NGN 1700</span>
        </div>
        
      </div>

      {/* You Send Field */}
      <div className="bg-white/5 rounded-lg p-3 mb-3">
        <label className="text-white/60 text-xs block mb-1">You send</label>
        <div className="flex items-center justify-between">
          <input 
            type="text" 
            value="500" 
            className="bg-transparent text-white text-lg font-semibold w-20 outline-none"
            readOnly
          />
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">UK</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="text-white/40 text-xs mt-1">Payment method: Bank transfer</div>
      </div>

      {/* Exchange Arrow */}
      <div className="flex justify-center my-2">
        <svg className="w-6 h-6 text-[#E91908]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Recipient Gets Field */}
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <label className="text-white/60 text-xs block mb-1">Recipient gets</label>
        <div className="flex items-center justify-between">
          <input 
            type="text" 
            value="850,000" 
            className="bg-transparent text-white text-lg font-semibold w-20 outline-none"
            readOnly
          />
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">NGN</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <button className="w-full bg-[#E91908] text-white font-semibold py-3 rounded-lg hover:bg-[#cc1707] transition-colors">
        Send
      </button>
    </div>
  );
};

export default ExchangeRateCard;