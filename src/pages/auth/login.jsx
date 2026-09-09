import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, reloadUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const userCredential = await signIn(data.email, data.password);
      const user = userCredential.user;
      await reloadUser();
      if (!user.emailVerified) {
        toast.warning('Please verify your email before logging in. Check your inbox for the verification link.');
        await user.sendEmailVerification();
        toast.info('A new verification email has been sent to your address.');
        setIsLoading(false);
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      let onboardingComplete = false;
      let onboardingStep = 'valid-id';
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        onboardingComplete = userData.onboardingCompleted === true;
        onboardingStep = userData.onboardingStep || 'valid-id';
      }
      
      toast.success('Welcome back!');
      if (!onboardingComplete) {
        window.location.href = `/onboarding/${onboardingStep}`;
      } else {
        window.location.href = '/home';
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#251412]">THEXCHANGE</h1>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#544544]">Welcome Back</h2>
          <p className="text-center text-sm text-[#505050] mt-6">
          New to CosmoRemit?
          <Link to="/signup" className="text-[#E91908] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[#544544] text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-3 py-2.5 h-11 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91908] focus:border-[#E91908] transition-colors ${
                  errors.email ? 'border-[#E91908] ring-1 ring-[#E91908]' : ''
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[#E91908] text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[#544544] text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-2.5 h-11 text-sm bg-[#F5F5F5] border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#E91908] focus:border-[#E91908] transition-colors ${
                  errors.password ? 'border-[#E91908] ring-1 ring-[#E91908]' : ''
                }`}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A] hover:text-[#544544] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#E91908] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="text-right">
            <button
              type="button"
              className="text-[#E91908] text-sm font-medium hover:underline"
              onClick={() => toast.info('Password reset feature coming soon!')}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#E91908] text-white font-semibold rounded-md hover:bg-[#cc1707] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;