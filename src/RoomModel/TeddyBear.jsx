import { useGLTF } from '@react-three/drei';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useNightAwareMaterials } from '../helper/useNightAwareMaterials';

const BEAR_ASSET = './assets/bear-poly-pizza.glb';

// These are the unscaled GLB coordinates of the lowest part of the seated bear.
// The mattress surface is at y=1.55 in the centered room model's local frame.
const MATTRESS_SURFACE_Y = 1.55;
const BEAR_SCALE = 0.001;
const BEAR_LOWEST_POINT_Y = 892.398;
const BEAR_POSITION = [
    -2.9,
    MATTRESS_SURFACE_Y - BEAR_LOWEST_POINT_Y * BEAR_SCALE,
    3.35
];

const BEAR_COLOR_FALLBACKS = {
    Material__25: '#e14b28',
    Material__259f: '#d9783a',
    Material__259o: '#f7c994',
    Material__259: '#e9a13f',
    Material__2598: '#2b1c1a'
};

const createUnlitMaterial = (material) => new THREE.MeshBasicMaterial({
    name: material.name,
    color: material.color?.getHex?.() === 0
        ? BEAR_COLOR_FALLBACKS[material.name] || '#d9783a'
        : material.color,
    map: material.map,
    alphaMap: material.alphaMap,
    side: material.side,
    transparent: material.transparent,
    opacity: material.opacity,
    alphaTest: material.alphaTest,
    toneMapped: false
});

const TeddyBear = React.memo(({ nightMix }) => {
    const bearRoot = useRef();
    const { scene } = useGLTF(BEAR_ASSET);
    useNightAwareMaterials(bearRoot, nightMix);
    const bear = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((object) => {
            if (!object.isMesh) return;

            object.material = Array.isArray(object.material)
                ? object.material.map(createUnlitMaterial)
                : createUnlitMaterial(object.material);
        });
        return clone;
    }, [scene]);

    useEffect(() => () => {
        const materials = new Set();
        bear.traverse((object) => {
            if (!object.isMesh) return;

            const objectMaterials = Array.isArray(object.material)
                ? object.material
                : [object.material];
            objectMaterials.forEach((material) => material && materials.add(material));
        });
        materials.forEach((material) => material.dispose());
    }, [bear]);

    return (
        <group ref={bearRoot} position={BEAR_POSITION} rotation={[0, Math.PI, 0]} scale={BEAR_SCALE}>
            <primitive object={bear} />
        </group>
    );
});

export default TeddyBear;

useGLTF.preload(BEAR_ASSET);
