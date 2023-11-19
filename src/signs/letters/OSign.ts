const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const OSign = new GestureDescription('O')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  OSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
  OSign.addCurl(finger, FingerCurl.FullCurl, 0.9)
  OSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  OSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
  OSign.addDirection(finger, FingerDirection.HorizontalRight, 0.9)
  OSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.9)
}
