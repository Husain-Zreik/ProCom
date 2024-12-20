/* eslint-disable react/no-unknown-property */
import { DoubleSide, BufferGeometry, Float32BufferAttribute, Color } from 'three';
import { Billboard, OrbitControls, Stars, Text3D } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { Canvas, useFrame } from '@react-three/fiber';
import PropTypes from 'prop-types';
import earcut from 'earcut';

const loadGeoJSON = async () => {
    const response = await fetch('/filtered.json');
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
                let color = '#8e1b3d';
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
        <Canvas>
            <ambientLight intensity={1.5} color="white" />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

            <animated.group
                ref={groupRef}
                scale={scale}
                onPointerOver={handlePointerOver}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <mesh ref={globeRef}>
                    <sphereGeometry args={[1.62, 128, 128]} />
                    <meshStandardMaterial
                        color="#1b3d8e"
                        emissive="#11275b"
                        emissiveIntensity={0.2}
                        transparent={true}
                        opacity={0.2}
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
                    <Text3D ref={textRef} font="/Fonts/Poppins/Poppins_Regular.json" size={0.45} height={0.01} bevelEnabled>
                        ProCom
                        <meshStandardMaterial
                            color="white"
                            roughness={0.6}
                            metalness={0.4}
                            emissive="#11275b"
                            emissiveIntensity={0.2}
                        />
                    </Text3D>
                    <pointLight
                        position={[0, -0, 1]}
                        intensity={5}
                        color="white"
                        decay={3}
                    />
                </Billboard>
            </animated.group>

            <OrbitControls enableZoom={true} enablePan={false} minDistance={1} maxDistance={5} />
            <RotatingGlobe groupRef={groupRef} rotationSpeed={rotationSpeed} />
        </Canvas>
    );
};

const AnimatedLandMesh = forwardRef(({ geometry, initialColor, isDragging }, ref) => {
    const materialRef = useRef();
    const pointsRef = useRef([[], []]);
    const [pulseGroup1, setPulseGroup1] = useState(1);
    const [pulseGroup2, setPulseGroup2] = useState(0);

    useEffect(() => {
        const pointsGroup1 = [];
        const pointsGroup2 = [];
        const vertices = geometry.attributes.position.array;
        const numPoints = 2;

        for (let i = 0; i < numPoints; i++) {
            const vertexIndex = Math.floor(Math.random() * (vertices.length / 2)) * 3;
            const x = vertices[vertexIndex];
            const y = vertices[vertexIndex + 1];
            const z = vertices[vertexIndex + 2];

            if (i % 2 === 0) {
                pointsGroup1.push([x, y, z]);
            } else {
                pointsGroup2.push([x, y, z]);
            }
        }

        pointsRef.current = [pointsGroup1, pointsGroup2];
    }, [geometry]);

    useFrame(() => {
        const time = performance.now() * 0.001;
        const pulseEffectGroup1 = (Math.sin(time * 2) + 1) / 2;
        const pulseEffectGroup2 = (Math.sin(time * 2 + Math.PI) + 1) / 2;

        setPulseGroup1(pulseEffectGroup1);
        setPulseGroup2(pulseEffectGroup2);
    });

    return (
        <mesh
            ref={ref}
            geometry={geometry}
            onPointerDown={() => {
                setPulseGroup1(1);
                setPulseGroup2(0);
            }}
            onPointerUp={() => {
                setPulseGroup1(0);
                setPulseGroup2(1);
            }}
        >
            <meshStandardMaterial
                ref={materialRef}
                color={initialColor}
                side={DoubleSide}
                roughness={0.7}
                clearcoat={1.0}
                clearcoatRoughness={0.2}
                wireframe={isDragging}
            />

            {pointsRef.current[0].map((point, index) => (
                <mesh key={`group1-${index}`} position={point}>
                    <sphereGeometry args={[0.005, 4, 4]} />
                    <meshStandardMaterial
                        color={new Color('#ffffff').lerp(new Color('#8e1b3d'), pulseGroup1)}
                        emissive="#ffffff"
                        emissiveIntensity={0.8}
                        roughness={0.6}
                        metalness={0.8}
                        transparent={true}
                        opacity={pulseGroup1}
                    />
                </mesh>
            ))}

            {pointsRef.current[1].map((point, index) => (
                <mesh key={`group2-${index}`} position={point}>
                    <sphereGeometry args={[0.005, 4, 4]} />
                    <meshStandardMaterial
                        color={new Color('#ffffff').lerp(new Color('#8e1b3d'), pulseGroup2)}
                        emissive="#ffffff"
                        emissiveIntensity={0.8}
                        roughness={0.6}
                        metalness={0.8}
                        transparent={true}
                        opacity={pulseGroup2}
                    />
                </mesh>
            ))}
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
