# Pixel Code — planejamento das fases 01–10

Status: especificação de conteúdo e aceitação; nenhuma funcionalidade descrita como nova está implementada por este documento. Recorte: sequências, direções absolutas, depuração e repetição contada. Condicionais e repetição até uma condição ficam para as etapas posteriores.

## Convenções implementáveis

- Coordenadas: `x=1..10`, `y=1..6`; direita/E aumenta x, esquerda/W diminui x, baixo/S aumenta y, cima/N diminui y. Cada comando de movimento desloca uma célula da tela, independentemente da orientação anterior do robô.
- A rota começa na posição inicial; a união de todas as células visitadas define o piso transitável. Todas as demais células são obstáculos. A última célula é o portal. Não há interruptores, portões ou sensores nestas dez fases. Orientação inicial: E.
- Cristais são identificados pelas coordenadas explícitas abaixo, coletados automaticamente ao entrar na célula, uma única vez por execução. Revisitar uma célula não cria outro cristal.
- Vitória: chegar ao portal com todos os cristais. Qualquer programa válido que cumpra isso vence; o uso do conceito pode melhorar estrelas, mas não deve bloquear a vitória. O limite de três estrelas conta os blocos escritos, incluindo cada contêiner `REPETIR`, e não as ações executadas. As soluções de referência são para validação/exemplo solicitado, nunca inseridas pelo tutorial.
- Blocos B: `DIREITA`, `ESQUERDA`, `CIMA`, `BAIXO` (`lumi_move_*`). Fases 01–05 disponibilizam B, com destaque somente no bloco ensinado. Blocos R: B + `REPETIR n VEZES`, com n inteiro de 2 a 6 e corpo editável. Fases 06–10 disponibilizam R; não exibir IF, ELSE, operadores booleanos, ATIVAR nem ATÉ O PORTAL.
- `DIREITA; DIREITA` no pseudocódigo significa dois blocos distintos; `REPETIR 3 { DIREITA }` significa um contêiner e um bloco filho. Todos os programas começam com o mapa reiniciado. PASSO executa um movimento por clique, inclusive dentro de laços.
- Os usos reais abaixo entram em uma frase de contexto da missão, sem exigir dispositivos, contas ou integração externa.

## Contrato comum dos balões

Um único balão contextual por vez, com fundo semitransparente escuro, texto opaco e contraste mínimo 4,5:1. Posicionar acima do retângulo visual do alvo e desenhar uma seta apontando para ele. Se faltar espaço, tentar abaixo, depois lateral, mantendo margem de 12 px na viewport e sem cobrir o alvo. Em telas muito pequenas, reduzir a largura e reposicionar; não recorrer a modal central. Não abrir balão enquanto seu alvo estiver fora da viewport; mostrar quando o alvo ficar visível ou mediante reabertura do guia.

Robô, cristal, portal e célula usam âncoras semânticas projetadas do mapa para o retângulo real do canvas; acompanhar escala, rolagem, redimensionamento e renderização WebGL2/Canvas 2D; explicar objetos móveis somente com Lumi parado. Não usar coordenadas fixas da página. Blocos usam o retângulo real da peça visível no Blockly ou do botão/cartão correspondente no editor simplificado. Alvo removido, cristal coletado ou mudança de fase fecha o balão obsoleto.

O alvo continua clicável, arrastável e operável por teclado. Camada externa não captura eventos; apenas controles do próprio balão recebem interação. Não prender foco, não escurecer toda a tela, não pausar execução nem interceptar comandos. Oferecer fechar e pular orientação; Escape fecha o balão e mantém o foco anterior. Para etapas descritivas, oferecer “Entendi”; etapas de ação avançam pela ação real ou podem ser puladas. Anunciar texto uma vez, sem repetição a cada reposicionamento. Orientações não acrescentam, removem, reordenam ou substituem blocos nem alteram salvamentos.

Ao retornar a uma fase, não reiniciar uma sequência já dispensada na mesma sessão. O guia e DICA permitem reabrir a explicação correspondente. Balões de erro só aparecem depois de interrompida a execução; sucesso fecha orientações pendentes antes da apresentação da vitória. Cada texto entre aspas nas tabelas tem no máximo 24 palavras.

