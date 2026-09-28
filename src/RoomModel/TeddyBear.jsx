import { Center, useGLTF } from '@react-three/drei';
import React from 'react';

const BEAR_ASSET = './assets/bear-poly-pizza.glb';

// Centering on the lowest point makes the placement below the visible bed
// surface explicit and keeps the asset free of interaction handlers.
const TeddyBear = React.memo(() => {
    const { scene } = useGLTF(BEAR_ASSET);

    return (
        <Center top position={[0.35, 2.12, -1.75]} rotation={[0, Math.PI, 0]}>
            <primitive object={scene} scale={0.002} />
        </Center>
    );
});

export default TeddyBear;

useGLTF.preload(BEAR_ASSET);
