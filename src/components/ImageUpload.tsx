import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onClear: () => void
  selectedImage?: File
  imagePreview?: string
  isProcessing?: boolean
}

export default function ImageUpload({
  onImageSelect,
  onClear,
  selectedImage,
  imagePreview,
  isProcessing = false
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid image file (JPG, PNG, WebP)')
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB')
        return
      }
      
      onImageSelect(file)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const handleCameraCapture = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onImageSelect(file)
      }
    }
    input.click()
  }

  if (imagePreview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={imagePreview}
            alt="Selected ingredients"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="glass-card p-6 text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-white font-semibold">AI is analyzing your ingredients...</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onClear}
            disabled={isProcessing}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 group-hover:scale-110 disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="absolute bottom-4 left-4 glass-card p-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-white" />
              <span className="text-white font-medium">
                {selectedImage?.name || 'Uploaded Image'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        {...getRootProps()}
        className={`border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive || dragActive
            ? 'border-purple-400 bg-purple-50/50 scale-105'
            : 'border-purple-300 hover:border-pink-400 hover:bg-purple-50/30'
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Upload className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {isDragActive ? 'Drop your magic photo here!' : 'Upload Your Ingredient Photo'}
          </h3>
          
          <p className="text-gray-600 font-medium mb-6">
            Drag & drop your pantry photo here, or click to browse
            <br />
            <span className="text-sm text-gray-500">Supports JPG, PNG, WebP • Max 10MB</span>
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCameraCapture}
          className="flex-1 btn-secondary flex items-center justify-center space-x-3"
        >
          <Camera className="h-5 w-5" />
          <span>Take Photo</span>
        </button>
        
        <button
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
          className="flex-1 btn-primary flex items-center justify-center space-x-3"
        >
          <Upload className="h-5 w-5" />
          <span>Choose File</span>
        </button>
      </div>
    </div>
  )
}