## 01 — O primeiro passo

**Conceito/pré-requisitos:** sequência; nenhuma experiência exigida. Reconhecer personagem, coleta, destino, biblioteca e programa antes de apresentar recursos de depuração.

**Objetivo e uso real:** levar Lumi ao portal coletando o cristal. Uma sequência ordenada funciona como os passos de uma receita.

**Mapa:** início `(2,3)`; rota `EEE`; piso `(2,3),(3,3),(4,3),(5,3)`; cristal `(4,3)`; portal `(5,3)`. Preserva a rota existente.

**Blocos/estrelas:** B; três estrelas com até 3 blocos.

**Referência:** `DIREITA; DIREITA; DIREITA` — 3 movimentos, 3 blocos.

**Cenários e vitória:** execução contínua ou três cliques em PASSO produzem `(3,3)`, `(4,3)` com coleta, `(5,3)` com vitória. Dois comandos terminam antes do portal; editor vazio informa como começar sem mover Lumi; CIMA no início colide sem sair de `(2,3)`.

**Roteiro inicial completo:** é a exceção ao limite de 2–3 balões por fase. Robô → cristal → portal apresentam o mapa, com avanço por “Entendi”; bloco → editor acompanham a montagem real. EXECUTAR aparece após montar; PASSO e REINICIAR são contextuais. Não exigir oito confirmações antes de jogar: cada ação real pode antecipar a etapa correspondente e toda orientação pode ser pulada. As explicações dos objetos ficam estáveis antes da execução, sem exigir leitura durante a animação.

| Alvo semântico | Momento e transição | Texto |
|---|---|---|
| `map.robot` | Primeira entrada, editor vazio; Entendi avança ao cristal. Se já houver programa salvo, não iniciar a montagem guiada. | “Este é Lumi. Seus comandos o levam até o portal, pegando o cristal no caminho.” |
| `map.crystal(4,3)` | Após apresentar o robô; Entendi avança ao portal. Se a execução começar, fechar para não acompanhar um cristal coletado. | “Este cristal é coletado quando Lumi passa por ele. Pegue todos antes de terminar.” |
| `map.goal(5,3)` | Após apresentar o cristal; Entendi avança ao bloco. Se o jogador começar a montar, seguir diretamente à etapa de montagem. | “Este é o portal. Depois de pegar todos os cristais, chegue aqui para vencer.” |
| `palette.move_right` | Depois do portal; destacar a peça visível, sem abrir ou mover peças automaticamente. Avançar ao inserir um bloco. | “Este bloco anda uma casa para a direita da tela. Arraste para seu programa.” |
| `palette.move_right` no fallback | Mesmo evento, substitui o texto anterior. | “Este comando anda uma casa para a direita da tela. Toque para adicionar ao programa.” |
| `workspace.program` | Depois da primeira inserção; seta no bloco inserido/editor, sem cobrir área de encaixe. Fechar quando houver três movimentos conectados. | “Os comandos acontecem de cima para baixo. Encaixe mais dois blocos de direita para formar três passos.” |
| `workspace.program` no fallback | Mesmo evento, substitui o texto anterior. | “Os comandos acontecem de cima para baixo. Adicione mais dois comandos de direita à lista.” |
| `controls.run` / `#runBtn` | Ao existir sequência de três movimentos; não exigir solução exata para habilitar o controle. Fechar ao executar ou usar PASSO. | “Execute para testar seu programa. Observe a ordem dos movimentos de Lumi.” |
| `controls.step` / `#stepBtn` | Contextual: após programa terminar incompleto/colidir ou ao abrir sua ajuda com execução parada; não interromper tentativa em andamento. | “PASSO executa um movimento por clique. Use para descobrir onde seu programa precisa mudar.” |
| `controls.reset` / `#resetBtn` | Depois do primeiro PASSO, com execução parada; só uma vez, ou ao pedir ajuda do botão. | “REINICIAR devolve Lumi ao começo e recupera os cristais. Seus blocos continuam no editor.” |

Se o jogador executar antes de completar a sequência guiada, encerrar as dicas de montagem e usar os eventos de execução. Se nunca precisar de PASSO/REINICIAR, esses textos continuam disponíveis na ajuda contextual, sem aparecer após a vitória. Pular fecha a orientação, não impede eventos de jogo nem remove o guia reabrível.

