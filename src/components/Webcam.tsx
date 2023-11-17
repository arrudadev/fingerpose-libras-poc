import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js'
import 'https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js'
import 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js'
import 'https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js'
import 'https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    VERSION: string
    handPoseDetection: any
  }
}

export function Webcam() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frame = useRef(0)
  let detector: any

  function browserSupportMediaDevices() {
    return navigator?.mediaDevices || navigator?.mediaDevices.getUserMedia
  }

  function getCamera() {
    return videoRef.current as HTMLVideoElement
  }

  async function setupCamera() {
    const camera = getCamera()

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

  async function loadModel() {
    if (!detector) {
      const handsVersion = window.VERSION
      const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${handsVersion}`,
        modelType: 'lite',
        maxHands: 2,
      }

      detector = await window.handPoseDetection.createDetector(
        window.handPoseDetection.SupportedModels.MediaPipeHands,
        detectorConfig,
      )
    }
  }

  async function estimateHands() {
    const camera = getCamera()

    const predictions = await detector.estimateHands(camera, {
      flipHorizontal: true,
    })

    if (predictions?.length) console.log(predictions)

    estimateHandsFrameLoop()
  }

  function estimateHandsFrameLoop() {
    // eslint-disable-next-line
    // @ts-ignore
    frame.current = requestAnimationFrame(estimateHands)
  }

  async function init() {
    if (!browserSupportMediaDevices()) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia not available`,
      )
    }

    await setupCamera()
    await loadModel()

    estimateHandsFrameLoop()
  }

  useEffect(() => {
    init()

    return () => cancelAnimationFrame(frame.current)
  }, [])

  return (
    <div className="h-full w-full shadow-xl p-4 rounded">
      <video ref={videoRef}></video>
    </div>
  )
}
