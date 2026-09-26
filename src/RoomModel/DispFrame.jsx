/* Educational station surfaces. Destinations are presented by RoomShell's accessible list. */
import { Select } from '@react-three/postprocessing';
import React, { useEffect, useState } from 'react';

import { useCameraStore } from '../helper/CameraStore';

const DispFrame = React.memo(({ nodes, onStationSelect }) => {
    const cameraState = useCameraStore((state) => state.cameraState);
    const desktopState = useCameraStore((state) => state.desktop);
    const displayBoardState = useCameraStore((state) => state.displayBoard);
    const tvState = useCameraStore((state) => state.tv);
    const deskState = useCameraStore((state) => state.desk);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered]);

    const selectStation = (station, moveCamera) => () => {
        if (cameraState !== 'default') return;
        onStationSelect?.(station);
        moveCamera();
    };

    return <>
        <Select enabled={hovered === 'monitor'}>
            <mesh geometry={nodes.monitor.geometry} position={nodes.monitor.position} rotation={nodes.monitor.rotation}
                onClick={selectStation('computer', desktopState)}
                onPointerOver={() => setHovered('monitor')} onPointerOut={() => setHovered(null)}>
                <meshBasicMaterial color="#526dff" toneMapped={false} />
            </mesh>
        </Select>
        <Select enabled={hovered === 'board'}>
            <mesh position={[-5.2, 2.95, -1.95]} rotation={[0, Math.PI / 2, 0]} scale={[2.8, 1.6, 1]}
                onClick={selectStation('board', displayBoardState)}
                onPointerOver={() => setHovered('board')} onPointerOut={() => setHovered(null)}>
                <meshBasicMaterial transparent opacity={0.18} color="#fbbf24" />
                <planeGeometry />
            </mesh>
        </Select>
        <Select enabled={hovered === 'tv'}>
            <mesh position={[2.5, 1.45, -5.3]} scale={[2.6, 1.45, 1]}
                onClick={selectStation('tv', tvState)}
                onPointerOver={() => setHovered('tv')} onPointerOut={() => setHovered(null)}>
                <meshBasicMaterial transparent opacity={0.18} color="#a855f7" />
                <planeGeometry />
            </mesh>
        </Select>
        <Select enabled={hovered === 'desk'}>
            <mesh position={[2.5, 1.35, 2.7]} scale={[2.5, 1.2, 1]}
                onClick={selectStation('desk', deskState)}
                onPointerOver={() => setHovered('desk')} onPointerOut={() => setHovered(null)}>
                <meshBasicMaterial transparent opacity={0.18} color="#f97316" />
                <planeGeometry />
            </mesh>
        </Select>
    </>;
});

export default DispFrame;