**Erro comum/dica:** achar que um bloco percorre todo o corredor. Dica: “Compare a quantidade de casas até o portal com a quantidade de comandos.”

**Verificações:** testar os cinco estados citados; assertar coleta no segundo movimento e vitória no terceiro. Em ambos os editores, finalizar por ação real, dispensar orientação, reabrir guia e recarregar com programa salvo sem alteração de conteúdo. Arrastar/clicar o alvo com balão aberto deve funcionar. PASSO e REINICIAR não aparecem antes de sua necessidade. Conferir seta sobre robô, cristal e portal em renderizadores e larguras 320, 390 e 1440 px.

## 02 — Uma curva no caminho

**Conceito/pré-requisitos:** ordem entre direções; sequência da fase 01. Direções se referem à tela, não ao lado para o qual Lumi está olhando.

**Objetivo e uso real:** virar no momento correto, como instruções de navegação entre corredores de uma escola.

**Mapa:** início `(2,2)`; rota `EESS`; cristal `(4,3)`; portal `(4,4)`; curva `(4,2)`. Preserva a rota existente.

**Blocos/estrelas:** B; três estrelas com até 4 blocos.

**Referência:** `DIREITA; DIREITA; BAIXO; BAIXO` — 4 movimentos, 4 blocos.

**Cenários e vitória:** quatro movimentos coletam o cristal e chegam ao portal. `DIREITA; BAIXO` colide em `(3,2)` ao tentar `(3,3)`; trocar a ordem dos grupos não produz o mesmo resultado.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `map.cell(4,2)` | Entrada na fase, quando visível. | “O caminho muda aqui. A ordem dos comandos decide onde Lumi faz a curva.” |
| `palette.move_down` | Primeira seleção/foco no bloco ou dica. | “BAIXO sempre desce uma casa da tela, mesmo quando Lumi olha para outro lado.” |
| `workspace.failedMove` | Depois de uma curva antecipada; alvo é o bloco que falhou. | “Veja onde Lumi parou. Compare essa casa com o comando que tentou executar.” |

**Erro comum/dica:** virar uma casa antes. Dica: “Conte os espaços até a curva, sem contar a casa inicial.”

**Verificações:** referência termina em `(4,4)` com zero cristais; curva antecipada preserva `(3,2)`; testar BAIXO com orientação inicial N/E/S/W e mesmo destino. Balão de erro ancora no bloco executado, não no seguinte.

## 03 — Agora para cima

**Conceito/pré-requisitos:** alternar segmentos com CIMA; fases 01–02.

**Objetivo e uso real:** seguir um desvio curto e retomar o trajeto, como um robô de entrega que contorna uma área fechada.

**Mapa:** início `(2,4)`; rota `EENEE`; cristal `(4,3)`; portal `(6,3)`; curva ascendente em `(4,4)`. Preserva a rota existente.

**Blocos/estrelas:** B; três estrelas com até 5 blocos.

**Referência:** `DIREITA; DIREITA; CIMA; DIREITA; DIREITA` — 5 movimentos, 5 blocos.

**Cenários e vitória:** coletar o cristal na subida e terminar em `(6,3)`. Um terceiro DIREITA antes de subir tenta `(5,4)` e colide. CIMA duas vezes tenta `(4,2)` e colide.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `palette.move_up` | Entrada, quando a peça estiver visível. | “CIMA sobe uma casa da tela. Use quando o caminho subir.” |
| `map.cell(4,4)` | Dica solicitada ou primeira parada nessa curva por PASSO. | “Depois da subida, o caminho segue para outro lado. Observe o trecho que vem a seguir.” |

**Erro comum/dica:** confundir subir com virar o robô. Dica: “O nome do bloco indica para onde a casa vizinha fica na tela.”

**Verificações:** referência percorre cinco casas novas; cristal desaparece exatamente no terceiro movimento. Verificar as duas colisões e que DIREITA após CIMA continua absoluto.

## 04 — Labirinto das folhas

**Conceito/pré-requisitos:** ESQUERDA, rastrear execução e corrigir uma instrução; fases 01–03.

