/* eslint-disable react/no-unknown-property */
import { DoubleSide, BufferGeometry, Float32BufferAttribute, Color, TextureLoader } from 'three';
import { Billboard, OrbitControls, Stars } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import PropTypes from 'prop-types';
import earcut from 'earcut';

const loadGeoJSON = async () => {
    const response = await fetch('/geo.json');
    const data = await response.json();
    return data.features;
};

const ensureCounterClockwise = (polygon) => {
    let sum = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
        const [x1, y1] = polygon[i];
        const [x2, y2] = polygon[i + 1];
        sum += (x2 - x1) * (y2 + y1);
    }
    return sum > 0 ? polygon.reverse() : polygon;
};

const Globe = () => {
    const [landData, setLandData] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [globeMaxSize, setGlobeMaxSize] = useState(4);
    const [globeMinSize, setGlobeMinSize] = useState(3, 5);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const radius = 1.7;
    const globeRef = useRef();
    const groupRef = useRef();
    const textRef = useRef();
    const landMeshesRef = useRef([]);

    const { scale, rotationSpeed } = useSpring({
        scale: isDragging ? 1.2 : 1.0,
        rotationSpeed: isDragging ? 0 : 0.002,
        config: { tension: 200, friction: 20 },
    });

    useEffect(() => {
        const updateStyle = () => {
            if (window.innerWidth < 428) {
                setIsSmallScreen(true);
                setGlobeMaxSize(7);
                setGlobeMinSize(5.5);
            }
            else if (window.innerWidth < 768) {
                setGlobeMaxSize(7);
                setGlobeMinSize(5.5);
            }
            else {
                // Default position for larger screens
                setGlobeMaxSize(3.8);
                setGlobeMinSize(2);
                setIsSmallScreen(false);
            }
        };

        updateStyle();

        window.addEventListener('resize', updateStyle);

        return () => window.removeEventListener('resize', updateStyle);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadGeoJSON();
            setLandData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.geometry.computeBoundingBox();
            const boundingBox = textRef.current.geometry.boundingBox;

            if (boundingBox) {
                const offsetX = -(boundingBox.max.x + boundingBox.min.x) / 2;
                const offsetY = -(boundingBox.max.y + boundingBox.min.y) / 2;
                textRef.current.position.set(offsetX, offsetY, 0);
            }
        }
    }, [landData]);

    const simplifiedPolygons = useMemo(() => {
        return landData.map((feature) => {
            const polygons = [];
            if (feature.geometry.type === 'Polygon') {
                polygons.push(ensureCounterClockwise(feature.geometry.coordinates[0]));
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((multiPolygon) => {
                    polygons.push(ensureCounterClockwise(multiPolygon[0]));
                });
            }
            return { countryName: feature.properties.sovereign, polygons };
        });
    }, [landData]);

    const convertToSphereCoords = (lon, lat, radius) => {
        const phi = (lat / 180) * Math.PI;
        const theta = (lon / 180) * Math.PI;
        const x = radius * Math.cos(phi) * Math.sin(theta);
        const y = radius * Math.sin(phi);
        const z = radius * Math.cos(phi) * Math.cos(theta);
        const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        return [(x / length) * radius, (y / length) * radius, (z / length) * radius];
    };

    const landMeshes = useMemo(() => {
        // eslint-disable-next-line no-unused-vars
        return simplifiedPolygons.flatMap(({ countryName, polygons }) => {
            return polygons.map((polygon) => {
                let color = '#8A1538';
                const flatPolygon = polygon.flat();
                const earcutIndices = earcut(flatPolygon);

                const vertices = polygon.map(([lon, lat]) => convertToSphereCoords(lon, lat, radius)).flat();

                const geometry = new BufferGeometry();
                geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
                geometry.setIndex(earcutIndices);
                geometry.computeVertexNormals();

                return { geometry, color };
            });
        });
    }, [simplifiedPolygons, radius]);

    const handlePointerOver = () => {
        document.body.style.cursor = 'grab';
    };

    const handlePointerDown = () => {
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'grab';
    };

    return (
        <Canvas
            className="globe-canvas"
            onPointerLeave={() => document.body.style.cursor = 'default'}
        >
            <ambientLight intensity={1.5} color="white" />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />

            <animated.group
                ref={groupRef}
                scale={scale}
                onPointerOver={handlePointerOver}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                {!isSmallScreen && (
                    <Stars
                        radius={250}
                        depth={40}
                        count={2000}
                        factor={10}
                        saturation={0}
                        fade
                    />
                )}
                <mesh ref={globeRef}>
                    <sphereGeometry args={[1.62, 80, 80]} />
                    <meshStandardMaterial
                        color="#121212"
                        emissive="black"
                        emissiveIntensity={0.9}
                        transparent={true}
                        opacity={0.15}
                        roughness={0.5}
                        metalness={0.8}
                        clearcoat={1.0}
                        clearcoatRoughness={0.2}
                        wireframe={true}

                    />
                </mesh>

                {landMeshes.map((mesh, index) => (
                    <AnimatedLandMesh
                        key={index}
                        geometry={mesh.geometry}
                        initialColor={mesh.color}
                        ref={(el) => (landMeshesRef.current[index] = el)}
                        isDragging={isDragging}
                    />
                ))}

                <Billboard>
                    <mesh
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={[1.3, 1.5, 0]}
                    >
                        <planeGeometry args={[1, 1]} />
                        <meshBasicMaterial
                            map={useLoader(TextureLoader, '/PRC-Logo/Globe-logo.svg')}
                            transparent={true}
                            side={DoubleSide}


                        />
                    </mesh>
                </Billboard>

            </animated.group>

            <OrbitControls enableZoom={false} enablePan={false} minDistance={globeMinSize} maxDistance={globeMaxSize} />
            <RotatingGlobe groupRef={groupRef} rotationSpeed={rotationSpeed} />
        </Canvas>
    );
};

const AnimatedLandMesh = forwardRef(({ geometry, initialColor, isDragging }, ref) => {
    const materialRef = useRef();

    useFrame(() => {
        if (materialRef.current) {
            const time = performance.now() * 0.001;
            const t = (Math.sin(time) + 1) / 2;

            // const color1 = new Color('#8A1538');
            const color1 = new Color('rgb(204, 32, 83)');
            const color2 = new Color('#db0042');

            materialRef.current.color.lerpColors(color1, color2, t);
        }
    });

    return (
        <mesh ref={ref} geometry={geometry}>
            <meshStandardMaterial
                ref={materialRef}
                color={initialColor}
                side={DoubleSide}
                roughness={0.7}
                clearcoat={1.0}
                clearcoatRoughness={0.2}
                wireframe={isDragging}
            />
        </mesh>
    );
});

AnimatedLandMesh.displayName = 'AnimatedLandMesh';

AnimatedLandMesh.propTypes = {
    geometry: PropTypes.object.isRequired,
    initialColor: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
};

const RotatingGlobe = ({ groupRef, rotationSpeed }) => {
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed.get();
        }
    });

    return null;
};

RotatingGlobe.propTypes = {
    groupRef: PropTypes.object.isRequired,
    rotationSpeed: PropTypes.object.isRequired,
};

export default Globe;
