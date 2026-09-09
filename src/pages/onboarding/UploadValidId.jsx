import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import StepProgress from '../../components/auth/StepProgress';

// TEMPORARY PLACEHOLDER - Replace with your actual Figma asset later
const uploadIllustration = '/images/upload-placeholder.png';

const UploadValidId = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  
  // Form fields
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];

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
const handleContinue = async () => {
  
      window.location.href = '/onboarding/photo'
};

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('Please select a file first.');
      return;
    }

    if (!idType) {
      toast.warning('Please select ID type.');
      return;
    }

    if (!idNumber) {
      toast.warning('Please enter ID number.');
      return;
    }

    if (!expiryDate) {
      toast.warning('Please select expiry date.');
      return;
    }

    if (!user) {
      toast.error('No user found. Please sign in again.');
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('Attempting to save to Firestore...');
      
      const fileMetadata = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        uploaded: true,
        idType: idType,
        idNumber: idNumber,
        expiryDate: expiryDate
      };
      
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        validId: fileMetadata,
        onboardingStep: 'photo'
      });
      
      console.log('Firestore update successful!');
      
      setIsUploaded(true);
      toast.success('ID uploaded successfully!');
      
      // navigate('/onboarding/photo');
      window.location.href = '/onboarding/photo';
      
      
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Check Firestore rules.');
      } else if (error.code === 'not-found') {
        toast.error('Firestore database not found. Please check Firebase Console.');
      } else {
        toast.error('Failed to upload ID. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = selectedFile && idType && idNumber && expiryDate;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
        {/* Step Progress */}
        <StepProgress steps={steps} currentStep={3} />

        {/* Heading */}
        <div className="text-center mt-6 mb-2">
          <h1 className="text-lg font-semibold text-[#111111]">Upload a valid ID</h1>
          <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
            Upload a government-issued ID for verification
          </p>
        </div>
        {/* Upload Area */}
        <div className="mt-5">
          {!preview ? (
            // Upload box (empty state)
            <label className="block w-full cursor-pointer flex justify-center items-center">
              <div className="border border-dashed w-100 border-[#D9D9D9] bg-white rounded min-h-[160px] flex flex-col items-center justify-center p-6 hover:border-[#E91908] transition-colors">
                <img
                  src="/src/assets/images/upload.png"
                  alt="Upload ID"
                  className="w-14 h-14 object-contain mb-2"
                />
                <p className="text-[#5555] text-[10px] mt-1">
                  <span className='text-[#E91908] text-[11px] font-medium'>Click to Upload</span>  or drag and drop
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
                    alt="ID preview" 
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
                  disabled={isUploading || !isFormValid}
                  className="w-full mt-3 bg-[#E91908] text-white font-medium text-[11px] h-9 rounded hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload ID'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ID Details Form */}
        <div className="mt-5 space-y-3">
          {/* ID Type */}
          <div>
            <label className="block text-[#333333] text-[11px] font-medium mb-1">
              ID Type
            </label>
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="w-full h-10 px-3 text-[11px] text-[#555555] bg-[#F5F5F5] border border-[#EEEEEE] rounded focus:outline-none focus:ring-1 focus:ring-[#E91908] focus:border-[#E91908] transition-colors appearance-none"
            >
              <option value="">Select ID type</option>
              <option value="passport">Passport</option>
              <option value="drivers-license">Driver's License</option>
              <option value="national-id">National ID</option>
              <option value="voters-card">Voter's Card</option>
              <option value="residence-permit">Residence Permit</option>
            </select>
          </div>

          {/* Two-column grid for ID Number & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ID Number */}
            <div>
              <label className="block text-[#333333] text-[11px] font-medium mb-1">
                ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter ID number"
                className="w-full h-10 px-3 text-[11px] text-[#555555] bg-[#F5F5F5] border border-[#EEEEEE] rounded focus:outline-none focus:ring-1 focus:ring-[#E91908] focus:border-[#E91908] transition-colors placeholder:text-[#AAAAAA]"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-[#333333] text-[11px] font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-10 px-3 text-[11px] text-[#555555] bg-[#F5F5F5] border border-[#EEEEEE] rounded focus:outline-none focus:ring-1 focus:ring-[#E91908] focus:border-[#E91908] transition-colors"
              />
            </div>
          </div>
        </div>

        
        {/* Next Button - Compact & Centered */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={isUploaded}
            className={`w-28 h-9 rounded font-medium text-[11px] transition-colors ${
              isUploaded
                ? 'bg-[#E91908] text-white hover:bg-[#cc1707] cursor-pointer'
                : 'bg-[#E5E5E5] text-[#AAAAAA] cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>

        {/* Skip for demo (optional) */}
        <div className="text-center mt-3">
          <button
            onClick={() => navigate('/onboarding/photo')}
            className="text-[#CCCCCC] text-[10px] hover:text-[#AAAAAA] transition-colors"
          >
            Skip for demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadValidId;