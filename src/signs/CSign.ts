const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const CSign = new GestureDescription('C')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  CSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
  CSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  CSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
  CSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.9)
  CSign.addDirection(finger, FingerDirection.HorizontalRight, 0.9)
}
