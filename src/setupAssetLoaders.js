import { useGLTF } from '@react-three/drei';

// Vite serves public assets beneath BASE_URL in both development and builds.
useGLTF.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
