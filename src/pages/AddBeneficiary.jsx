import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { collection, doc, setDoc,updateDoc, increment,serverTimestamp} from 'firebase/firestore';
import { motion } from 'motion/react';
import {  ArrowLeft,  User,  Building2,  CreditCard, Globe, Save, Loader2} from 'lucide-react';
import { toast } from 'react-toastify';

const AddBeneficiary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    bank: '',
    country: 'Nigeria',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Beneficiary name is required';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    if (!formData.bank.trim()) {
      newErrors.bank = 'Bank name is required';
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
    toast.error('Please sign in to add a beneficiary');
    return;
  }

  setLoading(true);
  try {
    const beneficiaryId = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const docRef = doc(db, 'users', user.uid, 'beneficiaries', beneficiaryId);
    
    const beneficiaryData = {
      name: formData.name.trim(),
      accountNumber: formData.accountNumber.trim(),
      bank: formData.bank.trim(),
      country: formData.country.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, beneficiaryData);
    console.log('Beneficiary added with ID:', docRef.id);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      beneficiaryCount: increment(1)
    });

    toast.success('Beneficiary added successfully!');
    navigate('/beneficiary');

  } catch (error) {
    console.error('Error adding beneficiary:', error);
    toast.error(`Failed to add beneficiary: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 lg:pb-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/beneficiary')}
          className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Add Beneficiary</h1>
          <p className="text-xs text-[#666666]">Enter the recipient's details</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-[#E5E5E5] rounded-lg p-4 sm:p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1 uppercase tracking-wider">
              Beneficiary Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                  errors.name ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[#E91908] mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1 uppercase tracking-wider">
              Account Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                  errors.accountNumber ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]`}
              />
            </div>
            {errors.accountNumber && (
              <p className="text-xs text-[#E91908] mt-1">{errors.accountNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1 uppercase tracking-wider">
              Bank Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="text"
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                placeholder="Enter bank name"
                className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                  errors.bank ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]`}
              />
            </div>
            {errors.bank && (
              <p className="text-xs text-[#E91908] mt-1">{errors.bank}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1 uppercase tracking-wider">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full h-10 pl-10 pr-3 text-sm bg-white border ${
                  errors.country ? 'border-[#E91908]' : 'border-[#E5E5E5]'
                } rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] appearance-none text-[#111111]`}
              >
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E91908] text-white font-medium py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Beneficiary
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddBeneficiary;