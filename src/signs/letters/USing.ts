const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const USign = new GestureDescription('U')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Thumb) {
    USign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
  } else if (finger === Finger.Index || finger === Finger.Middle) {
    USign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  } else {
    USign.addCurl(finger, FingerCurl.FullCurl, 1.0)
  }

  USign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  USign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  USign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
