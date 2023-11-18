const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const FSign = new GestureDescription('F')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Index) {
    FSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
    FSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.9)
    FSign.addDirection(finger, FingerDirection.HorizontalRight, 0.9)
  } else {
    FSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  }

  FSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  FSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  FSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