**Objetivo e uso real:** encontrar um erro de direção, como conferir uma receita e corrigir um passo sem descartar todo o trabalho.

**Mapa:** início `(2,2)`; rota `EEESSWWS`; cristais `(4,2),(4,4)`; portal `(3,5)`; primeira mudança para esquerda em `(5,4)`. Preserva a rota existente.

**Blocos/estrelas:** B; três estrelas com até 8 blocos.

**Referência:** `DIREITA; DIREITA; DIREITA; BAIXO; BAIXO; ESQUERDA; ESQUERDA; BAIXO` — 8 movimentos, 8 blocos.

**Cenários e vitória:** coletar ambos os cristais e alcançar `(3,5)`. Como exemplo textual opcional de diagnóstico, apresentar a referência com o sexto comando trocado por DIREITA; nunca carregar isso automaticamente no editor. Ao executar essa tentativa, Lumi para em `(5,4)` tentando `(6,4)`. Corrigir esse comando e reiniciar deve permitir vencer.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `palette.move_left` | Entrada ou primeira seleção. | “ESQUERDA anda uma casa para a esquerda da tela. O caminho também pode voltar.” |
| `controls.step` | Ao pedir dica de depuração, com execução parada. | “Execute um passo por vez e compare cada movimento com a casa que você esperava alcançar.” |
| `workspace.failedMove` | Depois da colisão, se existir bloco identificável. | “Este comando tentou sair do caminho. Revise sua direção antes de alterar o restante.” |

**Erro comum/dica:** trocar a volta por uma continuação à direita. Dica: “Compare a posição do próximo piso com a posição atual de Lumi.”

**Verificações:** exemplo incorreto falha no sexto movimento; nenhuma coleta se repete após revisitar piso; REINICIAR preserva o programa e restaura ambos os cristais. Validar que dispensar/reabrir a dica deixa o programa serializado idêntico.

## 05 — Guardiã da floresta

**Conceito/pré-requisitos:** planejar, testar e revisar uma sequência completa; fases 01–04.

**Objetivo e uso real:** dividir a entrega em trechos, como organizar tarefas de uma rotina antes de executá-las.

**Mapa:** início `(2,4)`; rota `EENNEESSE`; cristais `(4,3),(6,3)`; portal `(7,4)`. Preserva a rota existente. `(4,4)` e `(6,4)` são separados por obstáculo em `(5,4)`.

**Blocos/estrelas:** B; três estrelas com até 9 blocos.

**Referência:** `DIREITA; DIREITA; CIMA; CIMA; DIREITA; DIREITA; BAIXO; BAIXO; DIREITA` — 9 movimentos, 9 blocos.

**Cenários e vitória:** coletar ambos os cristais em lados distintos do arco e chegar a `(7,4)`. Tentar cruzar diretamente de `(4,4)` para `(5,4)` colide. Chegar a qualquer outra célula com todos os cristais não vence.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `map.robot` | Entrada. | “Observe todo o caminho antes de programar. Separe mentalmente os trechos retos e as curvas.” |
| `map.crystal(6,3)` | Dica, se o cristal ainda existir. | “Sua entrega só termina depois de visitar todos os cristais e alcançar o portal.” |
| `controls.step` | Após execução incompleta, antes da próxima tentativa. | “Teste sua previsão: o próximo comando leva Lumi para a casa que você escolheu?” |

**Erro comum/dica:** pular uma subida por enxergar o destino perto. Dica: “Proximidade não garante passagem; confira quais casas fazem parte do caminho.”

**Verificações:** nove movimentos legais; cristal 1 no movimento 3 e cristal 2 no movimento 7; nenhuma vitória fora do portal; colisão em `(5,4)` não desloca o robô. Não desbloquear repetição antes de concluir esta fase.

## 06 — Passos repetidos

**Conceito/pré-requisitos:** repetição contada de uma ação; sequências dominadas na fase 05.

**Objetivo e uso real:** percorrer cinco casas com uma instrução repetida, como imprimir cinco cópias de um mesmo desenho.

**Mapa:** início `(2,3)`; rota `EEEEE`; cristais `(4,3),(6,3)`; portal `(7,3)`. Preserva a rota existente.

**Blocos/estrelas:** R; três estrelas com até 2 blocos. Cinco comandos individuais também vencem, mas não atingem três estrelas.

