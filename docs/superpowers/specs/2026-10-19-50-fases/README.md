# Pixel Code — 50 fases e tutorial dentro do jogo

**Estado:** proposta de produto e implementação; não altera o jogo nesta etapa.
**Pedido:** planejar aproximadamente 50 fases, explicar todos os conceitos, melhorar seus usos nos desafios e substituir o tutorial inicial por balões levemente transparentes sobre os itens explicados. Cinco agentes elaboram dez fases cada; a coordenação consolida interfaces, experiência e verificações.
**Escopo adotado:** 50 fases no total, em dez mundos de cinco fases. Este desenho substitui a proposta anterior de limitar as mudanças às 20 fases existentes.

## Resultado esperado

A criança observa o mapa, conhece um conceito em um balão curto, experimenta e vê por que sua decisão funcionou. Cada operador tem introdução guiada, prática, comparação ou depuração e aplicação. A partir das condições, o mesmo programa precisa funcionar em cenários diferentes e conhecidos; mover sempre pelo mesmo caminho não basta para concluir todos eles.

As fases não dependem de tempo de reação, leitura rápida ou tentativa aleatória. Errar não remove estrelas nem programas. Exemplos continuam opcionais e só substituem o programa com confirmação.

## Catálogo por agente

| Fases | Mundos e progressão | Especificação |
| --- | --- | --- |
| 01–10 | Floresta do Começo; Deserto dos Repetecos — movimentos, ordem, depuração e repetir | [Fases 01–10](fases-01-10.md) |
| 11–20 | Vale das Perguntas; Encruzilhada das Escolhas — booleanos, IF, ELSE e NOT | [Fases 11–20](fases-11-20.md) |
| 21–30 | Pontes da Cooperação; Jardins das Alternativas — AND e OR | [Fases 21–30](fases-21-30.md) |
| 31–40 | Trilhos da Exclusividade; Usina das Inversões — XOR e NAND | [Fases 31–40](fases-31-40.md) |
| 41–50 | Observatório dos Sinais; Estação das Estrelas — NOR, XNOR, integração e laços condicionais | [Fases 41–50](fases-41-50.md) |

Nomes de mundo desta tabela são os canônicos. Nomes de locais dentro das fases são narrativos. As fichas detalham mapas, usos, soluções, entradas, balões e testes; os contratos comuns deste documento resolvem diferenças de nomenclatura entre fichas.

## As 50 missões em ordem

| Fase | Missão | Foco principal |
| --- | --- | --- |
| 01 | O primeiro passo | Sequências e direções |
| 02 | Uma curva no caminho | Sequências e direções |
| 03 | Agora para cima | Sequências e direções |
| 04 | Labirinto das folhas | Sequências e direções |
| 05 | Guardiã da floresta | Sequências e direções |
| 06 | Passos repetidos | Repetição contada |
| 07 | O grande L | Repetição contada |
| 08 | Escadaria dourada | Repetição contada |
| 09 | Caminho zigue-zague | Repetição contada |
| 10 | A última duna | Repetição contada |
| 11 | A pergunta do portão | Booleanos e IF |
| 12 | Olhe para a direita | Booleanos e IF |
| 13 | Duas perguntas independentes | Booleanos e IF |
| 14 | A placa mudou de lugar | Booleanos e IF |
| 15 | Perguntar a cada parada | Booleanos e IF |
| 16 | Um caminho ou o outro | IF/ELSE e NOT |
| 17 | Duas bifurcações | IF/ELSE e NOT |
| 18 | A pergunta ao contrário | IF/ELSE e NOT |
| 19 | Sem placa, pelo desvio | IF/ELSE e NOT |
| 20 | Duas estações, uma regra | IF/ELSE e NOT |
| 21 | A estufa precisa dos dois | AND |
| 22 | Oficina preparada | AND |
| 23 | O acesso apressado | AND |
| 24 | Transporte sem manutenção | AND |
| 25 | A ponte de suprimentos | AND |
| 26 | Uma fonte já ajuda | OR |
| 27 | Chamado de assistência | OR |
| 28 | A luz que não acendia | OR |
| 29 | Duas credenciais aceitas | OR |
| 30 | A estação de reserva | OR |
| 31 | Só um pedido por vez | XOR |
| 32 | Escolha da embalagem | XOR |
| 33 | Um pedido basta, um pedido apenas | XOR |
| 34 | O seletor que aceitava tudo | XOR |
| 35 | A entrega de trilho único | XOR |
| 36 | A inspeção permanece aberta | NAND |
| 37 | Revisão dos dois registros | NAND |
| 38 | Duas escritas, a mesma resposta | NAND |
| 39 | O NÃO ficou no lugar errado | NAND |
| 40 | Revisar e encaminhar | NAND |
| 41 | Silêncio no observatório | NOR |
| 42 | O corredor tranquilo | NOR |
| 43 | Duas maneiras de perguntar | NOR |
| 44 | Respostas em sintonia | XNOR |
| 45 | A dupla conferência | XNOR |
| 46 | Continue até chegar | Repetir até |
| 47 | Silêncio antes da curva | Integração progressiva |
| 48 | Nenhum alerta, respostas iguais | Integração progressiva |
| 49 | Pergunte em cada estação | Integração progressiva |
| 50 | A última viagem de Lumi | Integração progressiva |

