const { Finger, FingerCurl, FingerDirection, GestureDescription } = window.fp

export const HomeLeftSign = new GestureDescription('home-left')
export const HomeRightSign = new GestureDescription('home-right')

for (const finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  HomeLeftSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
  HomeRightSign.addCurl(finger, FingerCurl.NoCurl, 1.0)

  HomeLeftSign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9)
  HomeRightSign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9)
}
