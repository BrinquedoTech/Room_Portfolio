import React from 'react';

// The legacy mesh contains the old board artwork and backing geometry. The
// board interaction target is provided separately by DispFrame, so this mesh
// must stay out of the published scene entirely.
const DispItem = React.memo(() => null);

export default DispItem;
