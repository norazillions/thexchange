const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#251412]">THEXCHANGE</h1>
          {subtitle && (
            <p className="text-[#505050] text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#251412]">{title}</h2>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;