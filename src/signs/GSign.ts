const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const GSign = new GestureDescription('G')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Thumb || finger === Finger.Index) {
    GSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  } else {
    GSign.addCurl(finger, FingerCurl.FullCurl, 1.0)
  }

  GSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  GSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  GSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
