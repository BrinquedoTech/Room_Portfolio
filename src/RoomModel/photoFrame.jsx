import { useTexture } from '@react-three/drei';
import React, { useMemo } from 'react';
import * as THREE from 'three';

const PHOTO_CONFIG = [
    {
        key: 'family',
        source: './assets/room-photos/bluey-heeler-family.jpg',
        position: [-0.42, 0, 0.018],
        crop: { repeat: [1, 0.62], offset: [0, 0.18] }
    },
    {
        key: 'bingo-chilli',
        source: './assets/room-photos/bluey-bingo-chilli.jpg',
        position: [0.42, 0, 0.018],
        crop: { repeat: [1, 0.64], offset: [0, 0.18] }
    }
];

const PhotoFrame = React.memo(({ nodes }) => {
    const familyPhoto = useTexture(PHOTO_CONFIG[0].source);
    const bingoChilliPhoto = useTexture(PHOTO_CONFIG[1].source);

    const photos = useMemo(() => {
        return [familyPhoto, bingoChilliPhoto].map((texture, index) => {
            const { crop } = PHOTO_CONFIG[index];
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(...crop.repeat);
            texture.offset.set(...crop.offset);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            return texture;
        });
    }, [bingoChilliPhoto, familyPhoto]);

    return (
        <group
            position={nodes.frame.position}
            rotation={nodes.frame.rotation}
            name="bluey-photo-frames"
        >
            <mesh geometry={nodes.frame.geometry} name="photo-frame-borders">
                <meshStandardMaterial
                    color="#8f5d3d"
                    roughness={0.72}
                    metalness={0.02}
                />
            </mesh>
            {PHOTO_CONFIG.map((photo, index) => (
                <mesh key={photo.key} position={photo.position} name={`photo-${photo.key}`}>
                    <planeGeometry args={[0.62, 0.72]} />
                    <meshBasicMaterial
                        map={photos[index]}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
});

export default PhotoFrame;

useTexture.preload(PHOTO_CONFIG[0].source);
useTexture.preload(PHOTO_CONFIG[1].source);
