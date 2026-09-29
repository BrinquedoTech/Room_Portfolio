# Room Portfolio educativo

Esta é a sala individual do BrinquedoTech para turmas `MAP_V2`. Ela é publicada pelo portal em `/room/` e recebe o catálogo de atividades por `postMessage`; a sessão, a identidade e a autorização continuam no portal.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para produzir o artefato que o portal publica em `/room/`:

```bash
npm run build
```

A configuração Vite usa `base: '/room/'`, portanto o HTML e os ativos relativos devem ser servidos nesse subcaminho. A sala isolada mostra a lista de locais, mas somente o painel autenticado fornece destinos autorizados.

## Decodificação Draco

Os modelos GLB comprimidos usam os arquivos versionados em `public/draco`. Com o `base` do Vite, eles ficam disponíveis em `/room/draco/` tanto no desenvolvimento quanto no build publicado pelo dashboard.

## Molduras da sala

As três molduras do modelo recebem fotos no componente `src/RoomModel/photoFrame.jsx`: a moldura grande usa a foto da família, a moldura superior usa a foto de Bingo e Chilli e a moldura pequena usa a mesma fonte com outro recorte. As coordenadas são locais ao nó `frame` do `RoomModel.glb`; os UVs são invertidos horizontalmente para compensar a orientação do modelo. Cada recorte é aplicado na geometria do quadro, mantendo a textura compartilhada sem mutações entre molduras.
