import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import { getFriendlyFirebaseError } from '../../helpers/firebase-errors';
import { useSendEmailVerification } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import StepProgress from '../../components/auth/StepProgress';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];

  const password = watch('password');
  const [sendEmailVerification, sending, error] = useSendEmailVerification(auth);

  const onSubmit = async (data) => {
    if (!agreeTerms) {
      toast.warning('Please agree to the Terms & Conditions.');
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await signUp(data.email, data.password);
      const user = userCredential.user;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
        phone: data.phone,
        createdAt: new Date().toISOString(),
        onboardingStep: 'verify-email',
        emailVerified: false,
        validId: null,
        profilePhoto: null,
        proofOfResidence: null,
        transactionPinSet: false,
        transactionPin: null,
        onboardingCompleted: false,
        transactionCount: 0,
        beneficiaryCount: 0,
        notificationCount: 0 ,
        rateChange: 1700,
        totalBalance: 965400,
        dailyLimit: 4000,
        yearlyLimit: 529500,
        accountNumber: `10${Math.floor(10000000 + Math.random() * 90000000)}`, // ✅ Auto-generated 10-dig
      });
      const actionCodeSettings = {
        url: 'http://localhost:5173/verify-email',
        handleCodeInApp: true,
      };
      
      const emailSent = await sendEmailVerification(actionCodeSettings);
      
      if (emailSent) {
        toast.success('Account created successfully! A verification email has been sent to your email address.');
        navigate('/verify-email');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] px-4 py-8">
      <div className="w-full max-w-5xl bg-white shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-[35%] bg-[#251412] flex-col items-center justify-center p-8 text-center min-h-[580px]">
          <div>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              The fastest way to
            </p>
            <p className="text-[#E91908] text-sm font-medium leading-relaxed">
              send money abroad
            </p>
          </div>
          <div className="text-white font-bold text-2xl mt-20">
            dXchange
          </div>         
        </div>
        <div className="w-full md:w-[65%] bg-white p-6 sm:p-8 md:p-10">
          <div className="flex justify-end mb-2">
            <span className="text-[#251412] font-bold text-sm">dXchange</span>
          </div>
          <StepProgress steps={steps} currentStep={1} />
          <div className="text-center mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#251412]">Sign up</h1>
            <p className="text-[#8A8A8A] text-xs sm:text-sm mt-1">
              Please fill in your personal information to get started
            </p>
            <p className="text-[#8A8A8A] text-xs sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E91908] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <input
                    type="text"
                    placeholder="John"
                    className={`w-full pl-8 pr-3 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors ${
                      errors.firstName ? 'ring-2 ring-[#E91908]' : ''
                    }`}
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`w-full pl-8 pr-3 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors ${
                      errors.lastName ? 'ring-2 ring-[#E91908]' : ''
                    }`}
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  Country of residence
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <select
                    className={`w-full pl-8 pr-3 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors appearance-none ${
                      errors.country ? 'ring-2 ring-[#E91908]' : ''
                    }`}
                    {...register('country', {
                      required: 'Country is required',
                    })}
                  >
                    <option value="">Select country</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
                {errors.country && (
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.country.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full pl-8 pr-3 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors ${
                      errors.email ? 'ring-2 ring-[#E91908]' : ''
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
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <input
                    type="tel"
                    placeholder="+1 234 567 890"
                    className={`w-full pl-8 pr-3 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors ${
                      errors.phone ? 'ring-2 ring-[#E91908]' : ''
                    }`}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                        message: 'Please enter a valid phone number',
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    className={`w-full pl-8 pr-8 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors ${
                      errors.password ? 'ring-2 ring-[#E91908]' : ''
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A] hover:text-[#251412]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[#251412] text-[10px] sm:text-xs font-medium mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={`w-full pl-8 pr-8 py-2 h-9 text-xs rounded-md bg-[#F0F0F0] border-0 focus:ring-2 focus:ring-[#E91908]/50 focus:bg-white transition-colors ${
                      errors.confirmPassword ? 'ring-2 ring-[#E91908]' : ''
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A] hover:text-[#251412]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[#E91908] text-[10px] mt-0.5">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 accent-[#E91908] cursor-pointer"
              />
              <label htmlFor="terms" className="text-[#8A8A8A] text-[10px] sm:text-xs leading-relaxed">
                I agree to the{' '}
                <span className="text-[#E91908] font-medium hover:underline cursor-pointer">
                  Terms & Conditions
                </span>
                {' '}and{' '}
                <span className="text-[#E91908] font-medium hover:underline cursor-pointer">
                  privacy policy
                </span>
              </label>
            </div>
            <div className="mt-4 md:mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto min-w-[120px] bg-[#E91908] text-white font-semibold py-2.5 px-8 rounded-md hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Creating...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;