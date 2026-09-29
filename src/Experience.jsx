/* eslint-disable react/display-name */
import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
    Bloom,
    EffectComposer,
    Outline,
    Selection
} from '@react-three/postprocessing';
import React, { Component, Suspense } from 'react';

import { CameraManager } from './CameraManager/CameraManager';
import RoomModel from './RoomModel/roomModel';

class SceneErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() {
        this.props.onError?.();
    }

    render() {
        return this.state.hasError ? null : this.props.children;
    }
}

const Experience = React.memo(({ onError, onStationOpen, stationActions }) => {
    return (
        <SceneErrorBoundary onError={onError}>
            <Canvas
                camera={{
                    fov: 35,
                    near: 0.1,
                    far: 40,
                    position: [24, 15, -24]
                }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <Suspense fallback={null}>
                    <Selection>
                        <EffectComposer autoClear={false}>
                            <Outline
                                blur
                                visibleEdgeColor="white"
                                edgeStrength={42}
                            />
                            <Bloom mipmapBlur levels={5} intensity={0.55} />
                        </EffectComposer>
                        {/* <Perf position={'top-left'} /> */}
                        <CameraManager />
                        <RoomModel onStationOpen={onStationOpen} stationActions={stationActions} />
                    </Selection>
                </Suspense>
            </Canvas>
            <Loader />
        </SceneErrorBoundary>
    );
});

export default Experience;
