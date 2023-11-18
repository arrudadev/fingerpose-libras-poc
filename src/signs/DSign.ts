const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const DSign = new GestureDescription('D')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Index) {
    DSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
    DSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
    DSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
    DSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
  } else {
    DSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
    DSign.addCurl(finger, FingerCurl.FullCurl, 0.9)
    DSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
    DSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
    DSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
    DSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.9)
    DSign.addDirection(finger, FingerDirection.HorizontalRight, 0.9)
  }
}