**Referência:** `REPETIR 5 { DIREITA }` — 5 movimentos, 2 blocos.

**Cenários e vitória:** corpo de um movimento executado cinco vezes chega ao portal com duas coletas. Quatro repetições param em `(6,3)` sem vencer; corpo vazio não move e termina com informação de programa incompleto. Não exigir ausência de comandos posteriores à chegada, pois o motor encerra no sucesso.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `palette.repeat` | Entrada, quando visível. | “REPETIR executa os comandos dentro dele várias vezes. Use para passos iguais.” |
| `workspace.repeat.body` | Depois de inserir a repetição, enquanto o corpo estiver vazio. | “Coloque o movimento dentro deste espaço. Um bloco depois da repetição fica fora do grupo.” |
| `workspace.repeat.count` | Depois de preencher o corpo, antes da primeira execução. | “Este número indica quantas vezes o grupo inteiro será executado. Conte as casas até o portal.” |

**Erro comum/dica:** deixar DIREITA fora do contêiner. Dica: “Confira se o movimento está encaixado dentro da repetição.”

**Verificações:** expansão da referência gera exatamente cinco movimentos e AST com dois nós; PASSO avança apenas uma casa; corpo vazio termina sem travamento; quatro repetições não vencem. Confirmar ferramentas R nos dois editores e ausência de ATÉ O PORTAL.

## 07 — O grande L

**Conceito/pré-requisitos:** dois laços em sequência; fase 06.

**Objetivo e uso real:** repetir operações diferentes em etapas, como produzir um lote e depois embalar o lote.

**Mapa:** início `(2,1)`; rota `EEEESSSS`; cristais `(5,1),(6,3)`; portal `(6,5)`; curva `(6,1)`. Preserva a rota existente.

**Blocos/estrelas:** R; três estrelas com até 4 blocos.

**Referência:** `REPETIR 4 { DIREITA }; REPETIR 4 { BAIXO }` — 8 movimentos, 4 blocos.

**Cenários e vitória:** primeiro laço chega à curva, segundo ao portal; ambos os cristais coletados. Inverter os laços tenta `(2,2)` e colide de imediato. Repetir DIREITA oito vezes colide após a curva; limite de 6 no seletor evita construir isso em um único contêiner pela interface.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `map.cell(6,1)` | Entrada. | “A direção muda nesta curva. Cada trecho pode usar sua própria repetição.” |
| `workspace.repeat.second` | Ao adicionar o segundo laço em sequência. | “Este grupo começa depois que o primeiro termina. A ordem continua importante.” |

**Erro comum/dica:** colocar BAIXO dentro do mesmo corpo sem perceber. Dica: “Confira se cada trecho começa somente depois de terminar o anterior.”

**Verificações:** exatamente quatro movimentos E seguidos de quatro S; laços são irmãos na AST, não aninhados; solução de quatro blocos ganha três estrelas. Testar laços invertidos e rastrear a transição na quarta/quinta ação.

## 08 — Escadaria dourada

**Conceito/pré-requisitos:** contagens diferentes e comando fora do laço; fases 06–07.

**Objetivo e uso real:** repetir o trabalho principal e fazer uma ação final, como imprimir páginas e depois encerrar a tarefa.

**Mapa:** início `(2,1)`; rota `EEEESSSE`; cristais `(6,1),(6,4)`; portal `(7,4)`. Preserva a rota existente.

**Blocos/estrelas:** R; três estrelas com até 5 blocos.

**Referência:** `REPETIR 4 { DIREITA }; REPETIR 3 { BAIXO }; DIREITA` — 8 movimentos, 5 blocos.

**Cenários e vitória:** terminar os dois laços e executar a ação final chega ao portal. Omitir DIREITA final deixa Lumi em `(6,4)` com zero cristais, sem vitória. Repetir BAIXO quatro vezes colide tentando `(6,5)`.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `map.cell(6,4)` | Entrada. | “O último trecho tem só um passo. Nem todo movimento precisa de repetição.” |
| `workspace.repeat.count` | Selecionar a segunda contagem, ou pedir dica. | “Trechos diferentes podem ter quantidades diferentes. Conte cada um separadamente.” |
| `workspace.program` | Execução termina em `(6,4)` sem vencer. | “Todos os cristais foram coletados. Ainda falta levar Lumi ao destino.” |

