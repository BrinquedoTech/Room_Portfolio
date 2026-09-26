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
