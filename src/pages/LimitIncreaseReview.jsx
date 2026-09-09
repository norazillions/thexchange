import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const LimitIncreaseReview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const matchResultRef = useRef(false);

  useEffect(() => {
    const verifyDocuments = async () => {
      if (!user) {
        navigate('/account-limits');
        return;
      }

      let isMatch = false;

      try {
        // Get uploaded proof of residence from this flow
        const uploadedProofStr = sessionStorage.getItem('limitProofResidence');
        const uploadedProof = uploadedProofStr ? JSON.parse(uploadedProofStr) : null;

        // Get requested limits from sessionStorage
        const requestedLimitsStr = sessionStorage.getItem('requestedLimits');
        const requestedLimits = requestedLimitsStr ? JSON.parse(requestedLimitsStr) : null;

        console.log('🔍 Uploaded proof:', uploadedProof);
        console.log('🔍 Requested limits:', requestedLimits);

        // Get existing proof of residence from onboarding
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          console.log('❌ User document not found');
          navigate('/account-limits');
          return;
        }

        const userData = userSnap.data();
        const onboardingProof = userData.proofOfResidence;

        console.log('🔍 Onboarding proof:', onboardingProof);

        // Check if the uploaded proof exists and matches the onboarding proof
        isMatch = uploadedProof && onboardingProof && 
          uploadedProof.uploaded === true &&
          onboardingProof.uploaded === true &&
          uploadedProof.fileName === onboardingProof.fileName;

        console.log('🔍 Is match:', isMatch);

        // Store match result in ref
        matchResultRef.current = isMatch;

        if (isMatch && requestedLimits) {
          console.log('✅ Updating limits to:', requestedLimits);
          
          // ✅ Update user document with new limits
          const updateData = {
            dailyLimit: requestedLimits.dailyLimit,
            yearlyLimit: requestedLimits.yearlyLimit
          };
          
          console.log('📝 Update data:', updateData);
          
          await updateDoc(userRef, updateData);
          
          console.log('✅ Limits updated successfully!');
          
          // ✅ Verify the update by reading back the document
          const updatedSnap = await getDoc(userRef);
          if (updatedSnap.exists()) {
            const updatedData = updatedSnap.data();
            console.log('✅ Verified - New dailyLimit:', updatedData.dailyLimit);
            console.log('✅ Verified - New yearlyLimit:', updatedData.yearlyLimit);
          }
          
          toast.success('Limits updated successfully!');
          
          // Clear session storage
          sessionStorage.removeItem('limitProofResidence');
          sessionStorage.removeItem('requestedLimits');
        } else {
          if (!isMatch) {
            console.log('❌ Document match failed');
          }
          if (!requestedLimits) {
            console.log('❌ No requested limits found in sessionStorage');
          }
        }

      } catch (error) {
        console.error('❌ Error verifying documents:', error);
        console.error('❌ Error details:', error.message);
        toast.error('Failed to verify documents: ' + error.message);
      } finally {
        setChecking(false);
        
        // Wait 5 seconds then navigate based on the stored match result
        setTimeout(() => {
          setIsComplete(true);
          if (matchResultRef.current) {
            navigate('/limit-increased-success');
          } else {
            navigate('/limit-increase-failed');
          }
        }, 5000);
      }
    };

    verifyDocuments();
  }, [user, navigate]);

  // 3-dot loading animation component
  const LoadingDots = () => {
    return (
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <div className="w-2 h-2 bg-[#E91908] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-[#E91908] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-[#E91908] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex items-center justify-center px-5"
    >
      <div className="w-full max-w-[320px] text-center">
        {/* Icon - Clock/Review icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#F2CF32]/20 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-[#F2CF32]" strokeWidth={1.8} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-sm font-semibold text-[#111111] text-center">
          Limit increase under review
        </h1>

        {/* Description */}
        <p className="text-xs text-[#666666] text-center leading-relaxed mt-2">
          Your request to upgrade account limits is currently being processed.
        </p>

        {/* 3-dot Loading Animation */}
        <LoadingDots />
      </div>
    </motion.div>
  );
};

export default LimitIncreaseReview;