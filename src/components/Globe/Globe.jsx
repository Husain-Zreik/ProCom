/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, OrbitControls, Stars, Text3D } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef } from 'react';
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from 'three';
import PropTypes from 'prop-types';
import earcut from 'earcut';
import { animated, useSpring } from '@react-spring/three';

// Function to load GeoJSON data lazily
const loadGeoJSON = async () => {
    const response = await fetch('/filtered.json'); // Ensure the correct path
    const data = await response.json();
    return data.features;
};

// Function to ensure counterclockwise winding order for polygons
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
    const [isDragging, setIsDragging] = useState(false); // State to track user interaction
    const radius = 1.7;
    const globeRef = useRef(); // Globe mesh ref
    const groupRef = useRef(); // Group ref to rotate both globe and land meshes
    const textRef = useRef();
    const landMeshesRef = useRef([]); // Ref for land meshes

    // Spring for smooth transitions
    const { scale, rotationSpeed } = useSpring({
        scale: isDragging ? 1.2 : 1.0, // Scale globe on interaction
        rotationSpeed: isDragging ? 0 : 0.002, // Stop rotation while dragging
        config: { tension: 200, friction: 20 },
    });

    // Fetch GeoJSON data lazily
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
                // Calculate the center offset based on bounding box size
                const offsetX = -(boundingBox.max.x + boundingBox.min.x) / 2;
                const offsetY = -(boundingBox.max.y + boundingBox.min.y) / 2;

                // Adjust position to center the text
                textRef.current.position.set(offsetX, offsetY, 0);
            }
        }
    }, [landData]);

    // Memoize simplified polygons to avoid recalculating
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
        const phi = (lat / 180) * Math.PI; // Latitude to radians
        const theta = (lon / 180) * Math.PI; // Longitude to radians

        const x = radius * Math.cos(phi) * Math.sin(theta);
        const y = radius * Math.sin(phi);
        const z = radius * Math.cos(phi) * Math.cos(theta);

        const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        return [(x / length) * radius, (y / length) * radius, (z / length) * radius];
    };

    const landMeshes = useMemo(() => {
        const meshes = [];

        // eslint-disable-next-line no-unused-vars
        simplifiedPolygons.forEach(({ countryName, polygons }) => {
            polygons.forEach((polygon) => {
                let color = '#8e1b3d'; // Default color for land (matches main website color)

                // Flatten the polygon to a 2D array for triangulation
                const flatPolygon = polygon.flat();
                const earcutIndices = earcut(flatPolygon);

                // Convert 2D points to 3D vertices
                const vertices = [];
                polygon.forEach(([lon, lat]) => {
                    vertices.push(...convertToSphereCoords(lon, lat, radius));
                });

                // Create BufferGeometry
                const geometry = new BufferGeometry();
                geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
                geometry.setIndex(earcutIndices);
                geometry.computeVertexNormals();

                meshes.push({
                    geometry,
                    color,
                });
            });
        });

        return meshes;
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
            {/* Lights */}
            <ambientLight intensity={1.5} color="white" /> {/* Bright ambient light for uniform lighting */}

            {/* Soft directional light to highlight the globe */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                color="#ffffff"
            />

            {/* Stars */}
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

            {/* Create the 3D globe (sphere) */}
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
                        color="#1b3d8e" // Updated to a deep blue shade
                        emissive="#11275b" // A complementary subtle glow color
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

                {/* Render land meshes */}
                {landMeshes.map((mesh, index) => (
                    <mesh
                        key={index}
                        geometry={mesh.geometry}
                        ref={(el) => (landMeshesRef.current[index] = el)}
                    >
                        <animated.meshStandardMaterial
                            color={mesh.color}
                            side={DoubleSide}
                            // polygonOffset={true}
                            // polygonOffsetFactor={-1}
                            // polygonOffsetUnits={-4}
                            // transparent={isDragging}
                            opacity={0.2}
                            roughness={0.7}
                            // metalness={0.1}
                            clearcoat={1.0}
                            clearcoatRoughness={0.2}
                            wireframe={isDragging}

                        />
                    </mesh>
                ))}

                <Billboard>
                    <Text3D ref={textRef}
                        font="/Fonts/Poppins/Poppins_Regular.json"
                        size={0.45}
                        height={0.01}
                        bevelEnabled={true}
                        bevelThickness={0.02}
                        bevelSize={0.02}
                        bevelSegments={8}
                        curveSegments={5}
                        castShadow={true}
                    >
                        ProCom
                        <meshStandardMaterial
                            color="white"
                            roughness={0.6}
                            metalness={0.4}
                            emissive="#11275b"
                            emissiveIntensity={0.2} />

                    </Text3D>
                    {/* Add a point light near the 3D text */}
                    <pointLight
                        position={[0, -0, 1]} // Adjust the position to ensure it follows the text
                        intensity={5} // Brightness of the light
                        color="white" // Light color
                        decay={3} // How quickly the light fades over distance
                    />
                </Billboard>
            </animated.group>

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={1}
                maxDistance={5}
            />
            <RotatingGlobe groupRef={groupRef} rotationSpeed={rotationSpeed} />
        </Canvas>
    );
};

// Rotating Globe Component
const RotatingGlobe = ({ groupRef, rotationSpeed }) => {
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed.get(); // Rotate along the Y-axis
        }
    });

    return null; // This component doesn't need to render anything
};

// Add prop validation for groupRef
RotatingGlobe.propTypes = {
    groupRef: PropTypes.object.isRequired,
    rotationSpeed: PropTypes.object.isRequired,
};

export default Globe;
