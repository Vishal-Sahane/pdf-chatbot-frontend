import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  uploadStart,
  uploadSuccess,
  uploadFailure,
} from "../features/pdf/pdfSlice";

export default function UploadScreen() {
  const dispatch = useDispatch();
  const { isUploading, error } = useSelector((state) => state.pdf);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const validateFile = (file) => {
    setValidationError(null);
    if (file.type !== "application/pdf") {
      setValidationError("Only PDF files are allowed.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setValidationError("File size must be under 10MB.");
      return false;
    }
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    dispatch(uploadStart());
    try {
      const response = await axios.post(
        "http://localhost:8000/pdf/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      dispatch(uploadSuccess(response.data));
    } catch (err) {
      const message =
        err.response?.data?.detail || "Upload failed. Please try again.";
      dispatch(uploadFailure(message));
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center px-4">
      {/* Glow Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="mb-10 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            P
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            PDF Chatbot
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Upload a PDF and start asking questions instantly
        </p>
      </div>

      {/* Upload Card */}
      <div className="w-full max-w-lg bg-[#16162A] border border-[#2A2A45] rounded-2xl p-8 z-10">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
                : selectedFile
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-[#2A2A45] hover:border-violet-500/50 hover:bg-violet-500/5"
            }`}
        >
          {/* Icon */}
          <div
            className={`text-5xl mb-4 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}
          >
            {selectedFile ? "✅" : "📄"}
          </div>

          {selectedFile ? (
            <div className="text-center">
              <p className="text-green-400 text-sm font-medium">
                {selectedFile.name}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 text-sm font-medium">
                Drag & drop your PDF here
              </p>
              <p className="text-gray-600 text-xs mt-1">
                or click below to browse
              </p>
            </div>
          )}

          {/* Browse Button */}
          <label className="mt-4 px-5 py-2 bg-[#1E1E35] hover:bg-[#252545] border border-[#2A2A45] hover:border-violet-500/50 text-gray-400 hover:text-gray-200 text-xs rounded-lg cursor-pointer transition-all duration-200">
            {selectedFile ? "Change file" : "Browse file"}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-xs text-center">
              ⚠️ {validationError}
            </p>
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-xs text-center">⚠️ {error}</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
            ${
              selectedFile && !isUploading
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02]"
                : "bg-[#1E1E35] text-gray-600 cursor-not-allowed"
            }`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload PDF"
          )}
        </button>

        {/* Footer Hint */}
        <p className="text-gray-700 text-xs text-center mt-3">
          Max file size: 10MB · PDF files only
        </p>
      </div>

      {/* Bottom Tag */}
     
      <p className="text-gray-500 text-xs mt-8 z-10 tracking-wide">
        ✦ Instant answers &nbsp;·&nbsp; ✦ Any PDF &nbsp;·&nbsp; ✦ AI powered
      </p>
    </div>
  );
}
