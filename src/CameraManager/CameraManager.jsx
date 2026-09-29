import { CameraControls } from '@react-three/drei';
import { useRef } from 'react';
import { useEffect } from 'react';

import { useCameraStore } from '../helper/CameraStore';

export const CameraManager = () => {
    const cameraControle = useRef();

    const cameraState = useCameraStore((state) => state.cameraState);

    const maxDistancce = useCameraStore((state) => state.maxDistancce);
    const minDistance = useCameraStore((state) => state.minDistance);
    const maxAzimuthAngle = useCameraStore((state) => state.maxAzimuthAngle);
    const minAzimuthAngle = useCameraStore((state) => state.minAzimuthAngle);
    const minPolarAngle = useCameraStore((state) => state.minPolarAngle);
    const maxPolarAngle = useCameraStore((state) => state.maxPolarAngle);
    const truckSpeed = useCameraStore((state) => state.truckSpeed);
    const dollyToCursor = useCameraStore((state) => state.dollyToCursor);
    const enable = useCameraStore((state) => state.enable);

    useEffect(() => {
        const controls = cameraControle.current;
        if (!controls) return;

        const presets = {
            default: {
                truckSpeed: 0.5,
                dollyToCursor: true,
                minDistance: 2,
                maxDistancce: 25,
                minPolarAngle: Math.PI * 0.1,
                maxPolarAngle: Math.PI * 0.45,
                minAzimuthAngle: Math.PI * 0.5,
                maxAzimuthAngle: Math.PI,
                lookAt: [14, 10, -14, 0, -1, 0]
            },
            desktop: {
                truckSpeed: 0,
                dollyToCursor: false,
                minDistance: 5.65,
                maxDistancce: 7.1,
                minPolarAngle: Math.PI * 0.5,
                maxPolarAngle: Math.PI * 0.5,
                minAzimuthAngle: Math.PI,
                maxAzimuthAngle: Math.PI,
                lookAt: [2.1, 0.3, 2, 2.1, 0.3, 8]
            },
            laptop: {
                truckSpeed: 0,
                dollyToCursor: false,
                minDistance: 4.2,
                maxDistancce: 6,
                minPolarAngle: Math.PI * 0.435,
                maxPolarAngle: Math.PI * 0.435,
                minAzimuthAngle: Math.PI * 0.689,
                maxAzimuthAngle: Math.PI * 0.689,
                lookAt: [2, 0, 2.5, -2, -1, 5.2]
            },
            tv: {
                truckSpeed: 0,
                dollyToCursor: false,
                minDistance: 5.6,
                maxDistancce: 6.5,
                minPolarAngle: Math.PI * 0.5,
                maxPolarAngle: Math.PI * 0.5,
                minAzimuthAngle: 0,
                maxAzimuthAngle: 0,
                lookAt: [2.5, -0.1, 1, 2.5, -0.1, -5]
            },
            desk: {
                truckSpeed: 0,
                dollyToCursor: false,
                minDistance: 4.5,
                maxDistancce: 6.5,
                minPolarAngle: Math.PI * 0.38,
                maxPolarAngle: Math.PI * 0.42,
                minAzimuthAngle: Math.PI * 0.58,
                maxAzimuthAngle: Math.PI * 0.58,
                lookAt: [2.5, 1.2, 7, 2.5, 1.2, 2.7]
            },
            smartphone: {
                truckSpeed: 0,
                dollyToCursor: false,
                minDistance: 8.8,
                maxDistancce: 9.2,
                minPolarAngle: Math.PI * 0.03,
                maxPolarAngle: Math.PI * 0.036,
                minAzimuthAngle: Math.PI * 0.83,
                maxAzimuthAngle: Math.PI * 0.845,
                lookAt: [1.7, -0.3, -0.85, 1.25, -9, -0.1]
            },
            displayBoard: {
                truckSpeed: 0,
                dollyToCursor: true,
                minDistance: 4,
                maxDistancce: 8,
                minPolarAngle: Math.PI * 0.4999,
                maxPolarAngle: Math.PI * 0.5,
                minAzimuthAngle: Math.PI * 0.5,
                maxAzimuthAngle: Math.PI * 0.50001,
                lookAt: [-2, 0.12, -1.5, -8, 0.12, -1.5]
            }
        };
        const preset = presets[cameraState];
        if (!preset) return;

        const { lookAt, ...controlOptions } = preset;
        useCameraStore.setState(controlOptions);
        controls.setLookAt(...lookAt, true);
    }, [cameraState]);

    return (
        <CameraControls
            makeDefault={true}
            ref={cameraControle}
            dollyToCursor={dollyToCursor}
            dollySpeed={1.2}
            truckSpeed={truckSpeed}
            minDistance={minDistance}
            maxDistance={maxDistancce}
            smoothTime={0.8}
            maxAzimuthAngle={maxAzimuthAngle}
            minAzimuthAngle={minAzimuthAngle}
            minPolarAngle={minPolarAngle}
            maxPolarAngle={maxPolarAngle}
            polarRotateSpeed={0.3}
            azimuthRotateSpeed={0.3}
            maxSpeed={20}
            enableTransition={true}
            boundaryFriction={0}
            boundaryEnclosesCamera={true}
            interactiveArea={[0.5, 0.5, 1, 1]}
            enabled={enable}
        />
    );
};
