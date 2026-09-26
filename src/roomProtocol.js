export const ROOM_PROTOCOL = 'brinquedotech-room/v1';

export const isRoomMessage = (value) => {
    if (!value || typeof value !== 'object') return false;
    return value.protocol === ROOM_PROTOCOL && typeof value.type === 'string';
};

export const getParentOrigin = () => {
    try {
        return document.referrer ? new URL(document.referrer).origin : window.location.origin;
    } catch {
        return window.location.origin;
    }
};
