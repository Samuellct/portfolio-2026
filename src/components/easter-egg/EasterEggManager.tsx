'use client'

import GlitchShutdown from './GlitchShutdown'
import Terminal from './Terminal'
import Fireworks from './Fireworks'
import RestoredOverlay from './RestoredOverlay'

export default function EasterEggManager() {
  return (
    <>
      <GlitchShutdown />
      <Terminal />
      <Fireworks />
      <RestoredOverlay />
    </>
  )
}
