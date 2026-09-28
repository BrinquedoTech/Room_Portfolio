/* Educational objects open the corresponding activity directly. */
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import React, { useEffect, useState } from 'react';

const STATION_TARGETS = [
    {
        id: 'computer',
        color: '#526dff',
        node: 'monitor',
        labelPosition: [1.46, 3.05, 2.72]
    },
    {
        id: 'board',
        color: '#fbbf24',
        node: 'dispItem',
        labelPosition: [-5.25, 3.35, -0.56]
    },
    {
        id: 'tv',
        color: '#a855f7',
        node: 'tvdisplay',
        labelPosition: [2.4, 2.35, 1.55]
    },
    {
        id: 'desk',
        color: '#f97316',
        labelPosition: [2.5, 2.55, 2.7]
    }
];

const SCREEN_COLOR = '#526dff';

const DESK_COLLIDER = {
    // The desk is part of the same modeled assembly as the monitor. Keep the
    // interaction target in that node's local frame so model transforms cannot
    // make the hit area drift into the chair or floor.
    offset: [1.0431332588, -0.7377959723, -0.0166295052],
    scale: [2.5, 0.12, 1.2]
};

const DispFrame = React.memo(({ nodes, onStationOpen, stationActions = {} }) => {
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered]);

    const openStation = (station) => (event) => {
        event.stopPropagation();
        onStationOpen?.(station, event.currentTarget);
    };

    const setStationHover = (station) => () => setHovered(station);
    const clearStationHover = () => setHovered(null);
    const actionFor = (station) => stationActions[station] || {
        available: false,
        hoverLabel: 'Nenhuma atividade liberada'
    };
    const targetLabel = (station) => actionFor(station).hoverLabel;
    const targetColor = (station) => STATION_TARGETS.find((target) => target.id === station)?.color || 'white';
    const deskPosition = [
        nodes.monitor.position.x + DESK_COLLIDER.offset[0],
        nodes.monitor.position.y + DESK_COLLIDER.offset[1],
        nodes.monitor.position.z + DESK_COLLIDER.offset[2]
    ];

    const stationLabel = (station) => (
        <Html
            center
            distanceFactor={7}
            position={STATION_TARGETS.find((target) => target.id === station)?.labelPosition}
            style={{ pointerEvents: 'none' }}
            zIndexRange={[1, 2]}
        >
            <div
                aria-hidden="true"
                className={`station-label ${actionFor(station).available ? '' : 'station-label-empty'}`}
                style={{ '--station-color': targetColor(station) }}
            >
                {targetLabel(station)}
            </div>
        </Html>
    );

    const selectTarget = (station, children) => (
        <Select enabled={hovered === station} key={station}>
            {children}
            {(hovered === station) && stationLabel(station)}
        </Select>
    );

    return <>
        <mesh
            geometry={nodes.laptop.geometry}
            position={nodes.laptop.position}
            rotation={nodes.laptop.rotation}
        >
            <meshBasicMaterial color={SCREEN_COLOR} toneMapped={false} />
        </mesh>
        {selectTarget('computer', <mesh
            geometry={nodes.monitor.geometry}
            position={nodes.monitor.position}
            rotation={nodes.monitor.rotation}
            onClick={openStation('computer')}
            onPointerDown={setStationHover('computer')}
            onPointerOver={setStationHover('computer')}
            onPointerOut={clearStationHover}
        >
            <meshBasicMaterial color={SCREEN_COLOR} toneMapped={false} />
        </mesh>)}
        {selectTarget('board', <mesh
            geometry={nodes.dispItem.geometry}
            position={nodes.dispItem.position}
            rotation={nodes.dispItem.rotation}
            onClick={openStation('board')}
            onPointerDown={setStationHover('board')}
            onPointerOver={setStationHover('board')}
            onPointerOut={clearStationHover}
        >
            <meshBasicMaterial transparent opacity={0.03} color="#fbbf24" depthWrite={false} />
        </mesh>)}
        {selectTarget('tv', <mesh
            geometry={nodes.tvdisplay.geometry}
            position={nodes.tvdisplay.position}
            rotation={nodes.tvdisplay.rotation}
            onClick={openStation('tv')}
            onPointerDown={setStationHover('tv')}
            onPointerOver={setStationHover('tv')}
            onPointerOut={clearStationHover}
        >
            <meshBasicMaterial transparent opacity={0.03} color="#a855f7" depthWrite={false} />
        </mesh>)}
        {selectTarget('desk', <mesh
            position={deskPosition}
            rotation={nodes.monitor.rotation}
            scale={DESK_COLLIDER.scale}
            onClick={openStation('desk')}
            onPointerDown={setStationHover('desk')}
            onPointerOver={setStationHover('desk')}
            onPointerOut={clearStationHover}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial transparent opacity={0.03} color="#f97316" depthWrite={false} />
        </mesh>)}
    </>;
});

export default DispFrame;