**Erro comum/dica:** colocar o passo final no corpo do laço anterior. Dica: “A ação final deve acontecer a cada volta ou apenas depois de todas?”

**Verificações:** referência coleta nos movimentos 4 e 7 e vence no 8; remover último bloco não vence; contagem excessiva colide sem sair do piso. Destacar no editor a ação final fora dos contêineres.

## 09 — Caminho zigue-zague

**Conceito/pré-requisitos:** repetir um grupo com mais de uma instrução; fases 06–08. Nenhum laço aninhado necessário.

**Objetivo e uso real:** reconhecer um padrão completo, como repetir “separar, dobrar, guardar” para cada peça de roupa.

**Mapa:** início `(1,2)`; rota proposta `EESEESEES`; piso `(1,2),(2,2),(3,2),(3,3),(4,3),(5,3),(5,4),(6,4),(7,4),(7,5)`; cristais `(3,2),(5,3),(7,4)`; portal `(7,5)`. Substitui a rota irregular existente `EEESSEEES` para que três grupos idênticos sejam observáveis, mantendo nove movimentos, início e destino existentes.

**Blocos/estrelas:** R; três estrelas com até 4 blocos.

**Referência:** `REPETIR 3 { DIREITA; DIREITA; BAIXO }` — 9 movimentos, 4 blocos.

**Cenários e vitória:** cada iteração pega um cristal e termina um degrau; após três grupos, chega ao portal. Apenas duas iterações param em `(5,4)` com um cristal restante. Corpo `DIREITA; BAIXO; DIREITA` colide no segundo movimento tentando `(2,3)`.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `map.cell(3,3)` | Entrada; seta aponta ao fim do primeiro grupo. | “Este trecho forma um padrão que aparece novamente no caminho. Procure onde ele começa e termina.” |
| `workspace.repeat.body` | Ao editar o corpo ou pedir dica. | “Uma repetição pode conter vários comandos. Cada volta executa o grupo completo, na mesma ordem.” |
| `workspace.repeat.count` | Após tentativa com duas iterações. | “Conte quantos grupos cabem no caminho, não quantos comandos existem dentro de um grupo.” |

**Erro comum/dica:** repetir apenas a primeira direção do padrão. Dica: “Compare um degrau inteiro com o seguinte; quais movimentos aparecem nos dois?”

**Verificações:** fim das iterações em `(3,3),(5,4),(7,5)`; nove movimentos, três coletas, quatro nós escritos; corpo permanece idêntico em cada iteração. Testar duas iterações e corpo reordenado. Ajustar o exemplo de solução desta fase para refletir o grupo completo; compressão automática apenas de trechos retos não exemplifica o conceito.

## 10 — A última duna

**Conceito/pré-requisitos:** planejar laços e revisar contagens em trajeto com retorno; fases 01–09.

**Objetivo e uso real:** buscar uma entrega fora do caminho direto antes de terminar, como um roteiro que precisa visitar todos os pontos de coleta.

**Mapa:** início `(2,1)`; rota `EEEESSSWWEEE`; cristais `(6,1),(4,4),(6,4)`; portal `(7,4)`. Preserva a rota existente; células `(5,4)` e `(6,4)` são revisitadas. Índices de cristais na rota, contando início como zero: `4,9,11`. O índice antigo `12` aponta para o portal; o clamp de `makeLevel` atualmente o desloca para o índice 11. Explicitar `11` ou a coordenada `(6,4)` preserva a localização efetiva sem depender dessa correção silenciosa.

**Blocos/estrelas:** R; três estrelas com até 8 blocos.

**Referência:** `REPETIR 4 { DIREITA }; REPETIR 3 { BAIXO }; REPETIR 2 { ESQUERDA }; REPETIR 3 { DIREITA }` — 12 movimentos, 8 blocos.

**Cenários e vitória:** visitar o desvio esquerdo, recolher todos os cristais e terminar em `(7,4)`. O atalho `REPETIR 4 { DIREITA }; REPETIR 3 { BAIXO }; DIREITA` alcança o portal com o cristal `(4,4)` faltando e não vence. Pode-se sair do portal, buscar o cristal faltante e voltar: a vitória continua baseada no estado final, não em seguir uma rota única.

