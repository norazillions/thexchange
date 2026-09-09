import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, File, X } from 'lucide-react';
import { toast } from 'react-toastify';

const UploadProofOfFunds = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleNext = () => {
    if (!selectedFile) {
      toast.warning('Please upload a document first.');
      return;
    }
    // Store file reference and navigate to review page
    navigate('/limit-increase-review');
  };

  const handleBack = () => {
    navigate('/upload-proof-of-residence');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex flex-col items-center px-5 py-8"
    >
      {/* Back Arrow */}
      <div className="w-full max-w-[400px]">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[#111111] hover:text-[#E91908] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Heading */}
        <h1 className="text-xs font-semibold text-[#111111] text-center">
          Upload proof of funds
        </h1>
        <p className="text-[8px] text-[#666666] text-center mt-1">
          Upload a document showing proof of funds
        </p>

        {/* Upload Area */}
        <div className="mt-8 flex flex-col items-center">
          {!selectedFile ? (
            <label className="cursor-pointer">
              <div className="w-[160px] h-[90px] border border-dashed border-[#E5E5E5] rounded bg-white flex flex-col items-center justify-center hover:border-[#E91908] transition-colors">
                <Upload className="w-5 h-5 text-[#E91908] mb-1.5" />
                <p className="text-[8px] text-[#666666]">Click to upload</p>
                <p className="text-[7px] text-[#999999]">JPG, PNG (Max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="w-[160px] p-3 border border-[#E91908] rounded bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <File className="w-4 h-4 text-[#E91908] flex-shrink-0" />
                  <p className="text-[8px] text-[#111111] truncate max-w-[90px]">
                    {selectedFile.name}
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-[#999999] hover:text-[#E91908] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!selectedFile || isUploading}
            className={`mt-6 w-[90px] h-[30px] rounded text-[10px] font-medium transition-colors ${
              selectedFile && !isUploading
                ? 'bg-[#E91908] text-white hover:bg-[#cc1707] cursor-pointer'
                : 'bg-[#E5E5E5] text-white cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Next'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadProofOfFunds;