import * as React from "react"
import { useRef, useState, useEffect, useContext } from "react"
import { render, stateContext, CanvasContext } from "react-three-fiber"
import { createRandomString } from "../utils/createRandomString"
import * as THREE from "three"
import { motion, MotionProps } from "framer-motion"

/*
 * R3F / DOM BLOCKS
 *
 * Enables the mixing of R3F & dom in the same component
 *
 * TODO:
 * - Create a useBlock with progress, size, etc
 * - maybe two canvases? one in-front and one behind? not sure about the perf
 */

interface CanvasStore {
  canvasState: CanvasContext | null
  canvasNodes: {
    [id: string]: React.MutableRefObject<THREE.Object3D | undefined>
  }
  stateSetters: React.Dispatch<React.SetStateAction<CanvasContext | null>>[]
}

const canvasStore: CanvasStore = {
  canvasState: null,
  canvasNodes: {},
  stateSetters: [],
}

// store the canvas node & canvas state
// for use in the dom block
function useCanvasStore() {
  const [canvasState, setCanvasStoreState] = useState<CanvasContext | null>(
    canvasStore.canvasState
  )

  useEffect(() => {
    canvasStore.stateSetters.push(setCanvasStoreState)
  }, [])

  return canvasState
}

function useCanvasNode() {
  const id = useState(() => createRandomString())[0]
  const canvasNode = useRef<THREE.Object3D>()

  useEffect(() => {
    canvasStore.canvasNodes[id] = canvasNode
  }, [id])

  return canvasNode
}

// For use inside the canvas
function useCanvasStoreThree() {
  const getCanvasNodes = () => canvasStore.canvasNodes
  const setCanvasState = (newCanvasState: CanvasContext) => {
    canvasStore.canvasState = newCanvasState
    canvasStore.stateSetters.forEach((set: any) => set(newCanvasState))
  }

  return { setCanvasState, getCanvasNodes }
}

// render the children as R3F components
function ThreeBlock({ children }: any) {
  const canvasState = useCanvasStore()
  const canvasNode = useCanvasNode()
  const canvasStateRef = useRef() as React.MutableRefObject<CanvasContext>

  // render the r3f elements into the canvas
  useEffect(() => {
    if (canvasState && canvasNode.current) {
      canvasStateRef.current = canvasState
      render(
        <stateContext.Provider value={canvasState}>
          {typeof children === "function" ? children(canvasState) : children}
        </stateContext.Provider>,
        canvasNode.current,
        canvasStateRef
      )
    }
  })

  return null
}

interface BlockProps extends Partial<MotionProps> {
  children?: React.ReactNode
  three?: ((state: CanvasContext) => React.ReactNode) | React.ReactNode
  absolute?: boolean
}

// intermediary dom / r3f block
export function Block({ children, three, absolute, ...props }: BlockProps) {
  return (
    <motion.div className={`block ${absolute && "absolute"}`} {...props}>
      {children}
      {three && <ThreeBlock>{three}</ThreeBlock>}
    </motion.div>
  )
}

// Render three content into canvas & get canvas context
export function ThreeBlocks() {
  const grabbedCanvasState = useContext(stateContext)
  const { setCanvasState, getCanvasNodes } = useCanvasStoreThree()
  const canvasNodes = useState(getCanvasNodes())[0]

  useEffect(() => {
    if (setCanvasState) setCanvasState(grabbedCanvasState as CanvasContext)
  }, [grabbedCanvasState, setCanvasState])

  return (
    <>
      {Object.keys(canvasNodes).map(key => (
        <group key={key} ref={canvasNodes[key]} />
      ))}
    </>
  )
}
