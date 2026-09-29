/* Educational objects open the corresponding activity directly. */
import { Edges, Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import React, { useMemo, useState } from 'react';
import * as THREE from 'three';

import { useRoomCursor } from '../helper/useRoomCursor';
import DispItem, { WhiteboardArt } from './dispItem';

const STATION_TARGETS = [
    {
        id: 'computer',
        color: '#526dff',
        label: 'FERRAMENTAS EDUCATIVAS',
        labelPosition: [1.46, 3.05, 2.72]
    },
    {
        id: 'board',
        color: '#fbbf24',
        label: 'TRILHAS DE APRENDIZAGEM'
    },
    {
        id: 'tv',
        color: '#a855f7',
        label: 'JOGOS EDUCATIVOS',
        labelPosition: [2.89, 1.53, -1.20]
    },
    {
        id: 'desk',
        color: '#f97316',
        label: 'ÁLBUNS',
        labelPosition: [0.95, 4.18, 3.91]
    }
];

const SCREEN_COLOR = '#526dff';

const BOARD_LABEL_ANCHOR = [0.14, 1.48, -1.38];

const CHESS_COLLIDER = {
    center: [2.89, 1.08, -1.20],
    dimensions: [0.96, 0.025, 0.96]
};

const BOOKS_COLLIDER = {
    center: [0.95, 3.81, 3.91],
    dimensions: [0.42, 0.18, 0.29],
    rotation: [0, 0.49, 0]
};

const DispFrame = React.memo(({ nodes, onStationOpen, stationActions = {}, nightMix }) => {
    const [hovered, setHovered] = useState(null);

    useRoomCursor(Boolean(hovered));

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
    const targetColor = (station) => STATION_TARGETS.find((target) => target.id === station)?.color || 'white';
    const boardLabelPosition = useMemo(() => new THREE.Vector3(
        BOARD_LABEL_ANCHOR[0],
        BOARD_LABEL_ANCHOR[1],
        BOARD_LABEL_ANCHOR[2]
    )
        .applyEuler(nodes.dispItem.rotation)
        .add(nodes.dispItem.position)
        .toArray(), [nodes.dispItem]);

    const stationLabel = (station) => (
        <Html
            center
            distanceFactor={7}
            position={station === 'board'
                    ? boardLabelPosition
                    : STATION_TARGETS.find((target) => target.id === station)?.labelPosition}
            style={{ pointerEvents: 'none' }}
            zIndexRange={[1, 2]}
        >
            <div
                aria-hidden="true"
                className={`station-label ${hovered === station ? '' : 'station-label-idle'} ${actionFor(station).available ? '' : 'station-label-empty'}`}
                style={{ '--station-color': targetColor(station) }}
            >
                {STATION_TARGETS.find((target) => target.id === station)?.label}
            </div>
        </Html>
    );

    const selectTarget = (station, children) => (
        <Select enabled={hovered === station} key={station}>
            {children}
            {stationLabel(station)}
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
            <meshBasicMaterial color={SCREEN_COLOR} transparent opacity={0.82} toneMapped={false} />
        </mesh>)}
        {selectTarget('board', <DispItem
            nodes={nodes}
            nightMix={nightMix}
            onClick={openStation('board')}
            onPointerDown={setStationHover('board')}
            onPointerOver={setStationHover('board')}
            onPointerOut={clearStationHover}
        />)}
        <WhiteboardArt nodes={nodes} nightMix={nightMix} />
        <mesh geometry={nodes.tvdisplay.geometry} position={nodes.tvdisplay.position} rotation={nodes.tvdisplay.rotation}>
            <meshBasicMaterial transparent opacity={0.03} color="#a855f7" depthWrite={false} />
        </mesh>
        {selectTarget('tv', <mesh
            position={CHESS_COLLIDER.center}
            onClick={openStation('tv')}
            onPointerDown={setStationHover('tv')}
            onPointerOver={setStationHover('tv')}
            onPointerOut={clearStationHover}
        >
            <boxGeometry args={CHESS_COLLIDER.dimensions} />
            <meshBasicMaterial transparent opacity={hovered === 'tv' ? 0.12 : 0.045} color="#a855f7" depthWrite={false} />
            {hovered === 'tv' && <Edges scale={1.01} color="#d8b4fe" />}
        </mesh>)}
        {selectTarget('desk', <mesh
            position={BOOKS_COLLIDER.center}
            rotation={BOOKS_COLLIDER.rotation}
            onClick={openStation('desk')}
            onPointerDown={setStationHover('desk')}
            onPointerOver={setStationHover('desk')}
            onPointerOut={clearStationHover}
        >
            <boxGeometry args={BOOKS_COLLIDER.dimensions} />
            <meshBasicMaterial transparent opacity={hovered === 'desk' ? 0.12 : 0.045} color="#f97316" depthWrite={false} />
            {hovered === 'desk' && <Edges scale={1.01} color="#fdba74" />}
        </mesh>)}
    </>;
});

export default DispFrame;
