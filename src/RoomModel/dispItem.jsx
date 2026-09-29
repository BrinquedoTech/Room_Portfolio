import React, { useMemo } from 'react';
import * as THREE from 'three';

import { useNightAwareMaterials } from '../helper/useNightAwareMaterials';

const BOARD_FACE = {
    center: [0.132, 0.62, -1.38],
    dimensions: [0.025, 1.7, 2.64]
};

const DRAWING_PATHS = [
    // Sun and rays.
    Array.from({ length: 25 }, (_, index) => {
        const angle = (index / 24) * Math.PI * 2;
        return [0.4 + Math.sin(angle) * 0.17, -0.82 + Math.cos(angle) * 0.17];
    }),
    [[0.4, -1.12], [0.4, -1.03]],
    [[0.4, -0.61], [0.4, -0.52]],
    [[0.1, -0.82], [0.19, -0.82]],
    [[0.61, -0.82], [0.7, -0.82]],
    [[0.19, -1.03], [0.25, -0.97]],
    [[0.55, -0.67], [0.61, -0.61]],
    [[0.19, -0.61], [0.25, -0.67]],
    [[0.55, -0.97], [0.61, -1.03]],
    // A little house, roof, door, and windows.
    [[-0.42, 0.04], [0.04, 0.04], [0.04, 0.73], [-0.42, 0.73], [-0.42, 0.04]],
    [[0.02, -0.04], [0.34, 0.39], [0.02, 0.77]],
    [[-0.42, 0.04], [-0.42, -0.04], [0.04, -0.04], [0.04, 0.04]],
    [[-0.42, 0.73], [-0.42, 0.81], [0.04, 0.81], [0.04, 0.73]],
    [[-0.36, 0.16], [-0.18, 0.16], [-0.18, 0.35], [-0.36, 0.35], [-0.36, 0.16]],
    [[-0.12, 0.16], [0.0, 0.16], [0.0, 0.35], [-0.12, 0.35], [-0.12, 0.16]],
    [[-0.38, 0.52], [-0.3, 0.52], [-0.3, 0.62], [-0.38, 0.62], [-0.38, 0.52]],
    [[-0.14, 0.52], [-0.06, 0.52], [-0.06, 0.62], [-0.14, 0.62], [-0.14, 0.52]],
    // Cloud and a curved path like a child's marker doodle.
    [[0.48, 0.7], [0.55, 0.77], [0.64, 0.76], [0.7, 0.82], [0.81, 0.8], [0.86, 0.73], [0.97, 0.73], [1.02, 0.65], [0.98, 0.58], [0.52, 0.58], [0.46, 0.64], [0.48, 0.7]],
    [[-0.66, -0.4], [-0.56, -0.26], [-0.65, -0.13], [-0.53, -0.04], [-0.65, 0.1]],
];

export function WhiteboardArt({ nodes, nightMix }) {
    const art = React.useRef();
    useNightAwareMaterials(art, nightMix);
    const board = nodes?.dispItem;
    const paths = useMemo(() => DRAWING_PATHS.map((points) => {
        const curve = new THREE.CatmullRomCurve3(points.map(([y, z]) => new THREE.Vector3(
            BOARD_FACE.center[0] + BOARD_FACE.dimensions[0] / 2 + 0.012,
            BOARD_FACE.center[1] + y,
            BOARD_FACE.center[2] + z,
        )));
        return new THREE.TubeGeometry(curve, Math.max(18, points.length * 5), 0.009, 5, false);
    }), []);

    if (!board) return null;

    return <group ref={art} position={board.position} rotation={board.rotation}>
        {paths.map((geometry, index) => (
            <mesh key={index} geometry={geometry} raycast={() => null} renderOrder={3}>
                <meshBasicMaterial color="#155cae" toneMapped={false} />
            </mesh>
        ))}
    </group>;
}

const DispItem = React.memo(({ nodes, nightMix, ...interactionProps }) => {
    const boardSurface = React.useRef();
    useNightAwareMaterials(boardSurface, nightMix);
    const board = nodes?.dispItem;
    if (!board) return null;

    return <group ref={boardSurface} position={board.position} rotation={board.rotation}>
        <mesh name="learning-whiteboard" position={BOARD_FACE.center} renderOrder={2} {...interactionProps}>
            <boxGeometry args={BOARD_FACE.dimensions} />
            <meshBasicMaterial color="#e6e5dc" toneMapped={false} />
        </mesh>
    </group>;
});

export default DispItem;