## Vocabulário e explicações

| Conceito | Texto base para o jogador |
| --- | --- |
| Verdadeiro / falso | Uma pergunta do jogo pode ter resposta sim ou não. Chamamos essas respostas de verdadeiro e falso. |
| SE (IF) | Quando a resposta é verdadeira, Lumi faz os comandos de dentro. Quando é falsa, ele pula esses comandos. |
| SENÃO (ELSE) | Este é o outro caminho: Lumi faz estes comandos quando a pergunta do SE tem resposta falsa. |
| NÃO (NOT) | Inverte a resposta. Verdadeiro vira falso, e falso vira verdadeiro. |
| E (AND) | As duas perguntas precisam ter resposta verdadeira. Se uma delas for falsa, o resultado é falso. |
| OU (OR) | Basta uma resposta verdadeira. Se as duas forem verdadeiras, também vale. |
| OU EXCLUSIVO (XOR) | Exatamente uma resposta precisa ser verdadeira. Duas verdadeiras não valem. |
| NÃO E (NAND) | É o contrário de AND. Só fica falso quando as duas respostas são verdadeiras. |
| NEM UM NEM OUTRO (NOR) | Só fica verdadeiro quando as duas respostas são falsas. |
| RESPOSTAS IGUAIS (XNOR) | Fica verdadeiro quando as duas respostas são iguais: ambas verdadeiras ou ambas falsas. |

Operadores respondem perguntas; IF/ELSE escolhem ações. Os blocos precisam mostrar essa diferença pelo formato de encaixe e pelo texto. Não apresentar NAND como XOR: NAND também é verdadeiro quando as duas entradas são falsas. XNOR significa igualdade de respostas, não igualdade entre objetos físicos.

| A | B | AND | OR | XOR | NAND | NOR | XNOR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F | F | F | F | F | V | V | V |
| F | V | F | V | V | V | F | F |
| V | F | F | V | V | V | F | F |
| V | V | V | V | F | F | F | V |

Usar `sim/não` junto de `verdadeiro/falso` nas introduções. Painéis mostram nome, ícone e texto, nunca apenas cores. A/B são identificadores curtos acompanhados de significado, por exemplo “A: energia disponível”.

## Balões ancorados: padrão único

### Aparência e posicionamento

- Um balão ativo por vez, dentro da área do jogo, com seta apontando para o alvo e contorno de destaque nele.
- Fundo `rgba(16, 31, 48, .92)`: pouca transparência; texto e botões permanecem totalmente opacos. Não aplicar `opacity` ao contêiner inteiro.
- Texto principal de até 24 palavras, fonte mínima de 16 px, largura máxima 300 px e margem mínima de 12 px da área visível. Cabeçalho curto e contador `2 de 4` separados do texto.
- Preferir acima do item, com intervalo de 12 px. Se não couber, usar abaixo, direita ou esquerda; a seta continua apontando ao alvo. Não cobrir o item ou a área necessária para arrastar o bloco.
- Não escurecer toda a tela nem bloquear o jogo com modal central. Manter o mapa visível e permitir clicar/arrastar o alvo.
- Se o alvo estiver fora da tela, rolar até ele antes de posicionar. Em telas pequenas, manter balão e alvo no mesmo trecho visível; se for impossível, reduzir texto ou usar área adjacente com seta, nunca apontar para item invisível.
- Reposicionar no scroll, resize, zoom/pan do Blockly e mudança do editor. Respeitar `prefers-reduced-motion`; a informação não depende de animação.
- Balões não desaparecem por cronômetro. Controles: `VOLTAR`, `PRÓXIMO` ou `ENTENDI`, `PULAR GUIA`; Escape recolhe. Botões com área de toque mínima 44 × 44 px.

### Fluxo inicial

O roteiro detalhado está na ficha 01. A estrutura obrigatória é:

1. Sobre Lumi: “Este é Lumi. Cada bloco de movimento faz ele andar uma casa.”
2. Sobre o cristal e depois o portal, em passos separados: explicar coleta e chegada, sem pedir leitura longa.
3. Sobre o bloco Direita na paleta: convidar a arrastar; no fallback, convidar a tocar. Avançar ao detectar a ação correta ou pelo botão de navegação.
4. Sobre a área de encaixe: explicar ordem e conexão dos três comandos. Não inserir blocos automaticamente.
5. Sobre EXECUTAR: convidar a testar. Recolher o balão quando a execução começar.
6. PASSO é explicado quando a criança o usa ou pede ajuda para observar a execução; REINICIAR aparece após erro ou a pedido. Esses dois não aumentam a fila inicial antes da primeira tentativa.

Ao avançar manualmente sem fazer a ação sugerida, o tutorial ensina o próximo item; não marca a tarefa como feita. Nunca impedir jogar por não seguir a solução do tutorial.

### Próximas fases e gatilhos

As regras globais desta seção prevalecem sobre abreviações nas fichas: não pausar automaticamente a execução contínua a cada condição, não modificar o programa ao mostrar um exemplo e manter a margem de 12 px.

- Conceito novo: no máximo três balões encadeados antes da tentativa, apontando para objeto, bloco e efeito relevante. O mesmo padrão da fase 1 vale para todos.
- Prática do conceito conhecido: objetivo curto e ajuda contextual; não repetir automaticamente a introdução inteira.
- Após erro de lógica, apresentar um balão ligado à decisão relevante com entradas observadas e resultado. Exemplo: “As duas respostas foram sim. XOR ficou falso. O SENÃO foi escolhido.”
- No modo PASSO, parar antes de executar o ramo, mostrar a decisão e avançar ao próximo toque. Na execução contínua, guardar a última decisão em um painel consultável; não abrir popups a cada iteração.
- `ENTENDER` reabre os balões do conceito; `DICA` mostra uma orientação da ficha, ancorada no item relevante. `?` oferece novamente o guia inicial.
- Memorizar apenas guias dispensados/concluídos por identificador e versão do conteúdo. Pular não equivale a aprender; nunca conceder estrelas por fechar balões.
- Sair da fase, trocar cenário, reiniciar ou abrir um diálogo legítimo remove o balão e seus listeners. Fechar o diálogo não revive um alvo antigo.

### Acessibilidade e âncoras

O balão interativo usa região ou diálogo **não modal**, rotulado pelo título. Não usar `role=tooltip` para conteúdo com botões. O foco permanece no controle usado em passos automáticos; ao abrir manualmente, focar o balão e oferecer acesso ao alvo. Tab não fica preso. Escape devolve foco ao acionador, se ainda existir. Anunciar mudanças em uma região `aria-live=polite` sem repetir texto a cada frame.

Alvos canônicos: `robot`, `gem:<id>`, `goal`, `switch:<id>`, `gate:<id>`, `signal:<id>`, `palette:<blockType>`, `workspace`, `block:<id>`, `run`, `step`, `reset`, `scenario`, `decision`. As fichas usam nomes legíveis que serão mapeados a esses alvos. Não guardar seletores internos frágeis do Blockly nos dados das fases.

- Controles HTML: `getBoundingClientRect()` do elemento correspondente.
- Blocos: resolver a instância Blockly e seu SVG público quando disponível; fallback usa o botão/controle equivalente. Aguardar editor pronto antes de guiar.
- Células do canvas: converter coordenadas virtuais 768 × 576 pela razão entre o retângulo CSS e o tamanho interno. Centro de célula no Canvas2D: `(OX + (x+.5)*TILE, OY + (y+.5)*TILE)`; WebGL deve fornecer seus próprios mesmos parâmetros, sem presumir offsets idênticos.
- Robô em movimento: guiar somente quando parado ou pausar explicitamente a demonstração; não perseguir o sprite com balão pulando.
- Se o alvo foi removido/coletado ou não está disponível, usar seu equivalente estável no painel; se não existir equivalente, aguardar ou encerrar a etapa com instrução clara. Nunca balão em `(0,0)`.

## Desafios em vários cenários

Cada ficha especifica um conjunto finito de cenários, com identificadores, estado inicial e resultados. Não usar aleatoriedade para validar aprendizado.

- Fases 01–10 podem usar um cenário. A partir de 11, variar pelo menos os dois resultados da decisão; operadores binários cobrem 00, 01, 10, 11.
- A criança pode inspecionar e treinar qualquer cenário da fase liberada. Um controle `TESTAR TODOS` executa o mesmo programa desde o início em cada cenário, com indicador `Cenário 2 de 4`.
- Congelar uma cópia da AST ao iniciar a rodada. Editar ou carregar exemplo cancela a rodada e invalida resultados parciais; resultados de programas diferentes nunca se somam.
- Reiniciar posição, direção, cristais, interruptores, portões, contadores e rastros em cada cenário. Sinais somente leitura não são alterados por ATIVAR; placas e sinais são objetos distintos.
- Fase concluída somente quando todos os cenários passam. Recompensar uma vez e salvar atomicamente o resultado da fase; um cenário isolado não desbloqueia o próximo mundo.
- Chegar ao portal com todas as gemas encerra o cenário imediatamente e avalia as obrigações; comandos restantes não são executados. Chegar com gemas pendentes permite continuar procurando, como no jogo atual. A fase 46 ensina o laço até como solução compacta, sem fingir que uma sequência longa necessariamente colide depois de uma chegada já concluída.
- Validar chegada, coleta e obrigações explícitas da ficha: ativações corretas, rota permitida, ausência de ação proibida ou sequência de decisões. Mostrar essas obrigações ao jogador antes da execução.
- IF vazio ou bloco lógico desconectado não prova domínio. Aceitar soluções logicamente equivalentes que satisfaçam o comportamento; usar a solução de referência para ensinar o operador novo.
- Nas fases de depuração, `starterProgram` é um exemplo defeituoso específico da ficha, mostrado em prévia. `CARREGAR DESAFIO` o insere a pedido; se houver programa atual, confirmar antes de substituir. Entrar, reabrir ajuda e mudar cenário nunca sobrescrevem o trabalho.
- Oferecer uma rota ou ação válida tanto para condição verdadeira quanto falsa. Nenhum cenário exige atravessar um portão fechado ou coletar um cristal inacessível.
- Pausar/parar/sair cancela timers e eventos por token de execução, reaproveitando a proteção `serial` existente. Falha aponta cenário, entradas e primeira ação incorreta.

Fases de repetição aceitam a sequência longa correta, com feedback para experimentar o laço. Três estrelas dependem do orçamento de blocos, não da velocidade. Contar comandos e nós de expressão igualmente nos dois editores; definir o limite final executando a solução de referência, e usar a mesma tolerância atual de três blocos para duas estrelas. Não inventar orçamento numérico sem medir a AST implementada.

## Modelo mínimo a ampliar

O código atual tem 20 rotas lineares, uma placa, um portão e `activated` global. Não suporta ainda a experiência acima.

- Dados separados em `levels.js`, carregados antes de `game.js`: dez mundos, 50 fases, mapas, cenários, balões e AST de referência. Separação justificada pelo volume de conteúdo, sem criar framework de fases.
- Fase com `id` estável (`logic-01`…`logic-50`), `worldId`, `concepts`, `tools`, `start`, `goal`, `walkable`, `gems`, `switches`, `gates`, `signals`, `scenarios`, `tutorial`, `referenceProgram`, `starterProgram` opcional e critérios comportamentais da ficha.
- `makeLevel` deriva `themeId` do mundo para o nível normalizado, sem repetir configuração visual em cada ficha.
- Usar coordenadas explícitas para objetos. Rotas podem gerar `walkable` nos mapas lineares; mapas bifurcados precisam declarar união de caminhos/células. Índice de cristal fora da rota deve falhar na validação. A fase antiga 10 também usa o índice do portal, deslocado silenciosamente para a célula anterior; declarar a coordenada efetiva sem depender desse ajuste.
- Uma gema explicitamente posicionada no portal é válida: coletar antes de verificar chegada na mesma ação, como nas fases 42 e 45. Não aplicar o ajuste silencioso antigo a essas coordenadas.
- Sinais identificados, com rótulo, posição de painel e booleano por cenário. Portões com ID e estado/regra definidos pela ficha; placas com ID e efeito específico. Uma ativação afeta apenas o objeto configurado.
- AST de condição: sensores `{kind:'signal',id}`, sensores de estado do mapa, NOT com `operand` e operadores binários com `left/right`. AST de decisão: `{kind:'if',condition,children,elseChildren}`.
- IF/ELSE, NOT, AND, OR, XOR, NAND, NOR, XNOR executam no interpretador próprio. Sem geração/avaliação de JavaScript arbitrário.
- Manter movimentos cardinais; novos testes de caminho dizem a direção explicitamente. Bloco legado “caminho livre” continua relativo à direção para não mudar silenciosamente programas antigos.
- Cenários novos tratam ativar fora de placa ou operação proibida como falha com explicação. As fichas definem quais operações são obrigatórias; não adicionar objetivos ocultos.
- Limites: profundidade máxima de expressão 10, até 500 comandos por cenário e proteção de 100 voltas no laço até o portal. Validar todos os ramos e operandos antes de executar, inclusive um ramo que seria ignorado.
- Preservar `ifpath`, `ifswitch` e movimentos antigos no carregamento. Não usar operadores novos para substituir silenciosamente a representação dos programas existentes.

## Mundos, arte e progresso

Dez mundos pedagógicos não exigem dez conjuntos de sprites. Reutilizar quatro temas existentes com `themeId` explícito por mundo; renderizadores e música usam tema, navegação usa mundo. Isso evita acessar `THEMES[9]` ou `tones[9]` inexistentes. Mapeamento: mundos 1,3,6 usam floresta; 2,5 usam deserto; 4,7,8 usam cristais; 9,10 usam cosmos.

Remover limites fixos 20/19 e agrupamentos implícitos da navegação, vitória, progresso, reinício, legendas do canvas e testes. Agrupar fases por `worldId`; cinco por mundo é uma decisão de conteúdo validada, não a identidade de um registro salvo.

Usar armazenamento novo `pc-v2-progress`, `pc-v2-code:<id>`, `pc-v2-guides` e marcador `pc-v2-migrated`. Conservar `pc-progress` e `pc-code-*` intactos na atualização. Importar estrelas e programas somente onde mapa e semântica permanecerem iguais: fases antigas 01–08 e 10, mediante confirmação da implementação contra as fichas. Fase 09 redesenhada e antigas 11–20 não recebem conquistas de missões diferentes. Explicar a reorganização no primeiro acesso; dados antigos preservados não significam que todos se aplicam à nova trilha.

Migração idempotente: só gravar o marcador após gravar e reler os registros novos com sucesso; não sobrescrever registros v2 existentes. Falha de armazenamento mantém dados originais e sessão jogável, com aviso de que não foi possível salvar. Reinício voluntário confirmado apaga dados do jogo de ambas as versões e guias, mantendo áudio e chaves externas; depois registra migração concluída para não reimportar progresso apagado.

## Superfícies afetadas

