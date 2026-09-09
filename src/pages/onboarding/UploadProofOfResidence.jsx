import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, File, X, CheckCircle, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import StepProgress from '../../components/auth/StepProgress';
const documentPlaceholder = '/images/document-placeholder.png';

const UploadProofOfResidence = () => {
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
      const fileMetadata = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        uploaded: true
      };
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        proofOfResidence: fileMetadata,
        onboardingStep: 'set-pin'
      });
      
      setIsUploaded(true);
      toast.success('Proof of residence uploaded successfully!');
      window.location.href = '/onboarding/set-pin';
     
      
    } catch (error) {
      console.error('Error uploading proof of residence:', error);
      toast.error('Failed to upload proof of residence. Please try again.');
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
            Upload proof of residence
          </h1>
          <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
            Upload a document showing your current address
          </p>
        </div>
        <div className="mt-6">
          {!preview ? (
            <label className="block w-full cursor-pointer flex justify-center items-center">
              <div className="border w-100 border-dashed border-[#D9D9D9] bg-white rounded min-h-[140px] flex flex-col items-center justify-center p-6 hover:border-[#E91908] transition-colors">
                <img
                  src={documentPlaceholder}
                  alt="Upload document"
                  className="w-12 h-12 object-contain mb-2 opacity-60"
                />
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
              {preview && (
                <div className="mt-3 rounded overflow-hidden border border-[#EEEEEE]">
                  <img 
                    src={preview} 
                    alt="Proof of residence preview" 
                    className="w-full h-32 object-contain bg-[#FAFAFA]"
                  />
                </div>
              )}
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
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.location.href = '/onboarding/set-pin'}
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
    </div>
  );
};

export default UploadProofOfResidence;