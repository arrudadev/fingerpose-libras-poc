const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const ILoveYouSign = new GestureDescription('i-love-you')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  if (
    finger === Finger.Thumb ||
    finger === Finger.Index ||
    finger === Finger.Pinky
  ) {
    ILoveYouSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
    ILoveYouSign.addDirection(finger, FingerDirection.HorizontalRight, 0.9)
    ILoveYouSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.9)
  } else {
    ILoveYouSign.addCurl(finger, FingerCurl.FullCurl, 1.0)
  }

  ILoveYouSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
  ILoveYouSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  ILoveYouSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
