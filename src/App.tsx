import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, Debug, usePlane, useCompoundBody } from '@react-three/cannon';
import * as THREE from 'three'


//CREATING AN FPS COMPONENT
type FPSDriverProps = {
    onUpdate: (fps: number) => void;
}
const FPSDriver: React.FC<FPSDriverProps> = ({ onUpdate }) => {
    const lastFrame = useRef(performance.now());
    const frames = useRef<number[]>([]);
    
    useFrame(() => {
        const now = performance.now();
        const delta = now - lastFrame.current;
        lastFrame.current = now;

        const currentFps = 1000 / delta;
        frames.current.push(currentFps);

        //Keep only the last 60 frame measurements for a smooth average
        if (frames.current.length > 60) {
            frames.current.shift();
        }

        const avgFps = frames.current.reduce((a, b) => a + b, 0) / frames.current.length;

        //Report the FPS
        onUpdate(avgFps);
    });

    return null;
}

type FPSDisplayProps = {
    fps: number;
}

const FPSDisplay: React.FC<FPSDisplayProps> = ({ fps }) => {
    const indicatorColor = fps < 55 ? "bg-red-500" : "bg-gray-800";
    
    return (
        <div
            className={`absolute top-4 right-4 ${indicatorColor} text-white p-2 rounded-lg shadow-lg font-mono text-sm z-50 transition-colors duration-300 pointer-events-none`}
        >
            {fps.toFixed(1)} 
        </div>
    );
}





//plane 
type PlaneProps = {
  rotation?: [number, number, number]
  position?: [number, number, number]
}

function Plane(props: PlaneProps) {
  const [ref] = usePlane(() => ({ type: 'Static', ...props }))
  return (
    <mesh receiveShadow ref={ref as React.Ref<THREE.Mesh>}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial attach="material" color="#ffb385" />
    </mesh>
  )
}


//physics body
type PhysicsBodyProps = {
  position: [number, number, number]
  rotation: [number, number, number]
}

function PhysicsBody({ position, rotation }: PhysicsBodyProps) {
  const [ref] = useCompoundBody(() => ({
    mass: 12,
    position,
    rotation,
    shapes: [
      { type: 'Box', position: [0, 0, 0], rotation: [0, 0, 0], args: [1, 1, 1] },
      { type: 'Sphere', position: [1, 0, 0], rotation: [0, 0, 0], args: [0.65] },
    ],
  }))
  return (
    <group ref={ref as React.Ref<THREE.Group>}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
      <mesh receiveShadow castShadow position={[1, 0, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  )
}


//grasvity on plane
type GravityMeshProps = {
  position: [number, number, number]
  rotation: [number, number, number]
  running: boolean
}

function GravityMesh({ position: initialPos, rotation, running }: GravityMeshProps) {
  const [pos, setPos] = useState<[number, number, number]>(initialPos)
  const velocity = useRef<[number, number, number]>([0, 0, 0])

  useFrame((_, delta) => {
    if (!running) return
    velocity.current[1] -= 9.81 * delta
    setPos((p) => [p[0], p[1] + velocity.current[1] * delta, p[2]])
  })

  return (
    <group position={pos} rotation={rotation}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
      <mesh receiveShadow castShadow position={[1, 0, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  )
}



//app
export default function App() {
  const [selection, setSelection] = useState<boolean[]>([true, true, false]) 
  const [running, setRunning] = useState(false) 
  const [flag, setFlag] = useState(false) 
  const [restartKey, setRestartKey] = useState(0) //setting the state for fps
  const [currentFps, setCurrentFps] = useState(60); //state for fps

  //reset @ every restart
  useEffect(() => {
    if (running) {
      setFlag(false)
      const timer = setTimeout(() => setFlag(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [running, restartKey])

  const objects: { position: [number, number, number]; rotation: [number, number, number] }[] = [
    { position: [1.5, 5, 0.5], rotation: [1.25, 0, 0] },
    { position: [2.5, 3, 0.25], rotation: [1.25, -1.25, 0] },
    { position: [2.5, 4, 0.25], rotation: [1.25, -1.25, 0] },
  ]

  const handleRestart = () => {
    setRunning(false)
    setRestartKey((k) => k + 1)
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <FPSDisplay fps={currentFps} />  
        {selection.map((enabled, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={enabled}
              disabled={running}
              onChange={() =>
                setSelection((sel) => {
                  const newSel = [...sel]
                  newSel[i] = !newSel[i]
                  return newSel
                })
              }
            />
            Physics # {i + 1}
          </label>
        ))}
        {!running ? (
          <button onClick={() => setRunning(true)}>START</button>
        ) : (
          <button onClick={handleRestart}>RESTART</button>
        )}
      </div>

      
      <Canvas
        key={restartKey}
        dpr={[1, 2]}
        shadows
        gl={{ alpha: false }}
        camera={{ position: [-2, 1, 7], fov: 50 }}
      >
        <FPSDriver onUpdate={setCurrentFps} />   //updating the fps when the sim runs
        <color attach="background" args={['#f6d186']} />
        <hemisphereLight intensity={1} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.75}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={1028}
          shadow-mapSize-height={1028}
        />
        <Physics iterations={6}>
          <Debug scale={1.1} color="black">
            <Plane rotation={[-Math.PI / 2, 0, 0]} />

            {objects.map((obj, i) => {
              if (i === 2 && !flag) return null

              return running ? (
                selection[i] ? (
                  <PhysicsBody key={i} position={obj.position} rotation={obj.rotation} />
                ) : (
                  <GravityMesh key={i} position={obj.position} rotation={obj.rotation} running={running} />
                )
              ) : (
                <GravityMesh key={i} position={obj.position} rotation={obj.rotation} running={false} />
              )
            })}
          </Debug>
        </Physics>
      </Canvas>
    </>
//FPS CANNOT BE UNDER <DIV/> OR CANVAS HOOKS ERRORS
  )
}
