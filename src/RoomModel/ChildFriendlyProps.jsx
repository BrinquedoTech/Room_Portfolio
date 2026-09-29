import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useNightAwareMaterials } from '../helper/useNightAwareMaterials';

const PAPER_COLOR = '#fff8e8';
const CRAYON_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];

function DrawingMaterials({ nightMix }) {
    const drawing = useRef();
    useNightAwareMaterials(drawing, nightMix);

    return <group ref={drawing}>
        {/* A drawing pad covers the phone and earbud case built into the furniture mesh. */}
        <mesh position={[1.68, 1.17, -1.25]}>
            <boxGeometry args={[1.24, 0.18, 1.2]} />
            <meshBasicMaterial color="#e8d4b5" />
        </mesh>
        <group position={[1.5, 1.282, -1.19]} rotation={[0, -0.14, 0]}>
            <mesh position={[0.08, 0, 0.04]} rotation={[0, 0.18, 0]}>
                <boxGeometry args={[0.64, 0.008, 0.48]} />
                <meshBasicMaterial color="#dbeafe" />
            </mesh>
            <mesh position={[0, 0.012, 0]}>
                <boxGeometry args={[0.64, 0.008, 0.48]} />
                <meshBasicMaterial color={PAPER_COLOR} />
            </mesh>
            <mesh position={[-0.08, 0.019, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.105, 24]} />
                <meshBasicMaterial color="#f97316" side={2} />
            </mesh>
            <mesh position={[0.11, 0.02, -0.07]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.06, 0.083, 24]} />
                <meshBasicMaterial color="#a855f7" side={2} />
            </mesh>
        </group>
        {CRAYON_COLORS.map((color, index) => (
            <group key={color} position={[1.95 + index * 0.045, 1.295, -1.4 + index * 0.105]} rotation={[0, 0.23 + index * 0.1, Math.PI / 2]}>
                <mesh>
                    <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                    <coneGeometry args={[0.025, 0.065, 8]} />
                    <meshBasicMaterial color="#fce7c4" />
                </mesh>
            </group>
        ))}
        <group position={[2.08, 1.39, -1.52]}>
            <mesh>
                <boxGeometry args={[0.46, 0.26, 0.34]} />
                <meshBasicMaterial color="#facc15" />
            </mesh>
            <mesh position={[0, 0.04, 0.176]}>
                <boxGeometry args={[0.38, 0.08, 0.008]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[0, -0.05, 0.176]}>
                <boxGeometry args={[0.38, 0.06, 0.008]} />
                <meshBasicMaterial color="#ef4444" />
            </mesh>
        </group>
    </group>;
}

function MovingToyCar({ nightMix }) {
    const car = useRef();
    useNightAwareMaterials(car, nightMix);
    const { scene: toyCarAsset } = useGLTF('./assets/kenney-toy-monster-truck.glb');
    const toyCar = useMemo(() => {
        const model = toyCarAsset.clone(true);
        const materials = [];
        model.traverse((object) => {
            if (!object.isMesh) return;

            const toUnlitMaterial = (material) => {
                const unlit = new THREE.MeshBasicMaterial({
                    map: material.map ?? null,
                    color: material.color ?? 0xffffff,
                    alphaMap: material.alphaMap ?? null,
                    alphaTest: material.alphaTest ?? 0,
                    opacity: material.opacity ?? 1,
                    transparent: material.transparent ?? false,
                    side: material.side ?? THREE.FrontSide,
                    vertexColors: material.vertexColors ?? false,
                    toneMapped: false,
                });
                materials.push(unlit);
                return unlit;
            };

            object.material = Array.isArray(object.material)
                ? object.material.map(toUnlitMaterial)
                : toUnlitMaterial(object.material);
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        model.scale.setScalar(0.56 / Math.max(size.x, size.z));
        model.updateMatrixWorld(true);
        const fittedBounds = new THREE.Box3().setFromObject(model);
        const center = fittedBounds.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.y -= fittedBounds.min.y;
        model.position.y += 0.08;
        model.position.z -= center.z;
        return { model, materials };
    }, [toyCarAsset]);
    useEffect(() => () => toyCar.materials.forEach((material) => material.dispose()), [toyCar]);
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useFrame(({ clock }) => {
        if (!car.current || reducedMotion) return;
        const phase = clock.getElapsedTime() * 0.55;
        car.current.position.x = 4.0 + 0.35 * Math.cos(phase);
        car.current.position.z = -1.4 + 0.25 * Math.sin(phase);
        car.current.rotation.y = Math.atan2(0.35 * Math.sin(phase), -0.25 * Math.cos(phase));
    });

    return <group ref={car} position={[4.35, 0, -1.4]}>
        <primitive object={toyCar.model} />
    </group>;
}

export default React.memo(function ChildFriendlyProps({ nightMix }) {
    return <>
        <DrawingMaterials nightMix={nightMix} />
        <MovingToyCar nightMix={nightMix} />
    </>;
});
