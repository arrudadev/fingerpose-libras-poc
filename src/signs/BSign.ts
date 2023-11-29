const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const BSign = new GestureDescription('B')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Thumb) {
    BSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
  } else {
    BSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  }

  BSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  BSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  BSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
