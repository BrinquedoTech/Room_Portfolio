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

const Experience = React.memo(({ onError, onStationSelect }) => {
    return (
        <SceneErrorBoundary onError={onError}>
            <Canvas
                camera={{
                    fov: 35,
                    near: 0.1,
                    far: 200,
                    position: [24, 15, -24]
                }}
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
                                edgeStrength={60}
                                width={2000}
                            />
                            <Bloom mipmapBlur intensity={0.9} />
                        </EffectComposer>
                        {/* <Perf position={'top-left'} /> */}
                        <CameraManager />
                        <RoomModel onStationSelect={onStationSelect} />
                    </Selection>
                </Suspense>
            </Canvas>
            <Loader />
        </SceneErrorBoundary>
    );
});

export default Experience;
