const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const BallLeftSign = new GestureDescription('ball-left')
export const BallRightSign = new GestureDescription('ball-right')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  BallLeftSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
  BallRightSign.addCurl(finger, FingerCurl.HalfCurl, 1.0)
  BallLeftSign.addCurl(finger, FingerCurl.NoCurl, 0.9)
  BallRightSign.addCurl(finger, FingerCurl.NoCurl, 0.9)

  BallLeftSign.addDirection(finger, FingerDirection.DiagonalUpRight, 1.0)
  BallRightSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 1.0)
  BallLeftSign.addDirection(finger, FingerDirection.HorizontalRight, 0.9)
  BallRightSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.9)
}
