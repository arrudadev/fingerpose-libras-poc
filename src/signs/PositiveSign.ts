const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const PositiveSign = new GestureDescription('positive')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Thumb) {
    PositiveSign.addCurl(finger, FingerCurl.NoCurl, 1.0)

    PositiveSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
    PositiveSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
    PositiveSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
  } else {
    PositiveSign.addCurl(finger, FingerCurl.FullCurl, 1.0)

    PositiveSign.addDirection(finger, FingerDirection.HorizontalRight, 1.0)
    PositiveSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
    PositiveSign.addDirection(finger, FingerDirection.HorizontalLeft, 1.0)
    PositiveSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
  }
}
