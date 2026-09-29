/* eslint-disable react/display-name */
import { useSpring } from '@react-spring/core';
import { Center, meshBounds, useGLTF, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useCameraStore } from '../helper/CameraStore';
import TheamSwitch from '../Switch/TheamSwitch';
import ChildFriendlyProps from './ChildFriendlyProps';
import Clock from './clock';
import DispFrame from './DispFrame';
import PhotoFrame from './photoFrame';
import '../setupAssetLoaders';
import TextureMaterial from './textures/TextureMaterial';
import TeddyBear from './TeddyBear';
import Windows from './Windows';

extend({ TextureMaterial });

const RoomModel = React.memo(({ onStationOpen, stationActions }) => {
    const chairTop = useRef();
    const textureMatFur = useRef();
    const textureMatDes = useRef();
    const textureMatChaorTop = useRef();

    const [toggle, setToggle] = useState(0);

    useEffect(() => {
        const nightMix = toggle ? 1 : 0;
        const targets = [textureMatFur, textureMatDes, textureMatChaorTop]
            .map((materialRef) => materialRef.current?.uniforms?.NightMix)
            .filter(Boolean);
        const tweens = targets.map((target) => gsap.to(target, {
            value: nightMix,
            duration: 1
        }));

        return () => tweens.forEach((tween) => tween.kill());
    }, [toggle]);

    const [{ x }] = useSpring(
        {
            x: toggle,
            config: { mass: 4, tension: 800, friction: 35, precision: 0.001 }
        },
        [toggle]
    );

    useFrame(({ clock }) => {
        if (chairTop.current) {
            chairTop.current.rotation.y = Math.sin(
                clock.getElapsedTime() * 0.3
            );
        }
    });

    const roomModel = useGLTF('./assets/RoomModel.glb');
    const chair = useGLTF('./assets/chairtopDraco.glb');

    const dBaked = useTexture('./assets/bakedTextureDaycmp.webp');
    dBaked.flipY = false;
    dBaked.magFilter = THREE.LinearFilter;
    dBaked.minFilter = THREE.NearestFilter;
    dBaked.generateMipmaps = false;
    dBaked.colorSpace = THREE.SRGBColorSpace;

    const nBaked = useTexture('./assets/roomTextureNightcmp.webp');
    nBaked.flipY = false;
    nBaked.magFilter = THREE.LinearFilter;
    nBaked.minFilter = THREE.NearestFilter;
    nBaked.generateMipmaps = false;
    nBaked.colorSpace = THREE.SRGBColorSpace;

    const lightMap = useTexture('./assets/roomTextureLightMapcmp.webp');
    lightMap.flipY = false;
    lightMap.magFilter = THREE.LinearFilter;
    lightMap.minFilter = THREE.NearestFilter;
    lightMap.generateMipmaps = false;
    lightMap.colorSpace = THREE.NoColorSpace;

    const textureMaterialProps = useMemo(
        () => ({
            dbakedm: dBaked,
            nbakedm: nBaked,
            lightMapm: lightMap,
            NightMix: 0,
            lightBoardColor: '#4f46e5',
            lightBoardStrength: 1.1,
            lightPcColor: '#2563eb',
            lightPcStrength: 1.1,
            lightDeskColor: '#ea580c',
            lightDeskStrength: 1.2
        }),
        [dBaked, nBaked, lightMap]
    );

    const cameraState = useCameraStore((state) => state.cameraState);
    const defaultState = useCameraStore((state) => state.default);

    return (
        <group>
            <Center>
                <mesh
                    geometry={roomModel.nodes.roomFurniture.geometry}
                    position={roomModel.nodes.roomFurniture.position}
                    rotation={roomModel.nodes.roomFurniture.rotation}
                    raycast={meshBounds}
                    onClick={
                        cameraState === 'default'
                            ? undefined
                            : cameraState === 'displayBoard'
                              ? undefined
                              : cameraState === 'laptop'
                                ? undefined
                                : defaultState
                    }
                >
                    <textureMaterial
                        {...textureMaterialProps}
                        ref={textureMatFur}
                    />
                </mesh>

                <mesh
                    geometry={roomModel.nodes.deskShelfStuf.geometry}
                    position={roomModel.nodes.deskShelfStuf.position}
                    rotation={roomModel.nodes.deskShelfStuf.rotation}
                    raycast={meshBounds}
                    onClick={
                        cameraState === 'default' ? undefined : defaultState
                    }
                >
                    <textureMaterial
                        {...textureMaterialProps}
                        ref={textureMatDes}
                    />
                </mesh>

                <mesh
                    ref={chairTop}
                    geometry={chair.nodes.chairTop.geometry}
                    position={chair.nodes.chairTop.position}
                    rotation={chair.nodes.chairTop.rotation}
                    raycast={meshBounds}
                    onClick={
                        cameraState === 'default' ? undefined : defaultState
                    }
                >
                    <textureMaterial
                        {...textureMaterialProps}
                        ref={textureMatChaorTop}
                    />
                </mesh>
                <PhotoFrame nodes={roomModel.nodes} />
                <DispFrame nodes={roomModel.nodes} onStationOpen={onStationOpen} stationActions={stationActions} nightMix={x} />
                <TeddyBear nightMix={x} />
                <ChildFriendlyProps nightMix={x} />
                <Clock />
                <Windows toggle={toggle} nodes={roomModel.nodes} />
                <TheamSwitch x={x} set={setToggle} nodes={roomModel.nodes} />
            </Center>
        </group>
    );
});

export default RoomModel;

useGLTF.preload('./assets/RoomModel.glb');
useGLTF.preload('./assets/chairtopDraco.glb');
useTexture.preload('./assets/bakedTextureDaycmp.webp');
useTexture.preload('./assets/roomTextureNightcmp.webp');
useTexture.preload('./assets/roomTextureLightMapcmp.webp');
