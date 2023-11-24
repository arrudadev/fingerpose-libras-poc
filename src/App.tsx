import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js'
import 'https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js'
import 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js'
import 'https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js'
import 'https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js'

import { useEffect, useRef, useState } from 'react'

import { knownGestures } from './signs'
import { detectSign } from './utils/detectSign'

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frame = useRef(0)
  let detector: any
  let fingerposeGestureEstimator: any

  const [detectedSign, setDetectedSign] = useState('')

  const FINGER_LOOKUP_INDICES: any = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  }

  const drawHands = (hands: any, ctx: any, showNames = false) => {
    if (hands.length <= 0) {
      return
    }

    hands.sort((hand1: any, hand2: any) => {
      if (hand1.handedness < hand2.handedness) return 1
      if (hand1.handedness > hand2.handedness) return -1
      return 0
    })

    // while (hands.length < 2) { hands.push(); }

    for (let i = 0; i < hands.length; i++) {
      ctx.fillStyle = hands[i].handedness === 'Left' ? 'black' : 'Blue'
      ctx.strokeStyle = 'White'
      ctx.lineWidth = 2

      for (let y = 0; y < hands[i].keypoints.length; y++) {
        const keypoint = hands[i].keypoints[y]
        ctx.beginPath()
        ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI)
        ctx.fill()

        if (showNames) {
          drawInvertedText(keypoint, ctx)
        }
      }

      const fingers = Object.keys(FINGER_LOOKUP_INDICES)
      for (let z = 0; z < fingers.length; z++) {
        const finger = fingers[z]
        const points = FINGER_LOOKUP_INDICES[finger].map(
          (idx: any) => hands[i].keypoints[idx],
        )
        drawPath(points, ctx)
      }
    }
  }

  const drawInvertedText = (keypoint: any, ctx: any) => {
    ctx.save()
    ctx.translate(keypoint.x - 10, keypoint.y)
    ctx.rotate(-Math.PI / 1)
    ctx.scale(1, -1)
    ctx.fillText(keypoint.name, 0, 0)
    ctx.restore()
  }

  const drawPath = (points: any, ctx: any, closePath = false) => {
    const region = new Path2D()
    region.moveTo(points[0]?.x, points[0]?.y)
    for (let i = 1; i < points.length; i++) {
      const point = points[i]
      region.lineTo(point?.x, point?.y)
    }

    if (closePath) {
      region.closePath()
    }

    ctx.stroke(region)
  }

  function browserSupportMediaDevices() {
    return navigator?.mediaDevices || navigator?.mediaDevices.getUserMedia
  }

  function getCamera() {
    return videoRef.current as HTMLVideoElement
  }

  function getCanvas() {
    return canvasRef.current as HTMLCanvasElement
  }

  async function setupCamera() {
    const camera = getCamera()

    const videoConfig = {
      audio: false,
      video: {
        frameRate: {
          ideal: 60,
        },
        facingMode: {
          exact: 'user',
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

    camera.width = camera.videoWidth
    camera.height = camera.videoHeight

    camera.play()
  }

  function setupCanvas() {
    const canvas = getCanvas()
    // const ctx = canvas.getContext('2d')
    const camera = getCamera()

    canvas.width = camera.width
    canvas.height = camera.height
  }

  // function drawHands(predictions: any[]) {
  //   const canvas = getCanvas()
  //   const ctx = canvas.getContext('2d')

  //   // Points for fingers
  //   const fingerJoints: any = {
  //     thumb: [0, 1, 2, 3, 4],
  //     indexFinger: [0, 5, 6, 7, 8],
  //     middleFinger: [0, 9, 10, 11, 12],
  //     ringFinger: [0, 13, 14, 15, 16],
  //     pinky: [0, 17, 18, 19, 20],
  //   }

  //   // Infinity Gauntlet Style
  //   const style: any = {
  //     0: { color: 'yellow', size: 15 },
  //     1: { color: 'gold', size: 6 },
  //     2: { color: 'green', size: 10 },
  //     3: { color: 'gold', size: 6 },
  //     4: { color: 'gold', size: 6 },
  //     5: { color: 'purple', size: 10 },
  //     6: { color: 'gold', size: 6 },
  //     7: { color: 'gold', size: 6 },
  //     8: { color: 'gold', size: 6 },
  //     9: { color: 'blue', size: 10 },
  //     10: { color: 'gold', size: 6 },
  //     11: { color: 'gold', size: 6 },
  //     12: { color: 'gold', size: 6 },
  //     13: { color: 'red', size: 10 },
  //     14: { color: 'gold', size: 6 },
  //     15: { color: 'gold', size: 6 },
  //     16: { color: 'gold', size: 6 },
  //     17: { color: 'orange', size: 10 },
  //     18: { color: 'gold', size: 6 },
  //     19: { color: 'gold', size: 6 },
  //     20: { color: 'gold', size: 6 },
  //   }

  //   // Check if we have predictions
  //   if (predictions.length > 0) {
  //     // Loop through each prediction
  //     predictions.forEach((prediction) => {
  //       // Grab landmarks
  //       const keypoints = prediction.keypoints

  //       // Loop through fingers
  //       for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
  //         const finger = Object.keys(fingerJoints)[j]
  //         //  Loop through pairs of joints
  //         for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
  //           // Get pairs of joints
  //           const firstJointIndex = fingerJoints[finger][k]
  //           const secondJointIndex = fingerJoints[finger][k + 1]

  //           // Draw path
  //           if (ctx) {
  //             ctx.beginPath()
  //             ctx.moveTo(
  //               keypoints[firstJointIndex][0],
  //               keypoints[firstJointIndex][1],
  //             )
  //             ctx.lineTo(
  //               keypoints[secondJointIndex][0],
  //               keypoints[secondJointIndex][1],
  //             )
  //             ctx.strokeStyle = 'plum'
  //             ctx.lineWidth = 4
  //             ctx.stroke()
  //           }
  //         }
  //       }

  //       // Loop through landmarks and draw em
  //       for (let i = 0; i < keypoints.length; i++) {
  //         // Get x point
  //         const x = keypoints[i][0]
  //         // Get y point
  //         const y = keypoints[i][1]

  //         if (ctx) {
  //           // Start drawing
  //           ctx.beginPath()
  //           ctx.arc(x, y, style[i].size, 0, 3 * Math.PI)

  //           // Set line color
  //           ctx.fillStyle = style[i].color
  //           ctx.fill()
  //         }
  //       }
  //     })
  //   }
  // }

  // function cleanCanvas() {
  //   canvasContext?.clearRect(0, 0, canvas.width, canvas.height)
  // }

  // // function drawJoints(keypoints: any[]) {
  // //   for (const { x, y } of keypoints) {
  // //     canvasContext?.beginPath()
  // //     const newX = x - 2
  // //     const newY = y - 2
  // //     const radius = 3
  // //     const startAngle = 0
  // //     const endAngle = 2 * Math.PI

  // //     canvasContext?.arc(newX, newY, radius, startAngle, endAngle)
  // //     canvasContext?.fill()
  // //   }
  // // }

  // // function drawFingers(keypoints: any[]) {
  // //   const fingerLookupIndexes: any = {
  // //     thumb: [0, 1, 2, 3, 4],
  // //     indexFinger: [0, 5, 6, 7, 8],
  // //     middleFinger: [0, 9, 10, 11, 12],
  // //     ringFinger: [0, 13, 14, 15, 16],
  // //     pinky: [0, 17, 18, 19, 20],
  // //   }

  // //   const fingers = Object.keys(fingerLookupIndexes)
  // //   for (const finger of fingers) {
  // //     const points = fingerLookupIndexes[finger].map(
  // //       (index: any) => keypoints[index],
  // //     )
  // //     const region = new Path2D()
  // //     const [{ x, y }] = points
  // //     region.moveTo(x, y)
  // //     for (const point of points) {
  // //       region.lineTo(point.x, point.y)
  // //     }
  // //     canvasContext?.stroke(region)
  // //   }
  // // }

  // // function drawResults(hands: any[]) {
  // //   for (const { keypoints, handedness } of hands) {
  // //     if (!keypoints) continue

  // //     if (canvasContext) {
  // //       console.log(handedness)
  // //       canvasContext.fillStyle = 'rgb(44, 212, 103)'
  // //       canvasContext.strokeStyle = 'white'
  // //       canvasContext.lineWidth = 8
  // //       canvasContext.lineJoin = 'round'
  // //     }

  // //     drawJoints(keypoints)
  // //     drawFingers(keypoints)
  // //   }
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
    const canvas = getCanvas()
    const ctx = canvas.getContext('2d')

    const handsPredictions = await detector.estimateHands(camera, {
      flipHorizontal: false,
    })

    ctx?.clearRect(0, 0, camera.videoWidth, camera.videoHeight)
    ctx?.drawImage(camera, 0, 0, camera.videoWidth, camera.videoHeight)

    if (handsPredictions?.length) {
      drawHands(handsPredictions, ctx)

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

    await setupCamera()
    setupCanvas()
    await loadModel()
    setupFingerpose()
    estimateHandsFrameLoop()
  }

  useEffect(() => {
    init()

    return () => cancelAnimationFrame(frame.current)
  }, [])

  return (
    <main className="px-8">
      <div className="min-h-screen py-8 flex-grow flex flex-col items-center">
        <h1 className="text-4xl text-black font-bold mb-8">
          Libras interpreter
        </h1>

        <canvas
          ref={canvasRef}
          style={{
            transform: 'scaleX(-1)',
            zIndex: 1,
            borderRadius: '1rem',
            boxShadow: '0 3px 10px rgb(0 0 0)',
            maxWidth: '85vw',
          }}
          id="canvas"
        ></canvas>

        <video
          ref={videoRef}
          style={{
            visibility: 'hidden',
            transform: 'scaleX(-1)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
          }}
          id="video"
          playsInline
        ></video>

        <p className="mt-8 text-center text-4xl text-black font-bold">
          {detectedSign}
        </p>
      </div>
    </main>
    // <>
    //   <h1 className="fixed top-4 left-0 right-0 text-center text-2xl text-black font-bold">
    //     Libras interpreter
    //   </h1>

    //   <canvas
    //     ref={canvasRef}
    //     style={{
    //       transform: 'scaleX(-1)',
    //       zIndex: 1,
    //       borderRadius: '1rem',
    //       boxShadow: '0 3px 10px rgb(0 0 0)',
    //       maxWidth: '85vw',
    //     }}
    //     id="canvas"
    //   ></canvas>

    //   <video
    //     ref={videoRef}
    //     style={{
    //       visibility: 'hidden',
    //       transform: 'scaleX(-1)',
    //       position: 'absolute',
    //       top: 0,
    //       left: 0,
    //       width: 0,
    //       height: 0,
    //     }}
    //     id="video"
    //     playsInline
    //   ></video>

    //   {/* <canvas
    //     ref={canvasRef}
    //     className="fixed right-0 bottom-0 min-h-full min-w-full"
    //   ></canvas>

    //   <video
    //     ref={videoRef}
    //     className="fixed right-0 bottom-0 min-h-full min-w-full"
    //   ></video>

    //   <p className="fixed bottom-4 left-0 right-0 text-center text-2xl text-black font-bold">
    //     {detectedSign}
    //   </p> */}
    // </>
  )
}
