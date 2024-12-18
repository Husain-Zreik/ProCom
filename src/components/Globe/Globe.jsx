/* eslint-disable react/no-unknown-property */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { DoubleSide } from 'three';
import * as turf from '@turf/turf';

// Function to load GeoJSON data
const loadGeoJSON = async () => {
    const response = await fetch('/filtered.json');  // Ensure the correct path
    const data = await response.json();
    return data.features;
};

const Globe = () => {
    const [landData, setLandData] = useState([]);
    const tileSize = 0.01;  // Tile size for circles
    const radius = 1.5;
    const baseSamplingDensity = 500;  // Base number of circles per country
    const maxSamplingDensity = 2500;  // Maximum number of circles for large countries
    const gapSize = 0.02;  // Gap size to reduce overlap
    const meshRefs = useRef([]); // Reference to store mesh objects

    // Fetch GeoJSON data
    useEffect(() => {
        const fetchData = async () => {
            const data = await loadGeoJSON();
            setLandData(data);
        };
        fetchData();
    }, []);

    // Function to generate random points inside a polygon and return 3D coordinates
    const generatePointsInPolygon = (polygon, samplingDensity) => {
        const points = [];
        // Simplify polygon for performance (reduce complexity)
        const simplified = turf.simplify(turf.polygon([polygon]), { tolerance: 0.01, highQuality: false });

        // Use bounding box to sample points randomly
        const bbox = turf.bbox(simplified); // Get bounding box [minX, minY, maxX, maxY]

        // Function to check if the point is far enough from existing points
        const isFarEnough = (newPoint) => {
            return points.every((point) => {
                const dx = newPoint[0] - point[0];
                const dy = newPoint[1] - point[1];
                const dz = newPoint[2] - point[2];
                return Math.sqrt(dx * dx + dy * dy + dz * dz) > gapSize;  // Ensure gap between points
            });
        };

        // Generate points inside the bounding box and check if they are inside the polygon
        for (let i = 0; i < samplingDensity; i++) {
            const randomPoint = turf.randomPoint(1, { bbox });
            if (turf.booleanPointInPolygon(randomPoint.features[0], simplified)) {
                const [lon, lat] = randomPoint.features[0].geometry.coordinates;
                const phi = (lat / 180) * Math.PI; // Latitude to radians
                const theta = (lon / 180) * Math.PI; // Longitude to radians

                // Adjust the axis conversion here for correct positioning
                const x = radius * Math.cos(phi) * Math.sin(theta); // Switch x and z axes
                const y = radius * Math.sin(phi);
                const z = radius * Math.cos(phi) * Math.cos(theta); // Correct the z-axis

                // Only add the point if it's far enough from existing points
                if (isFarEnough([x, y, z])) {
                    points.push([x, y, z]);
                }
            }
        }
        return points;
    };

    // Function to calculate the bounding box size and return adjusted sampling density
    const calculateBoundingBoxSize = (polygon) => {
        const bbox = turf.bbox(turf.polygon([polygon]));
        const width = bbox[2] - bbox[0];  // Longitude difference
        const height = bbox[3] - bbox[1]; // Latitude difference

        // Adjust sampling density based on the bounding box size
        const size = Math.max(width, height);
        let adjustedSamplingDensity = baseSamplingDensity;

        if (size > 30) { // Larger bounding box (e.g., large countries)
            adjustedSamplingDensity = Math.min(baseSamplingDensity * 3, maxSamplingDensity); // Increase density for large countries
        }

        return adjustedSamplingDensity;
    };

    const landTiles = useMemo(() => {
        if (!landData || !landData.length) return [];

        const tiles = [];

        landData.forEach((feature) => {
            const polygons = [];
            let samplingDensity = baseSamplingDensity;

            // If the feature is a Polygon, process it directly
            if (feature.geometry.type === 'Polygon') {
                polygons.push(feature.geometry.coordinates[0]);
            }
            // If the feature is a MultiPolygon, process each individual polygon
            else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((multiPolygon) => {
                    polygons.push(multiPolygon[0]);
                });
            }

            polygons.forEach((polygon) => {
                // Calculate bounding box size and adjust sampling density
                samplingDensity = calculateBoundingBoxSize(polygon);

                // Validate and close polygons with fewer than 4 points
                if (polygon.length < 4) return;  // Skip polygons with fewer than 4 points

                // Ensure the polygon is closed (first and last point must be the same)
                if (polygon[0][0] !== polygon[polygon.length - 1][0] || polygon[0][1] !== polygon[polygon.length - 1][1]) {
                    polygon.push(polygon[0]);  // Close the polygon by adding the first point at the end
                }

                // Generate the points within the polygon
                const pointsInPolygon = generatePointsInPolygon(polygon, samplingDensity);

                // Assign color based on country
                const countryName = feature.properties.sovereign; // Assuming name property in GeoJSON
                let color = "green"; // Default color for other countries

                // Assign specific colors for Qatar, Lebanon, and Cyprus
                if (countryName === "Qatar") {
                    color = "purple";
                } else if (countryName === "Lebanon") {
                    color = "red";
                } else if (countryName === "Cyprus") {
                    color = "white";
                }

                pointsInPolygon.forEach((point) => {
                    tiles.push({ position: point, color });
                });
            });
        });

        return tiles;
    }, [landData]);

    // Update rotation of circles to always face outward (towards the camera or globe center)
    useEffect(() => {
        // Loop through all mesh references to update their orientation dynamically
        meshRefs.current.forEach((mesh) => {
            if (mesh) {
                const pos = mesh.position;
                // Calculate normal vector for this point (circle should be parallel to this vector)
                const normal = pos.clone().normalize();  // Normalize to get the direction vector
                mesh.lookAt(pos.x + normal.x, pos.y + normal.y, pos.z + normal.z);  // Make the circle face outward
            }
        });
    }, [landTiles]);

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial color="lightblue" opacity={0.5} transparent={true} />
            </mesh>

            {landTiles.map((tile, index) => (
                <mesh
                    key={index}
                    position={tile.position}
                    ref={(el) => (meshRefs.current[index] = el)}  // Store reference to each circle
                >
                    <circleGeometry args={[tileSize, 32]} />
                    <meshStandardMaterial color={tile.color} side={DoubleSide} />
                </mesh>
            ))}

            <OrbitControls enableZoom={true} enablePan={false} minDistance={1} maxDistance={5} />
        </Canvas>
    );
};

export default Globe;
