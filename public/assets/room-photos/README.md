# Imagens dos porta-retratos da sala

Esta pasta guarda os originais locais escolhidos para os porta-retratos 3D. A montagem `src/RoomModel/photoFrame.jsx` aplica uma textura separada a cada moldura, sem alterar o painel da parede.

| Arquivo | Foto prevista | Origem oficial |
| --- | --- | --- |
| `bluey-heeler-family.jpg` | Família Heeler | [Bluey — Heeler Family Wallpaper](https://www.bluey.tv/make/heeler-family-wallpaper/) |
| `bluey-bingo-chilli.jpg` | Bingo e Chilli | [Bluey — Bingo and Chilli Wallpaper](https://www.bluey.tv/make/bingo-and-chilli-wallpaper/) |

| Moldura | Arquivo aplicado | Recorte |
| --- | --- | --- |
| esquerda | `bluey-heeler-family.jpg` | faixa central/inferior com a família; a área azul vazia superior é removida |
| direita | `bluey-bingo-chilli.jpg` | faixa central com Bingo e Chilli; o espaço de wallpaper é reduzido |

## Como trocar uma foto

Substitua o JPG correspondente mantendo o nome do arquivo e atualize o build da sala quando a implementação passar a usar essas imagens. Os originais têm 1080 × 1920 px; uma nova imagem pode ter outra proporção, desde que o recorte da moldura seja conferido nos modos dia e noite. A aplicação deve manter cada porta-retrato associado a um caminho separado para que a troca de uma foto não altere as outras.

## Urso de pelúcia

`../bear-poly-pizza.glb` é o modelo **Bear**, de **jiang liu**, baixado de [Poly Pizza](https://poly.pizza/m/3Eb9oLfZYIc). A página identifica o arquivo como GLTF e publica o asset sob [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/). O crédito deve permanecer junto ao asset quando ele for substituído ou redistribuído.

O proprietário autorizou o uso das imagens da Bluey neste ajuste. BLUEY™ e seus personagens são © Ludo Studio, licenciados pela BBC Studios Distribution Ltd.; a origem dos arquivos fica registrada acima. A autorização do proprietário não é uma licença emitida pelos titulares da obra.
