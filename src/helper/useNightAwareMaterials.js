import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NIGHT_TINT = new THREE.Color('#535365');

export function useNightAwareMaterials(groupRef, nightMix) {
    useFrame(() => {
        const root = groupRef.current;
        if (!root) return;

        const rawMix = typeof nightMix?.get === 'function' ? nightMix.get() : nightMix;
        const mix = THREE.MathUtils.clamp(Number(rawMix) || 0, 0, 1);

        root.traverse((object) => {
            if (!object.isMesh) return;

            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
                if (!material?.color) return;

                if (!material.userData.roomNightColors) {
                    const day = material.color.clone();
                    material.userData.roomNightColors = {
                        day,
                        night: day.clone().multiply(NIGHT_TINT),
                    };
                }

                const { day, night } = material.userData.roomNightColors;
                material.color.copy(day).lerp(night, mix);
            });
        });
    });
}
