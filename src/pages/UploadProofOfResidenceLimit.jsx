import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, File, X, CheckCircle, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import StepProgress from '../components/auth/StepProgress';
import TheLoad from '../components/common/TheLoad';

const UploadProofOfResidenceLimit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];

  // Check if user already uploaded proof of residence during onboarding
  const [existingProof, setExistingProof] = useState(null);

  useEffect(() => {
    const checkExistingProof = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.proofOfResidence && data.proofOfResidence.uploaded) {
            setExistingProof(data.proofOfResidence);
          }
        }
      } catch (error) {
        console.error('Error checking existing proof:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingProof();
  }, [user]);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setIsUploaded(false);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setIsUploaded(false);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('Please select a file first.');
      return;
    }

    if (!user) {
      toast.error('No user found. Please sign in again.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Store file metadata in Firestore (temporary - just for this flow)
      const fileMetadata = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        uploaded: true
      };
      console.log(fileMetadata);
      
      // For this flow, we'll store the file info in sessionStorage for comparison
      sessionStorage.setItem('limitProofResidence', JSON.stringify(fileMetadata));
      
      setIsUploaded(true);
      toast.success('Proof of residence uploaded successfully!');
      
      // Navigate to review page after delay
      setTimeout(() => {
        navigate('/limit-increase-review');
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading proof of residence:', error);
      toast.error('Failed to upload proof of residence. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    navigate('/account-limits');
  };

  if (loading) {
    return (
      <TheLoad/>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white px-4 py-8"
    >
      {/* Back Arrow */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-[#111111] hover:text-[#E91908] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="w-full max-w-4xl mx-auto">
        {/* Step Progress */}
        {/* <StepProgress steps={steps} currentStep={3} /> */}

        {/* Heading */}
        <div className="text-center mt-6 mb-2">
          <h1 className="text-lg font-semibold text-[#111111]">Upload proof of residence</h1>
          <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
            Upload a document showing your current address
          </p>
        </div>

        {/* Upload Area */}
        <div className="mt-5 max-w-md mx-auto">
          {!preview ? (
            // Upload box (empty state)
            <label className="block w-full cursor-pointer">
              <div className="border border-dashed border-[#D9D9D9] bg-white rounded min-h-[160px] flex flex-col items-center justify-center p-6 hover:border-[#E91908] transition-colors">
                <Home className="w-12 h-12 text-[#E91908] mx-auto mb-2" />
                <p className="text-[#555555] text-[11px] font-medium">
                  Upload document
                </p>
                <p className="text-[#AAAAAA] text-[10px] mt-1">
                  Click to browse or drag and drop
                </p>
                <p className="text-[#CCCCCC] text-[9px] mt-2">
                  Supported: JPG, PNG (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            // File preview (selected state)
            <div className="border border-[#D9D9D9] bg-white rounded p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {isUploaded ? (
                    <CheckCircle className="w-7 h-7 text-green-500 flex-shrink-0" />
                  ) : (
                    <File className="w-7 h-7 text-[#E91908] flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[#333333] text-[11px] font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[#AAAAAA] text-[10px]">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-[#AAAAAA] hover:text-[#E91908] transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Image preview */}
              {preview && selectedFile.type.startsWith('image/') && (
                <div className="mt-3 rounded overflow-hidden border border-[#EEEEEE]">
                  <img 
                    src={preview} 
                    alt="Proof of residence preview" 
                    className="w-full h-32 object-contain bg-[#FAFAFA]"
                  />
                </div>
              )}
              
              {/* Upload status */}
              {isUploaded ? (
                <div className="mt-3 bg-green-50 text-green-700 text-[11px] font-medium rounded px-3 py-2 text-center">
                  ✓ Uploaded successfully!
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-3 bg-[#E91908] text-white font-medium text-[11px] h-9 rounded hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Next Button - Compact & Centered */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/limit-increase-review')}
            disabled={!isUploaded}
            className={`w-28 h-9 rounded font-medium text-[11px] transition-colors ${
              isUploaded
                ? 'bg-[#E91908] text-white hover:bg-[#cc1707] cursor-pointer'
                : 'bg-[#E5E5E5] text-[#AAAAAA] cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadProofOfResidenceLimit;