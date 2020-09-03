import * as React from "react"
import { Canvas } from "react-three-fiber"
import { ThreeBlocks } from "./block"

export const Three = () => {
  return (
    <Canvas
      style={{ position: "fixed", top: 0, zIndex: 1, pointerEvents: "none" }}
    >
      <ThreeBlocks />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  )
}