| Alvo semântico | Momento | Texto |
|---|---|---|
| `map.crystal(4,4)` | Entrada. | “Este cristal fica fora do caminho direto ao portal. Planeje a coleta antes de terminar.” |
| `map.cell(6,4)` | Primeira revisita por PASSO ou dica solicitada. | “Você pode passar novamente pela mesma casa. O cristal coletado não reaparece durante a execução.” |
| `map.goal(7,4)` | Ao chegar sem todos os cristais, com execução parada. | “Chegar aqui ainda não basta. Observe qual cristal ficou para trás.” |

**Erro comum/dica:** otimizar pulando uma coleta obrigatória. Dica: “Uma solução menor só serve se cumprir todas as partes da missão.”

**Verificações:** 12 movimentos na referência; três cristais distintos; coleta de `(6,4)` ocorre na primeira passagem, movimento 7, mesmo estando descrita pelo índice 11 da rota. Revisitá-la não incrementa a coleta. Atalho chega a `(7,4)` com um cristal e não vence. Confirmar que movimentos adicionais permitem sair do portal incompleto e voltar após coletar. Os oito nós da solução concedem três estrelas.

## Integração e aceitação do recorte

1. `game.js`: os dados das dez fases saem de `SEEDS` para `levels.js`, normalizados por `makeLevel`; atualizar descrições, dicas, limites e a rota 09. As referências 01–08 e 10 cabem nos blocos e na AST atuais. A 09 precisa de exemplo com corpo composto em `sampleSolution`; garantir equivalência entre `createBlocklyBlock`/`blocklyBlockList` e fallback. `blockTypes` mantém B e R neste recorte. Não alterar semântica de direções relativas de programas antigos.
2. Substituir a chamada tutorial de `showTutorial` em `loadLevel(0)` por orientação ancorada; manter a separação de `showModal` para confirmações destrutivas, exemplo de solução e vitória. Vincular os eventos de orientação à montagem, `executionStep`, coleta e `resetProgram`, sem chamar `setSolution`. A orientação não limpa programas de `pc-code-*`.
3. `index.html`: aproveitar `#firstLevelTutorial` como entrada reabrível de ajuda, editor e controles atuais. O conteúdo resumido não deve voltar a abrir uma fila modal. `style.css` define semitransparência, contraste, seta e posicionamento adaptativo. Âncoras do mapa precisam acompanhar também `gpu-renderer.js`, que desenha sprites maiores que as células.
4. `tests/curriculo.cjs`: acrescentar casos positivos/negativos de cada fase descritos acima, incluindo corpo composto, retorno sobre cristais e portal incompleto. Validar coordenadas antes de construir o mapa, evitando que clamp silencioso oculte dados incorretos. Asserir que o exemplo de cada fase vence e obtém três estrelas.
5. `tests/ui.cjs`: substituir expectativas de tutorial modal de três passos pelas etapas ancoradas e contextuais; preservar testes de isolamento/foco dos modais reais. Incluir fallback sem CDN, teclado, arrastar com balão visível, seta sem sobreposição do alvo, resize/scroll, textos até 24 palavras e nenhuma alteração do programa por balões. Atualizar `tests/browser_smoke.py`, que hoje procura “PULAR TUTORIAL” no fluxo modal. `test.html` é uma página auxiliar sem todos os elementos atuais de `index.html`: não usar como fixture canônica do tutorial sem alinhá-la.
6. Compatibilidade: nove rotas são preservadas. Programas salvos da fase 09 podem deixar de resolver o novo mapa; não importá-los automaticamente como programa ativo da fase alterada. A migração versionada deve manter chaves legadas intactas e importar progresso/programas apenas quando houver equivalência semântica. Redução dos limites afeta apenas novas pontuações nas fases equivalentes. Expansão global para 50 fases, mundos e política completa de migração pertencem ao plano consolidado.

Este documento define verificações futuras de implementação. Sua revisão de planejamento consiste em simular as rotas e referências, conferir coleta/destino/contagens e revisar ancoragem e progressão didática; testes de UI da proposta dependem de implementação posterior.
