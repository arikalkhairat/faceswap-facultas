"use client"

import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, RefreshCw } from 'lucide-react'

const LiveCamera: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const webcamRef = useRef<Webcam>(null)

  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: facingMode,
  }

  const handleCameraToggle = useCallback(() => {
    if (isCameraActive) {
      setIsCameraActive(false)
      setError(null)
    } else {
      setIsCameraActive(true)
      setError(null)
    }
  }, [isCameraActive])

  const handleCameraError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error)
    setError('Unable to access camera. Please check permissions or connect a camera.')
    setIsCameraActive(false)
  }, [])

  const switchCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'))
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#F0F8FF] p-4 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <Button
          onClick={handleCameraToggle}
          className={`${isCameraActive ? 'bg-[#4682B4]' : 'bg-[#1E90FF]'
            } text-white hover:bg-[#4682B4] transition-colors`}
        >
          {isCameraActive ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" /> Deactivate Camera
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" /> Activate Camera
            </>
          )}
        </Button>
        {isCameraActive && (
          <Button onClick={switchCamera} className="bg-[#4682B4] text-white hover:bg-[#1E90FF] transition-colors">
            <RefreshCw className="mr-2 h-4 w-4" /> Switch Camera
          </Button>
        )}
      </div>
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {isCameraActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            videoConstraints={videoConstraints}
            onUserMediaError={handleCameraError}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
            <p className="text-[#2F4F4F]">
              {error || "Camera is inactive. Click the button to activate."}
            </p>
          </div>
        )}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white opacity-30"></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveCamera

