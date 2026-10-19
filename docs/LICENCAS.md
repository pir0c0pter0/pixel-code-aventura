# Licenças e fontes externas

## Dependência efetivamente utilizada

**Blockly 12.5.1**, da Raspberry Pi Foundation (originada no Google), sob licença **Apache License 2.0**. Utilizado como editor de blocos visuais, carregado no navegador de `https://cdn.jsdelivr.net/npm/blockly@12.5.1/blockly.min.js`.

Código-fonte: https://github.com/RaspberryPiFoundation/blockly
Licença completa: https://github.com/RaspberryPiFoundation/blockly/blob/main/LICENSE

Se fizer uma cópia local do Blockly ou distribuir uma versão modificada, inclua o arquivo de licença e eventuais avisos obrigatórios pertinentes à dependência.

## Projetos pesquisados (não incluídos no ZIP)

- **Blockly Games** — https://github.com/blockly-games/blockly-games — Apache-2.0; referência de organização pedagógica de fases.
- **CodeKids** — https://github.com/mazipan/coding-kids — referência de currículo; código não copiado.
- **Kenney Pixel Platformer** — https://kenney.nl/assets/pixel-platformer — CC0 1.0; alternativa para ampliar arte no futuro; arquivos não incorporados.
- **Phaser** — https://phaser.io/download/license — MIT; considerado, mas não incluído. O motor deste MVP usa Canvas nativo para reduzir dependências.

## Materiais criados para Pixel Code

`game.js`, `index.html`, `style.css`, sprites do robô, ícones PNG, artes de cenário, trilha chiptune e efeitos sonoros foram criados especificamente para esta entrega. Sem conteúdo licenciado dos projetos de referência acima, além da utilização do Blockly por CDN. Os arquivos de música foram sintetizados por `make_assets.py`, sem samples ou melodias extraídas de músicas comerciais.

**Fontes tipográficas opcionais:** Nunito e Press Start 2P são solicitadas ao Google Fonts no CSS; o navegador usa fontes locais substitutas caso não consiga carregar. Verifique as licenças de cada família na distribuição do Google Fonts para empacotamento local.

## Novas artes (versão 2)

O cenário do vale encantado, as folhas de sprites do robô Lumi e da raposa Faísca e o kit de cenário foram produzidos para o projeto neste trabalho. São distribuídos neste ZIP em `assets/art/source`, com exportações geradas pelo script `tools/build_atlas.py` (atlas GPU, retratos e faixas de animação). Os quatro arquivos originais são separados das bibliotecas open source e não foram extraídos do repositório Blockly nem dos pacotes Kenney.

O compositor WebGL2 (`gpu-renderer.js`) e as alterações de interface foram criados especificamente para este projeto; a biblioteca Blockly continua externa e sob os termos de terceiros descritos acima.
