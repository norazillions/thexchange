const Navbar = () => {
  return (
    <nav className="w-full bg-[#251412]/90 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          {/* Logo */}
          <div className="text-white font-bold text-sm sm:text-xl">
            THEXCHANGE
          </div>

          {/* Auth Buttons - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <button className="text-white text-[10px] sm:text-sm hover:text-gray-300 transition-colors px-2 sm:px-0">
              Login
            </button>
            <button className="bg-[#E91908] text-white text-[10px] sm:text-sm px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-md hover:bg-[#cc1707] transition-colors">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;