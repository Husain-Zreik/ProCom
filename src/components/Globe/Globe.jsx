/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef } from 'react';
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from 'three';
import * as turf from '@turf/turf';
import PropTypes from 'prop-types';  // Import PropTypes
import earcut from 'earcut'; // Import earcut as an ES module


// Function to load GeoJSON data lazily
const loadGeoJSON = async () => {
    const response = await fetch('/filtered.json'); // Ensure the correct path
    const data = await response.json();
    return data.features;
};

const Globe = () => {
    const [landData, setLandData] = useState([]);
    const radius = 1.5;
    const globeRef = useRef(); // Globe mesh ref
    const groupRef = useRef(); // Group ref to rotate both globe and land meshes
    const landMeshesRef = useRef([]); // Ref for land meshes

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
                polygons.push(feature.geometry.coordinates[0]);
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((multiPolygon) => {
                    polygons.push(multiPolygon[0]);
                });
            }

            return { countryName: feature.properties.sovereign, polygons };
        });
    }, [landData]);

    // Updated landMeshes computation with better triangulation
    const landMeshes = useMemo(() => {
        const meshes = [];

        simplifiedPolygons.forEach(({ countryName, polygons }) => {
            polygons.forEach((polygon) => {
                // Assign color based on country
                let color = 'green'; // Default color for other countries
                if (countryName === 'Qatar') color = 'purple';
                if (countryName === 'Lebanon') color = 'red';
                if (countryName === 'Cyprus') color = 'white';

                const vertices = [];
                const indices = [];

                // Use earcut for proper triangulation of polygons
                const turfPolygon = turf.polygon([polygon]);
                const points = turf.coordAll(turfPolygon);

                // Map geographic coordinates (lon, lat) to 3D sphere coordinates
                points.forEach(([lon, lat]) => {
                    const phi = (lat / 180) * Math.PI; // Latitude to radians
                    const theta = (lon / 180) * Math.PI; // Longitude to radians

                    const x = radius * Math.cos(phi) * Math.sin(theta);
                    const y = radius * Math.sin(phi);
                    const z = radius * Math.cos(phi) * Math.cos(theta);

                    vertices.push(x, y, z);
                });

                // Perform triangulation on 2D polygon points to generate face indices
                const flatPolygon = polygon.flat(); // Flatten for triangulation
                const earcutIndices = earcut(flatPolygon); // Using earcut for triangulation

                // Copy indices from earcut to the 3D geometry
                earcutIndices.forEach((index) => indices.push(index));

                // Create BufferGeometry for the polygon
                const geometry = new BufferGeometry();
                geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);
                geometry.computeVertexNormals();

                meshes.push({
                    geometry,
                    color,
                });
            });
        });

        return meshes;
    }, [simplifiedPolygons, radius]);


    // Update meshes positions to face outward
    useEffect(() => {
        // Use requestAnimationFrame for smooth updates
        const updateMeshPositions = () => {
            landMeshesRef.current.forEach((mesh) => {
                if (mesh) {
                    const pos = mesh.position;
                    const normal = pos.clone().normalize();
                    mesh.lookAt(pos.x + normal.x, pos.y + normal.y, pos.z + normal.z);  // Make the circle face outward
                }
            });
        };

        const frameId = requestAnimationFrame(updateMeshPositions);
        return () => cancelAnimationFrame(frameId);
    }, [landMeshes]); // Depend on landMeshes to update positions

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

            {/* Create the 3D globe (sphere) */}
            <group ref={groupRef}>
                <mesh ref={globeRef}>
                    <sphereGeometry args={[1.5, 64, 64]} />
                    <meshStandardMaterial color="lightblue" opacity={0.5} transparent={true} />                </mesh>

                {/* Render land meshes */}
                {landMeshes.map((mesh, index) => (
                    <mesh
                        key={index}
                        geometry={mesh.geometry}
                        ref={(el) => landMeshesRef.current[index] = el}  // Store references to each land mesh
                    >
                        <meshStandardMaterial color={mesh.color} side={DoubleSide} />
                    </mesh>
                ))}
            </group>

            <OrbitControls enableZoom={true} enablePan={false} minDistance={1} maxDistance={5} />
            <RotatingGlobe groupRef={groupRef} />
        </Canvas>
    );
};

// This component uses the `useFrame` hook inside the Canvas context to rotate the whole group
const RotatingGlobe = ({ groupRef }) => {
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002; // Rotate along the Y axis for continuous rotation
        }
    });

    return null; // This component doesn't need to render anything
};

// Add prop validation for groupRef
RotatingGlobe.propTypes = {
    groupRef: PropTypes.object.isRequired, // Ensure groupRef is passed and is an object (a reference)
};

export default Globe;
