const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const NegativeSign = new GestureDescription('negative')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (finger === Finger.Thumb) {
    NegativeSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
    NegativeSign.addCurl(finger, FingerCurl.HalfCurl, 0.9)

    NegativeSign.addDirection(finger, FingerDirection.VerticalDown, 1.0)
    NegativeSign.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9)
    NegativeSign.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9)
  } else {
    NegativeSign.addCurl(finger, FingerCurl.FullCurl, 1.0)
    NegativeSign.addCurl(finger, FingerCurl.HalfCurl, 0.9)

    NegativeSign.addDirection(finger, FingerDirection.HorizontalRight, 1.0)
    NegativeSign.addDirection(finger, FingerDirection.HorizontalLeft, 1.0)
  }
}