| Arquivo | Responsabilidade na implementação |
| --- | --- |
| `levels.js` (novo) | Catálogo de fases/cenários, currículo e soluções explícitas |
| `tutorial.js` (novo) | Um controlador de balões, âncoras e ciclo de vida |
| `game.js` | Estado, operadores, execução, cenários, editores, objetivos, progresso e integração de guias |
| `index.html`, `style.css` | Balão, controles de cenários, painel de sinais e acessibilidade; substituir tutorial central |
| `gpu-renderer.js` | Tema explícito, objetos identificados e âncoras consistentes |
| `tests/curriculo.cjs` | 50 fases × todos os cenários, operadores, mapas e soluções equivalentes |
| `tests/ui.cjs` | Balões, mobile, dois editores, persistência, cenários e 50 fases |
| `tests/browser_smoke.py` | Novo tutorial e integração WebGL, preservando verificação de vitória |
| `README.md`, `docs/GUIA-EDUCADOR.md`, `package.json` | Currículo real, instruções e contagem de fases |
| `test.html` | Inspecionar seu uso antes da implementação; se continuar entrada de teste, atualizar contratos HTML e scripts junto de `index.html` |

`tests/assets.py` não precisa mudar se o atlas e as artes permanecerem iguais. Não gerar imagens ou novos assets nesta etapa.

## Critérios de aceite

1. Exatamente 50 IDs únicos e dez mundos com cinco fases; pré-requisitos ensinados antes do uso obrigatório.
2. Cada ficha tem mapa implementável, solução e cenários válidos; todos chegam ao destino sob o orçamento de execução.
3. Todas as tabelas-verdade corretas; IF e ELSE mutuamente exclusivos; condições reavaliadas após alteração de estado.
4. Desafios exigem decisões observáveis em cenários diferentes; nenhuma vitória depende só de achar um nome de bloco no programa.
5. Balões ancorados, pouco transparentes, sem cobrir alvo ou sair da viewport, em 320 × 568, 390 × 844, 667 × 375 e 1440 × 900.
6. Interação por toque e teclado, Blockly e fallback, WebGL e Canvas2D. Fechar, pular e reabrir não mudam o programa.
7. Mesmo comportamento e contagem de blocos nos dois editores; salvar/reabrir conserva expressões aninhadas.
8. Estrelas concedidas só após todos os cenários; alteração de programa invalida rodada; sair cancela eventos atrasados.
9. Atualização não apaga dados legados; fase 50 encerra corretamente, sem tentativa de abrir fase 51.
10. Revisão de linguagem e avaliação futura com crianças são separadas da validação técnica. O plano não afirma eficácia pedagógica já medida.

## Entrega e execução

As cinco fichas são contribuições de cinco agentes; a execução simultânea ocorre em duas rodadas por limite de três subagentes ativos. A especificação consolidada é a referência para a implementação, cujo roteiro está em [plano de execução](../../plans/2026-10-19-50-fases-e-baloes.md).

Nesta etapa são entregues documentos de planejamento. Alterações de runtime, capturas de interface e testes de navegador pertencem à implementação posterior.

## Verificação desta etapa de planejamento

- Cinco agentes concluíram os cinco recortes, sem editar código de produto. A coordenação revisou integrações e harmonizou balões, programas de depuração, migração e término de cenário.
- Catálogo conferido automaticamente: 50 fases, números 01–50 sem lacunas ou duplicatas; todos os links relativos existem.
- 148 textos de balões nas fichas, incluindo alternativas de editor e orientações contextuais, conferidos com limite de 24 palavras por texto.
- 172 cenários curriculares: 10 nas fases 01–10, 28 nas 11–20, 40 nas 21–30, 40 nas 31–40 e 54 nas 41–50. Os agentes simularam suas referências e verificaram trajetos, coleta e chegada; nas faixas de lógica, também portões e ativações. A coordenação repetiu a conferência geométrica das fases 01–10 e o replay das 68 referências de cenários 11–30.
- O agente das fases 31–40 também verificou 12 execuções de soluções equivalentes e os resultados dos dois programas defeituosos. Nas fases 41–50, os laços de referência ficaram em até oito voltas nos cenários definidos.
- Esses replays usam representações temporárias transcritas das fichas: validam a coerência do plano, não constituem testes do motor futuro. As verificações de interface, persistência, limites de execução, mutações restantes e uso com crianças continuam previstas no plano de implementação.
