import { signs } from './signs'

type HandPrediction = {
  sign: string
  hand: string
}

export function detectSign(handsPredictions: HandPrediction[]) {
  let detectedSign = ''

  if (handsPredictions.length) {
    const firstHandPrediction = handsPredictions[0]

    for (const sign of signs) {
      if (sign.needTwoHands && handsPredictions.length === 2) {
        try {
          const secondHandPrediction = handsPredictions[1]

          const firstHandSign =
            sign[firstHandPrediction.hand.toLocaleLowerCase()]

          const secondHandSign =
            sign[secondHandPrediction.hand.toLocaleLowerCase()]

          if (
            firstHandPrediction.sign === firstHandSign &&
            secondHandPrediction.sign === secondHandSign
          ) {
            detectedSign = sign.sign
            break
          }
        } catch (error) {
          detectedSign = ''
          break
        }
      } else if (sign.needTwoHands && handsPredictions.length === 1) {
        continue
      } else {
        const firstHandSign = sign[firstHandPrediction.hand.toLocaleLowerCase()]

        if (firstHandPrediction.sign === firstHandSign) {
          detectedSign = sign.sign
          break
        }
      }
    }
  }

  return detectedSign
}
