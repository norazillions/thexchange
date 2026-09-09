import { useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const FileUploadBox = ({
  onFileSelect,
  onFileRemove,
  onUpload,
  isUploading,
  isUploaded,
  icon: Icon,
  title = 'Upload document',
  subtitle = 'Click to browse or drag and drop',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  preview,
  selectedFile,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file, url);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onFileRemove();
  };

  return (
    <div className="max-w-md mx-auto">
      {!preview && !previewUrl ? (
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-[#E91908] rounded-lg p-8 text-center hover:bg-[#FAE3C0]/20 transition-colors">
            {Icon ? (
              <Icon className="w-12 h-12 text-[#E91908] mx-auto mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-[#E91908] mx-auto mb-3" />
            )}
            <p className="text-[#E91908] font-semibold text-sm">{title}</p>
            <p className="text-[#505050] text-xs mt-1">{subtitle}</p>
            <p className="text-[#505050]/50 text-xs mt-3">
              Supported: JPG, PNG (Max {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="border-2 border-[#E91908] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {isUploaded ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <File className="w-8 h-8 text-[#E91908]" />
              )}
              <div>
                <p className="text-[#251412] font-medium text-sm truncate max-w-[180px]">
                  {selectedFile?.name}
                </p>
                <p className="text-[#505050] text-xs">
                  {(selectedFile?.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-[#505050] hover:text-[#E91908] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {(preview || previewUrl) && (
            <div className="mt-3 rounded-lg overflow-hidden border border-[#F0F0F0]">
              <img
                src={preview || previewUrl}
                alt="Preview"
                className="w-full h-48 object-contain bg-[#F0F0F0]"
              />
            </div>
          )}
          {isUploaded ? (
            <div className="mt-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg px-4 py-2 text-center">
              ✓ Uploaded successfully!
            </div>
          ) : (
            <button
              onClick={onUpload}
              disabled={isUploading}
              className="w-full mt-3 bg-[#E91908] text-white font-semibold py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;