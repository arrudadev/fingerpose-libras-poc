const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const ISign = new GestureDescription('I')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Pinky) {
    ISign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  } else {
    ISign.addCurl(finger, FingerCurl.FullCurl, 1.0)
  }

  ISign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  ISign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  ISign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
