import { useTexture } from '@react-three/drei';
import React, { useMemo } from 'react';
import * as THREE from 'three';

const PHOTO_CONFIG = [
    {
        key: 'family',
        source: './assets/room-photos/bluey-heeler-family.jpg',
        // Geometry-local corners of the larger, lower shelf photo recess in RoomModel.glb.
        corners: [
            [1.296, 2.2304, 2.1403],
            [1.7177, 2.2304, 2.1936],
            [1.3098, 1.7108, 2.0304],
            [1.7315, 1.7108, 2.0837]
        ],
        crop: { repeat: [1, 0.69], offset: [0, 0.28] },
        mirrored: true
    },
    {
        key: 'bingo-chilli-upper',
        source: './assets/room-photos/bluey-bingo-chilli.jpg',
        // The upper frame was left empty in the original scene. Its recess is
        // the second quad of the frame mesh, with a portrait-like crop.
        corners: [
            [-1.1678, 2.9135, 0.7844],
            [-0.9085, 2.9138, 0.9175],
            [-1.1154, 2.5047, 0.6834],
            [-0.8561, 2.5050, 0.8163]
        ],
        crop: { repeat: [1, 0.74], offset: [0, 0.22] },
        mirrored: true
    },
    {
        key: 'bingo-chilli',
        source: './assets/room-photos/bluey-bingo-chilli.jpg',
        // Geometry-local corners of the smaller photo recess beside it.
        corners: [
            [0.9857, 2.0019, 1.8246],
            [1.1671, 2.0019, 2.0083],
            [1.0335, 1.6862, 1.7774],
            [1.2151, 1.6862, 1.9611]
        ],
        crop: { repeat: [1, 0.98], offset: [0, 0.01] },
        mirrored: true
    }
];

const createPhotoGeometry = (corners, mirrored, crop) => {
    const [topLeft, topRight, bottomLeft, bottomRight] = corners.map(
        (point) => new THREE.Vector3(...point)
    );
    const normal = topRight.clone().sub(topLeft)
        .cross(bottomLeft.clone().sub(topLeft))
        .normalize();
    const offsetCorners = [topLeft, topRight, bottomLeft, bottomRight]
        .map((point) => point.addScaledVector(normal, 0.008));
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(offsetCorners.flatMap((point) => point.toArray()), 3)
    );
    geometry.setAttribute(
        'uv',
        new THREE.Float32BufferAttribute(
            (mirrored ? [1, 1, 0, 1, 1, 0, 0, 0] : [0, 1, 1, 1, 0, 0, 1, 0])
                .map((coordinate, index) => coordinate * crop.repeat[index % 2] + crop.offset[index % 2]),
            2
        )
    );
    geometry.setIndex([0, 1, 2, 1, 3, 2]);
    geometry.computeVertexNormals();

    return geometry;
};

const PhotoFrame = React.memo(({ nodes }) => {
    const familyPhoto = useTexture(PHOTO_CONFIG[0].source);
    const bingoChilliUpperPhoto = useTexture(PHOTO_CONFIG[1].source);
    const bingoChilliPhoto = useTexture(PHOTO_CONFIG[2].source);

    const photos = useMemo(() => {
        return [familyPhoto, bingoChilliUpperPhoto, bingoChilliPhoto].map((texture, index) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(1, 1);
            texture.offset.set(0, 0);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            texture.needsUpdate = true;
            return texture;
        });
    }, [bingoChilliPhoto, bingoChilliUpperPhoto, familyPhoto]);
    const photoGeometries = useMemo(
        () => PHOTO_CONFIG.map(({ corners, mirrored, crop }) => createPhotoGeometry(corners, mirrored, crop)),
        []
    );

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
                <mesh key={photo.key} geometry={photoGeometries[index]} name={`photo-${photo.key}`}>
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
useTexture.preload(PHOTO_CONFIG[2].source);
