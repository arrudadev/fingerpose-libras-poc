const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const ASign = new GestureDescription('A')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Thumb) {
    ASign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  } else {
    ASign.addCurl(finger, FingerCurl.FullCurl, 1.0)
  }

  ASign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  ASign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  ASign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
