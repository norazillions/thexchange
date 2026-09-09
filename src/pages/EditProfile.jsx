import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ArrowLeft, User, Phone, MapPin, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            country: data.country || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!user) {
      toast.error('Please sign in again');
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E91908] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
    >
      {/* Edit Profile Card */}
      <div className="w-full bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-8 lg:p-10">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-lg font-semibold text-[#111111]">Edit Profile</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Last Name - 2 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                    errors.firstName ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                  } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908]`}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-[#E91908] mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                    errors.lastName ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                  } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908]`}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-[#E91908] mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                  errors.phone ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908]`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-[#E91908] mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1">
              Country
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                  errors.country ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] appearance-none`}
              >
                <option value="">Select your country</option>
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
              <p className="text-xs text-[#E91908] mt-1">{errors.country}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E5E5]">
            <button
              type="button"
              onClick={handleBack}
              className="order-2 sm:order-1 px-6 py-2.5 border border-[#E5E5E5] text-[#666666] text-sm font-medium rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="order-1 sm:order-2 flex-1 bg-[#E91908] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfile;