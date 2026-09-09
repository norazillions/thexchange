import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, File, X, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import StepProgress from '../../components/auth/StepProgress';

const passportPlaceholder = '/images/passport-placeholder.png';

const UploadPhoto = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setIsUploaded(false);
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setIsUploaded(false);
  };
  const handleContinue = async () => {
  
      window.location.href = '/onboarding/proof-of-residence'
};
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('Please select a photo first.');
      return;
    }

    if (!user) {
      toast.error('No user found. Please sign in again.');
      return;
    }

    setIsUploading(true);
    
    try {
      const fileMetadata = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        uploaded: true
      };
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        profilePhoto: fileMetadata,
        onboardingStep: 'proof-of-residence'
      });
      
      setIsUploaded(true);
      toast.success('Photo uploaded successfully!');      
      window.location.href = '/onboarding/proof-of-residence';
     
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
        <StepProgress steps={steps} currentStep={3} />
        <div className="text-center mt-6 mb-2">
          <h1 className="text-lg font-semibold text-[#111111]">
            Upload a passport photograph
          </h1>
          <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
            Upload a recent photo for your profile
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center">
          {!preview ? (
            <label className="block cursor-pointer">
              <div className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-[#D9D9D9] bg-white flex flex-col items-center justify-center hover:border-[#E91908] transition-colors overflow-hidden">
                <img
                  src={passportPlaceholder}
                  alt="Upload passport photograph"
                  className="w-12 h-12 object-contain opacity-60"
                />
                <span className="text-[#AAAAAA] text-[9px] mt-1 text-center px-2">
                  Click to upload
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[#E91908] bg-[#FAFAFA]">
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleRemoveFile}
                className="absolute -top-1 -right-1 w-6 h-6 bg-[#E91908] text-white rounded-full flex items-center justify-center hover:bg-[#cc1707] transition-colors shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {selectedFile && !isUploaded && (
            <p className="text-[#555555] text-[10px] mt-3">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
          {selectedFile && !isUploaded && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-3 bg-[#E91908] text-white font-medium text-[11px] h-9 px-6 rounded hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          )}
          {isUploaded && (
            <div className="mt-3 flex items-center gap-2 bg-green-50 text-green-700 text-[11px] font-medium rounded px-3 py-1.5">
              <CheckCircle className="w-4 h-4" />
              Uploaded successfully!
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
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
      </div>
    </div>
  );
};

export default UploadPhoto;