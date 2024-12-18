/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, useCallback } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { Canvas, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'

// Animated MeshDistortMaterial
const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial)

const MyScene = () => {
    const isOver = useRef(false)

    // Get screen size for pointer movement
    const { width, height } = useThree(state => state.size)

    const [springs, api] = useSpring(
        () => ({
            scale: 1,
            position: [0, 0],
            color: '#ff6d6d',
            config: key => {
                switch (key) {
                    case 'scale':
                        return { mass: 4, friction: 10 }
                    case 'position':
                        return { mass: 4, friction: 220 }
                    default:
                        return {}
                }
            },
        }),
        []
    )

    // Handle click interaction
    const handleClick = useCallback(() => {
        let clicked = false
        return () => {
            clicked = !clicked
            api.start({
                color: clicked ? '#569AFF' : '#ff6d6d',
            })
        }
    }, [])

    // Handle pointer interactions
    const handlePointerEnter = () => {
        api.start({ scale: 1.5 })
    }

    const handlePointerLeave = () => {
        api.start({ scale: 1 })
    }

    const handleWindowPointerOver = useCallback(() => {
        isOver.current = true
    }, [])

    const handleWindowPointerOut = useCallback(() => {
        isOver.current = false
        api.start({ position: [0, 0] })
    }, [])

    const handlePointerMove = useCallback(
        (e) => {
            if (isOver.current) {
                const x = (e.offsetX / width) * 2 - 1
                const y = (e.offsetY / height) * -2 + 1
                api.start({ position: [x * 5, y * 2] })
            }
        },
        [api, width, height]
    )

    // Add event listeners
    useEffect(() => {
        window.addEventListener('pointerover', handleWindowPointerOver)
        window.addEventListener('pointerout', handleWindowPointerOut)
        window.addEventListener('pointermove', handlePointerMove)

        return () => {
            window.removeEventListener('pointerover', handleWindowPointerOver)
            window.removeEventListener('pointerout', handleWindowPointerOut)
            window.removeEventListener('pointermove', handlePointerMove)
        }
    }, [handleWindowPointerOver, handleWindowPointerOut, handlePointerMove])

    return (
        <animated.mesh
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick()}
            scale={springs.scale}
            position={springs.position.to((x, y) => [x, y, 0])}
        >
            {/* Corrected: Use geometry prop instead of passing args */}
            <sphereGeometry attach="geometry" args={[1.5, 64, 32]} />
            <AnimatedMeshDistortMaterial
                speed={5}
                distort={0.5}
                color={springs.color}
            />
        </animated.mesh>
    )
}

export default function MyComponent() {
    return (
        <Canvas>
            <ambientLight intensity={0.8} />
            <pointLight intensity={1} position={[0, 6, 0]} />
            <MyScene />
        </Canvas>
    )
}
