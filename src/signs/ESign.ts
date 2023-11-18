const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const ESign = new GestureDescription('E')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  ESign.addCurl(finger, FingerCurl.FullCurl, 1.0)
  ESign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  ESign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  ESign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
