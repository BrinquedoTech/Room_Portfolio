import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Experience from './Experience.jsx';
import { getParentOrigin, isRoomMessage, ROOM_PROTOCOL } from './roomProtocol';

const STATIONS = [
    { id: 'computer', label: 'Computador: Ferramentas', description: 'Pratique, explore e crie.' },
    { id: 'board', label: 'Quadro: Trilhas de aprendizagem', description: 'Continue suas atividades.' },
    { id: 'tv', label: 'TV: Jogos educativos', description: 'Aprenda brincando.' },
    { id: 'desk', label: 'Mesa: Coleções e pet', description: 'Veja suas coleções.' }
];

export default function RoomShell() {
    const parentOrigin = useMemo(getParentOrigin, []);
    const pendingRequest = useRef(null);
    const lastFocus = useRef(null);
    const activityFrame = useRef(null);
    const [destinations, setDestinations] = useState([]);
    const [selectedStation, setSelectedStation] = useState('computer');
    const [activeDestination, setActiveDestination] = useState(null);
    const [status, setStatus] = useState('loading');
    const [sceneFailed, setSceneFailed] = useState(false);
    const [sceneRetryKey, setSceneRetryKey] = useState(0);
    const [activityError, setActivityError] = useState(false);
    const [activityReady, setActivityReady] = useState(false);
    const activityCloseButton = useRef(null);

    const sendReady = useCallback(() => {
        if (window.parent !== window) {
            window.parent.postMessage({ protocol: ROOM_PROTOCOL, type: 'ROOM_READY' }, parentOrigin);
        } else {
            setStatus('standalone');
        }
    }, [parentOrigin]);

    useEffect(() => { sendReady(); }, [sendReady]);

    useEffect(() => {
        const onMessage = (event) => {
            if (event.source === activityFrame.current?.contentWindow && event.origin === window.location.origin && isRoomMessage(event.data)) {
                if (activeDestination?.requestId === event.data.requestId) {
                    if (event.data.type === 'ROOM_ACTIVITY_READY') { setActivityError(false); setActivityReady(true); }
                    if (event.data.type === 'ROOM_ACTIVITY_FAILED') setActivityError(true);
                }
                return;
            }
            if (event.source !== window.parent || event.origin !== parentOrigin || !isRoomMessage(event.data)) return;
            if (event.data.type === 'ROOM_CONTEXT') {
                const nextDestinations = Array.isArray(event.data.destinations) ? event.data.destinations : [];
                const activeStillAllowed = activeDestination && nextDestinations.some((destination) => destination.itemKey === activeDestination.itemKey);
                const pendingStillAllowed = pendingRequest.current && nextDestinations.some((destination) => destination.itemKey === pendingRequest.current.itemKey);
                let accessWasRevoked = false;
                if (activeDestination && !activeStillAllowed) {
                    accessWasRevoked = true;
                    setActiveDestination(null);
                    setActivityError(false);
                    setActivityReady(false);
                    lastFocus.current?.focus?.();
                    lastFocus.current = null;
                    setStatus('denied');
                }
                if (pendingRequest.current && !pendingStillAllowed) {
                    pendingRequest.current = null;
                    accessWasRevoked = true;
                }
                setDestinations(nextDestinations);
                setStatus(accessWasRevoked ? 'denied' : 'ready');
                return;
            }
            if (event.data.type !== 'ROOM_OPEN_RESULT') return;
            if (!pendingRequest.current || pendingRequest.current.requestId !== event.data.requestId || pendingRequest.current.itemKey !== event.data.itemKey) return;
            pendingRequest.current = null;
            if (event.data.status === 'allowed' && typeof event.data.url === 'string') {
                setActivityError(false);
                setActivityReady(false);
                setActiveDestination({ ...event.data, focus: lastFocus.current });
                setStatus('ready');
            } else {
                setStatus(event.data.status === 'denied' ? 'denied' : 'unavailable');
            }
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [activeDestination, parentOrigin]);

    useEffect(() => {
        if (status !== 'loading') return undefined;
        const timeout = window.setTimeout(() => setStatus('unavailable'), 15000);
        return () => window.clearTimeout(timeout);
    }, [status]);

    useEffect(() => {
        if (!activeDestination || activityError || activityReady) return undefined;
        const timeout = window.setTimeout(() => {
            console.error('[room] activity did not confirm readiness', { itemKey: activeDestination.itemKey });
            setActivityError(true);
        }, 10000);
        return () => window.clearTimeout(timeout);
    }, [activeDestination, activityError, activityReady]);

    useEffect(() => {
        if (!activeDestination) return undefined;
        const focusTimer = window.setTimeout(() => activityCloseButton.current?.focus(), 0);
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeDestination();
                return;
            }
            if (event.key !== 'Tab' || !activityCloseButton.current) return;
            event.preventDefault();
            activityCloseButton.current.focus();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [activeDestination]);

    const openDestination = (destination, button) => {
        if (window.parent === window) {
            setStatus('standalone');
            return;
        }
        lastFocus.current = button;
        const requestId = `room-open-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        pendingRequest.current = { requestId, itemKey: destination.itemKey };
        setStatus('opening');
        window.parent.postMessage({ protocol: ROOM_PROTOCOL, type: 'ROOM_OPEN_REQUEST', requestId, itemKey: destination.itemKey }, parentOrigin);
    };

    const closeDestination = () => {
        setActiveDestination(null);
        setActivityError(false);
        setActivityReady(false);
        setStatus('ready');
        lastFocus.current?.focus?.();
        lastFocus.current = null;
    };

    const retryScene = () => {
        setSceneFailed(false);
        setSceneRetryKey((value) => value + 1);
        setStatus(destinations.length ? 'ready' : 'loading');
    };

    const destinationsByStation = (station) => destinations.filter((destination) => destination.station === station);

    return (
        <div className="room-shell">
            <div className="room-scene" aria-hidden={Boolean(activeDestination)}>
                <Experience key={sceneRetryKey} onStationSelect={setSelectedStation} onError={() => { console.error('[room] scene failed'); setSceneFailed(true); }} />
                {sceneFailed && <div className="scene-error" role="alert"><span>Não foi possível carregar a sala 3D.</span><button type="button" onClick={retryScene}>Tentar novamente</button></div>}
            </div>

            <aside className="room-navigation" aria-label="Todos os locais">
                <div className="room-navigation-heading">
                    <div><p className="eyebrow">Sala individual</p><h1>Explore a sala</h1></div>
                    <p className="room-status" role="status">{status === 'loading' ? 'Carregando atividades…' : status === 'standalone' ? 'Entre pelo painel para acessar as atividades.' : status === 'denied' ? 'Esta atividade não está disponível para sua turma.' : status === 'unavailable' ? 'Não foi possível carregar a sala. Tente novamente.' : 'Escolha um local para começar.'}</p>
                </div>
                <div className="station-list">
                    {STATIONS.map((station) => {
                        const items = destinationsByStation(station.id);
                        return <section className={`station ${selectedStation === station.id ? 'selected' : ''}`} key={station.id}>
                            <button className="station-button" type="button" onClick={() => setSelectedStation(station.id)} aria-expanded={selectedStation === station.id}><span>{station.label}</span><small>{station.description}</small></button>
                            {selectedStation === station.id && <div className="destination-list">
                                {items.length === 0 ? <p className="empty-station">Nenhuma atividade liberada neste local.</p> : items.map((destination) => <button className="destination-button" key={destination.itemKey} type="button" onClick={(event) => openDestination(destination, event.currentTarget)} disabled={status === 'opening'}>{destination.label}<span aria-hidden="true">→</span></button>)}
                            </div>}
                        </section>;
                    })}
                </div>
            </aside>

            {activeDestination && <div className="activity-overlay" role="dialog" aria-modal="true" aria-labelledby="activity-title" aria-describedby="activity-description">
                <div className="activity-window">
                    <header className="activity-header"><div><h2 id="activity-title">{activeDestination.label}</h2><p id="activity-description">Atividade aberta dentro da sala.</p></div><button ref={activityCloseButton} type="button" onClick={closeDestination}>Fechar e voltar ao mapa</button></header>
                    {activityError ? <div className="activity-error" role="alert"><p>Não foi possível carregar esta atividade.</p><button type="button" onClick={closeDestination}>Fechar e voltar ao mapa</button></div> : <iframe ref={activityFrame} title={activeDestination.label} src={activeDestination.url} className="activity-frame" onError={() => { console.error('[room] activity iframe failed', { itemKey: activeDestination.itemKey }); setActivityError(true); }} />}
                </div>
            </div>}
        </div>
    );
}
