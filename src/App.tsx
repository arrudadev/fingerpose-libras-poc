import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js'
import 'https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js'
import 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js'
import 'https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js'
import 'https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js'

import { useEffect, useRef, useState } from 'react'

import { knownGestures } from './signs'
import { detectSign } from './utils/detectSign'
import Webcam from 'react-webcam'

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frame = useRef(0)
  let detector: any
  let fingerposeGestureEstimator: any

  const [detectedSign, setDetectedSign] = useState('')

  function browserSupportMediaDevices() {
    return navigator?.mediaDevices || navigator?.mediaDevices.getUserMedia
  }

  function getCamera() {
    return videoRef.current as HTMLVideoElement
  }

  // async function setupCamera() {
  //   const camera = getCamera()

  //   camera.height = globalThis.screen.height
  //   camera.width = globalThis.screen.width

  //   const videoConfig = {
  //     audio: false,
  //     video: {
  //       width: globalThis.screen.width,
  //       height: globalThis.screen.height,
  //       frameRate: {
  //         ideal: 60,
  //       },
  //       facingMode: {
  //         exact: 'user',
  //       },
  //     },
  //   }

  //   const stream = await navigator.mediaDevices.getUserMedia(videoConfig)
  //   camera.srcObject = stream

  //   await new Promise((resolve) => {
  //     camera.onloadedmetadata = () => {
  //       resolve(videoRef.current)
  //     }
  //   })

  //   camera.play()
  // }

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

  function setupFingerpose() {
    const fingerpose = window.fp

    fingerposeGestureEstimator = new fingerpose.GestureEstimator(knownGestures)
  }

  function getLandMarksFromKeypoints(keypoints3D: any) {
    return keypoints3D.map((keypoint: { x: number; y: number; z: number }) => [
      keypoint.x,
      keypoint.y,
      keypoint.z,
    ])
  }

  async function fingerposeEstimateHands(
    handsPredictions: any,
  ): Promise<{ sign: string; hand: string }[]> {
    const predictions = []
    const TRUST_PERCENTAGE = 9 // 90%

    for (const hand of handsPredictions) {
      if (!hand.keypoints3D) continue

      const { gestures, poseData } = await fingerposeGestureEstimator.estimate(
        getLandMarksFromKeypoints(hand.keypoints3D),
        TRUST_PERCENTAGE,
      )

      // eslint-disable-next-line
      // @ts-ignore
      const env = process.env.NODE_ENV
      if (env === 'development') {
        console.log(gestures, poseData)
      }

      if (!gestures.length) {
        continue
      }

      const sign = gestures.reduce((previous: any, current: any) =>
        previous.score > current.score ? previous : current,
      )

      predictions.push({ sign: sign.name, hand: hand.handedness })
    }

    return predictions
  }

  async function estimateHands() {
    const camera = getCamera()

    const handsPredictions = await detector.estimateHands(camera, {
      flipHorizontal: true,
    })

    if (handsPredictions?.length) {
      const fingerposePredictions =
        await fingerposeEstimateHands(handsPredictions)

      setDetectedSign(detectSign(fingerposePredictions))
    }

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

    // await setupCamera()
    await loadModel()
    setupFingerpose()
    estimateHandsFrameLoop()
  }

  useEffect(() => {
    init()

    return () => cancelAnimationFrame(frame.current)
  }, [])

  console.log(window.innerHeight)
  console.log(detectedSign)

  return (
    // <main className="relative">
    //   <video className="h-screen w-screen object-fill" ref={videoRef}></video>

    //   <p className="absolute bottom-4 left-[45%] text-2xl text-white font-bold">
    //     {detectedSign}
    //   </p>
    // </main>
    <Webcam
      videoConstraints={{
        frameRate: 60,
        height: window.screen.height,
        width: window.screen.width,
      }}
      style={{
        height: '100vh',
        width: '100%',
        objectFit: 'cover',
        position: 'absolute',
        transform: 'scale(0.75)',
      }}
    />
  )
}
