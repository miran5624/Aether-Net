import { useEffect, useRef, useState } from 'react'
import { NativeModules, NativeEventEmitter } from 'react-native'

const { NearbyModule } = NativeModules
const emitter = new NativeEventEmitter(NearbyModule)

export function useCompass(): { heading: number, accuracy: number } {
  const [heading, setHeading] = useState(0)
  const [accuracy, setAccuracy] = useState(3)
  const smoothedHeading = useRef(0)

  useEffect(() => {
    NearbyModule.startCompass()

    const sub = emitter.addListener('onCompassUpdate', (raw: string) => {
      const newHeading = parseInt(raw, 10)
      if (isNaN(newHeading) || newHeading === -1) return
      setHeading(newHeading)
    })

    const accSub = emitter.addListener('onCompassAccuracy', (val: string) => {
      setAccuracy(parseInt(val, 10))
    })

    return () => {
      sub.remove()
      accSub.remove()
      NearbyModule.stopCompass()
    }
  }, [])

  return { heading, accuracy }
}
