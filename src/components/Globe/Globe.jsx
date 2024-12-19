/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei';
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

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

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
    const radius = 1.5;
    const globeRef = useRef(); // Globe mesh ref
    const groupRef = useRef(); // Group ref to rotate both globe and land meshes
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

        simplifiedPolygons.forEach(({ countryName, polygons }) => {
            polygons.forEach((polygon) => {
                let color = 'green'; // Default color
                if (countryName === 'Qatar') color = 'purple';
                if (countryName === 'Lebanon') color = 'red';
                if (countryName === 'Cyprus') color = 'white';

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
        <>
            <div>
                <button>HI</button>
            </div>
            <Canvas shadows>
                {/* Lights */}
                <ambientLight intensity={0.2} color="white" /> {/* Dim ambient light */}

                {/* Directional lights for dynamic shading */}
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.0}
                    color="white"
                    castShadow
                />
                <directionalLight
                    position={[-5, -5, -5]}
                    intensity={0.6}
                    color="white"
                    castShadow
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
                    <animated.mesh ref={globeRef} castShadow>
                        <animated.sphereGeometry args={[1.42, 128, 128]} />
                        <AnimatedMeshDistortMaterial
                            speed={2}               // Animation speed
                            distort={0.2}           // Distortion intensity
                            color="#0077be"             // Base color of the material
                            emissive="#005b7f"          // Emissive color for glow effect
                            emissiveIntensity={0.9}     // Intensity of the emissive color
                            opacity={0.9}               // Transparency level
                            roughness={0.9}             // Surface roughness
                            // metalness={0.4}             // Reflectivity level
                            transparent={true}          // Enables transparency
                        />

                        {/* <meshStandardMaterial
                            color="#10294e"
                            opacity={0.8}
                        // transparent
                        // metalness={0.5}
                        // roughness={0.2}
                        /> */}
                    </animated.mesh>


                    {/* Render land meshes */}
                    {landMeshes.map((mesh, index) => (
                        <mesh
                            key={index}
                            geometry={mesh.geometry}
                            ref={(el) => (landMeshesRef.current[index] = el)} // Store references to each land mesh
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                mesh.color = 'white'; // Highlight color on hover
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                mesh.color = 'green'; // Reset color
                            }}
                        >
                            <meshStandardMaterial
                                color={mesh.color}
                                side={DoubleSide}
                            // polygonOffset={true}
                            // polygonOffsetFactor={-1}
                            // polygonOffsetUnits={-4}
                            />
                        </mesh>
                    ))}
                </animated.group>

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={1}
                    maxDistance={5}
                />
                <RotatingGlobe groupRef={groupRef} rotationSpeed={rotationSpeed} />
            </Canvas>
        </>

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
