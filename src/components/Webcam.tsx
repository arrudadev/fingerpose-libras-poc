import { useEffect, useRef } from 'react'

export function Webcam() {
  const videoRef = useRef<HTMLVideoElement>(null)

  function browserSupportMediaDevices() {
    return navigator?.mediaDevices || navigator?.mediaDevices.getUserMedia
  }

  async function setupCamera(camera: HTMLVideoElement) {
    const videoConfig = {
      audio: false,
      video: {
        width: globalThis.screen.availWidth,
        height: globalThis.screen.availHeight,
        frameRate: {
          ideal: 60,
        },
      },
    }

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig)
    camera.srcObject = stream

    await new Promise((resolve) => {
      camera.onloadedmetadata = () => {
        resolve(videoRef.current)
      }
    })

    camera.play()
  }

  useEffect(() => {
    if (!browserSupportMediaDevices()) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia not available`,
      )
    }

    const camera = videoRef.current as HTMLVideoElement
    setupCamera(camera)
  }, [videoRef])

  return (
    <div className="h-full w-full shadow-xl p-4 rounded">
      <video ref={videoRef}></video>
    </div>
  )
}
