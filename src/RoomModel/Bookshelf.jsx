import React from 'react';

const BOOK_PALETTE = [
    ['#e76f51', 0.24, 0.34],
    ['#457b9d', 0.22, 0.4],
    ['#e9c46a', 0.25, 0.3],
    ['#6a994e', 0.23, 0.37],
    ['#9b5de5', 0.25, 0.42],
    ['#f28482', 0.22, 0.32],
    ['#277da1', 0.25, 0.36],
    ['#f4a261', 0.23, 0.41],
    ['#588157', 0.24, 0.33],
    ['#e76f51', 0.22, 0.38],
    ['#577590', 0.25, 0.35],
    ['#e9c46a', 0.23, 0.39],
];

const BOOK_ROWS = [
    { y: -0.67, books: BOOK_PALETTE.slice(0, 10) },
    { y: -0.14, books: BOOK_PALETTE.slice(2, 12) },
    { y: 0.39, books: BOOK_PALETTE.slice(0, 7).map(([color, width]) => [color, width, 0.2]) },
];

function BookRow({ y, books }) {
    const totalWidth = books.reduce((sum, [, width]) => sum + width, 0);
    let cursor = -totalWidth / 2;

    return books.map(([color, width, height], index) => {
        const x = cursor + width / 2;
        cursor += width;
        const tilt = ((index % 3) - 1) * 0.035;

        return (
            <group key={`${y}-${index}`} position={[x, y + height / 2, 0.28]} rotation={[0, 0, tilt]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[width, height, 0.2]} />
                    <meshStandardMaterial color={color} roughness={0.8} />
                </mesh>
                <mesh position={[0, height * 0.22, 0.102]}>
                    <boxGeometry args={[width * 0.68, 0.018, 0.008]} />
                    <meshStandardMaterial color="#fff1ce" roughness={0.75} />
                </mesh>
            </group>
        );
    });
}

export default React.memo(function Bookshelf() {
    return (
        <group position={[-5.2, 2.95, -1.95]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
                <boxGeometry args={[2.8, 1.55, 0.08]} />
                <meshStandardMaterial color="#b87948" roughness={0.86} />
            </mesh>
            <mesh position={[-1.34, 0, 0.25]} castShadow receiveShadow>
                <boxGeometry args={[0.12, 1.55, 0.46]} />
                <meshStandardMaterial color="#9a5c36" roughness={0.8} />
            </mesh>
            <mesh position={[1.34, 0, 0.25]} castShadow receiveShadow>
                <boxGeometry args={[0.12, 1.55, 0.46]} />
                <meshStandardMaterial color="#9a5c36" roughness={0.8} />
            </mesh>
            {[-0.71, -0.18, 0.35, 0.72].map((y) => (
                <mesh key={y} position={[0, y, 0.25]} castShadow receiveShadow>
                    <boxGeometry args={[2.72, 0.075, 0.48]} />
                    <meshStandardMaterial color="#c58a56" roughness={0.82} />
                </mesh>
            ))}
            {BOOK_ROWS.map((row) => <BookRow key={row.y} {...row} />)}
        </group>
    );
});
