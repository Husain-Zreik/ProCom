/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BoxGeometry } from 'three';

const Globe = () => {
    // Create the globe's responsive cover using tiles
    const numRows = 40; // Number of rows of tiles
    const numCols = 80; // Number of columns of tiles

    // Define some basic landmass positions or use a simple land mask
    // Here we simulate the landmass with a simple random check or a defined mask
    const landTiles = useMemo(() => {
        const radius = 1.5; // Radius of the globe
        const landTiles = [];

        // Simulating land positions using a random check
        for (let lat = 0; lat < numRows; lat++) {
            for (let lon = 0; lon < numCols; lon++) {
                const phi = (lat / numRows) * Math.PI; // Latitude angle
                const theta = (lon / numCols) * (2 * Math.PI); // Longitude angle

                // Calculate spherical coordinates to cartesian coordinates
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);

                // Simulate land with a simple condition (replace with a more sophisticated mask if necessary)
                if (Math.random() > 0.7) { // 30% chance of being land
                    landTiles.push({ position: [x, y, z], rotation: [phi, theta, 0] });
                }
            }
        }

        return landTiles;
    }, [numRows, numCols]);

    return (
        <Canvas>
            {/* Lights for illumination */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

            {/* Render the globe as a sphere (without texture) */}
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} /> {/* Globe geometry */}
                <meshStandardMaterial color="lightblue" /> {/* Globe material with light blue color */}
            </mesh>

            {/* Render only tiles on land areas */}
            {landTiles.map((tile, index) => (
                <mesh key={index} position={tile.position} rotation={tile.rotation}>
                    {/* Adjust the size of the tiles to make them smaller */}
                    <primitive object={new BoxGeometry(0.05, 0.05, 0.05)} /> {/* Ultra small tiles */}
                    <meshStandardMaterial color="green" /> {/* Color for land tiles */}
                </mesh>
            ))}

            {/* Controls for rotating the globe */}
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={10}
            />
        </Canvas>
    );
};

export default Globe;
