# Fases 21 a 30 — decisões com AND e OR

## Contrato desta faixa

Planejamento das fases 21–25 (AND) e 26–30 (OR). A progressão de cada grupo é apresentação guiada, prática, depuração, reuso e desafio. Pressupõe direções absolutas, repetição, booleanos, IF/ELSE e NOT ensinados nas fases anteriores. XOR, NAND, NOR e XNOR não aparecem na paleta nem nas soluções desta faixa.

O código atual de `game.js` oferece movimentos absolutos, repetição, `ifswitch`, `ifpath`, um interruptor/portão e vitória por portal/gemas. Sensores A/B, expressões booleanas encaixáveis, cenários de avaliação, portões identificados e balões ancorados abaixo são **extensões propostas**, não funcionalidades existentes. `ifpath` não substitui sensores de estado: seus valores dependem da posição e direção de Lumi.

### Convenções para mapas e execução

- Coordenadas `(x,y)`: x cresce para a direita; y cresce para baixo; interior permitido x=1…10, y=1…6. Intervalos incluem extremos. Somente as células listadas são transitáveis; todas as outras são obstáculos.
- `D n`, `E n`, `C n`, `B n`: mover direita, esquerda, cima ou baixo n vezes. São abreviações documentais; no editor, usar movimentos individuais ou REPETIR de 2 a 6. Não são novos blocos.
- A e B são dois sinais visíveis, somente leitura, constantes durante uma execução. O painel mostra letra, significado, `SIM`/`NÃO` e símbolo, sem depender somente de cor. Os objetos sensores ficam fora da rota e não podem ser ativados por Lumi.
- Cada console C controla apenas o portão G de mesmo sufixo, indicado por vínculo visual. `ATIVAR` atua no console sob Lumi, sem parâmetro extra. O portão começa fechado em cada cenário. Quando a regra da fase é verdadeira, a ativação abre G; quando falsa, a ativação é recusada e registra erro da missão. A rota de desvio permanece aberta em todos os cenários.
- Todo cenário exige chegar ao portal fixo com todas as gemas. Além disso, deve executar **uma ativação válida se a regra for verdadeira, nenhuma tentativa se falsa**. Abertura exigida, tentativa indevida, colisão e falta de gemas são verificadas pelo comportamento, nunca pela presença nominal de AND/OR na árvore. Programas logicamente equivalentes são válidos. Usar o desvio depois da ativação válida também pode vencer.
- As quatro entradas são testadas deterministicamente, com o **mesmo programa sem edição** e reinício de posição, gemas, console e portão entre cenários. A fase só conclui depois de todos passarem. A ordem didática pode variar, mas não a cobertura. A/B não são botões para o aluno alterar durante a avaliação.
- “Direto” nas tabelas significa a rota de referência após ativar; “desvio” significa chegar sem ativar. Não atravessar G fechado em nenhum caso. O corredor falso sempre termina no mesmo portal seguro.
- Paleta **AND**: quatro movimentos, REPETIR, IF/ELSE com entrada booleana, sensores A/B, NOT, AND, ATIVAR e sensores previamente ensinados. Paleta **OR**: a anterior mais OR. Nenhuma etapa depende de REPETIR ATÉ, variável, função, temporizador ou sensor novo além dos dois sinais.

### Balões aplicáveis a todas as fases

Cada fase abaixo especifica três balões curtos, com alvo e momento. Exibir um por vez, preferencialmente acima do alvo, com seta apontando ao objeto ou bloco exato e fundo semitransparente suficientemente contrastante. Não cobrir o alvo, impedir clique/arraste ou usar tela modal. Se faltar espaço acima, posicionar abaixo ou ao lado dentro do viewport e manter a seta; se o alvo estiver fora da tela, rolar até ele antes de ancorar. Recalcular ao rolar, redimensionar ou mover blocos. Nos alvos do mapa, converter célula para posição do canvas e escala exibida; na paleta/programa, usar o elemento ou bloco específico. Suportar os dois editores, teclado, fechamento e reabertura da dica. Respeitar movimento reduzido e não interromper cada passo com uma explicação repetida.

## Fase 21 — A estufa precisa dos dois

**Conceito e pré-requisitos:** AND guiado; conhecer IF/ELSE, verdadeiro/falso e movimento. Uso real: regar somente quando o solo está seco e há água no reservatório.

**Objetivo:** abrir a passagem da irrigação somente quando as duas condições forem verdadeiras; nos demais casos, seguir pelo corredor de inspeção.

**Mapa:** início `(1,3)`, console C21 `(3,3)`, portão G21 `(5,3)`, portal `(8,3)`, gema `(2,3)`. Transitáveis: `(x,3)` x=1…8; `(x,5)` x=3…8; `(3,y)` e `(8,y)` y=3…5. Sinais A em `(1,1)` “Solo seco”; B em `(2,1)` “Água disponível”. Prefixo `D 2`; direto `D 5`; desvio `B 2; D 5; C 2`.

**Blocos liberados:** paleta AND; destacar AND como novidade. Inicialmente mostrar IF com espaço de condição, sem preencher automaticamente.

**Cenários e resultado exato:**

| A | B | AND | Ativações válidas | Rota de referência |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | Desvio; G21 fechado |
| 0 | 1 | 0 | 0 | Desvio; G21 fechado |
| 1 | 0 | 0 | 0 | Desvio; G21 fechado |
| 1 | 1 | 1 | 1 | Direto; G21 aberto |

**Solução de referência:**

```text
D 2
SE A AND B:
  ATIVAR
  D 5
SENÃO:
  B 2
  D 5
  C 2
```

**Balões:**

1. Alvo: sinais A/B; momento: entrada. “A mostra solo seco. B mostra água disponível. A irrigação precisa dos dois.”
2. Alvo: bloco AND na paleta; momento: após conhecer os sinais. “AND significa E: só responde SIM quando as duas entradas respondem SIM.”
3. Alvo: entrada de condição do IF; momento: primeiro encaixe. “Encaixe A E B aqui. O SENÃO leva Lumi pelo caminho seguro.”

**Erro comum e dica:** testar só A; o cenário 10 mostra solo seco sem água. Dica: “Confira também o reservatório antes de ativar.”

**Testes:** executar 11 primeiro como demonstração, depois 10, 01, 00 sem editar. Verificar gema e portal nos quatro; programa que ativa sempre falha nos três falsos; programa que nunca ativa falha em 11; somente A falha em 10 e somente B falha em 01. A rota falsa nunca toca `(5,3)`.

## Fase 22 — Oficina preparada

**Conceito e pré-requisitos:** prática de AND com geometria vertical; fase 21. Uso real: liberar uma máquina somente com proteção fechada e peça posicionada.

**Objetivo:** autorizar a oficina nas condições corretas e concluir a inspeção mesmo quando faltar uma preparação.

**Mapa:** início `(3,6)`, C22 `(3,4)`, G22 `(5,2)`, portal `(8,2)`, gema `(3,5)`. Transitáveis: `(3,y)` y=2…6; `(x,2)` e `(x,4)` x=3…8; `(8,y)` y=2…4. A em `(1,3)` “Proteção fechada”; B em `(2,3)` “Peça posicionada”. Prefixo `C 2`; direto `C 2; D 5`; desvio `D 5; C 2`.

**Blocos liberados:** paleta AND, sem nova lógica; aluno monta do zero.

**Cenários e resultado exato:** 00 → não ativar, desvio, G22 fechado; 01 → não ativar, desvio, fechado; 10 → não ativar, desvio, fechado; 11 → ativar uma vez, direto, aberto. Nos quatro: gema `(3,5)` e portal `(8,2)`.

**Solução de referência:**

```text
C 2
SE A AND B:
  ATIVAR
  C 2
  D 5
SENÃO:
  D 5
  C 2
```

**Balões:**

1. Alvo: console C22; momento: entrada. “A máquina só pode ser liberada com proteção fechada e peça posicionada.”
2. Alvo: sinais A/B; momento: cenário 10. “A proteção está fechada, mas falta a peça. Uma condição sozinha ainda não basta.”
3. Alvo: início do desvio `(4,4)`; momento: primeiro resultado falso. “O caminho de inspeção continua disponível quando a oficina não pode abrir.”

**Erro comum e dica:** subir antes de decidir e bloquear a chegada ao desvio. Dica: “Faça a escolha sobre o console, antes da subida.”

**Testes:** quatro cenários no mesmo programa; rejeitar ativação em 00/01/10 e falta dela em 11. Conferir que ambos os ramos chegam a `(8,2)` sem colisão. Trocar ordem de A/B deve conservar os quatro resultados.

## Fase 23 — O acesso apressado

**Conceito e pré-requisitos:** depurar uma condição incompleta; fases 21–22. Uso real: acesso exige credencial válida e treinamento concluído.

**Objetivo:** corrigir o programa fornecido, que verifica somente a credencial e tenta abrir cedo demais.

**Mapa:** início `(10,3)`, C23 `(8,3)`, G23 `(6,3)`, portal `(3,3)`, gema `(9,3)`. Transitáveis: `(x,3)` x=3…10; `(x,1)` x=3…8; `(3,y)` e `(8,y)` y=1…3. A em `(9,1)` “Credencial válida”; B em `(10,1)` “Treinamento concluído”. Prefixo `E 2`; direto `E 5`; desvio `C 2; E 5; B 2`.

**Blocos liberados:** paleta AND. Programa inicial tem as rotas corretas da referência, mas condição `SE A`; nenhum OR é introduzido antecipadamente.

**Cenários e resultado exato:** 00 → 0 ativações, desvio, fechado; 01 → 0, desvio, fechado; 10 → 0, desvio, fechado; 11 → 1, direto, aberto. Todos recolhem `(9,3)` e chegam a `(3,3)`.

**Solução de referência:**

```text
E 2
SE A AND B:
  ATIVAR
  E 5
SENÃO:
  C 2
  E 5
  B 2
```

**Balões:**

1. Alvo: condição A do programa inicial; momento: entrada. “Este programa confere a credencial. Qual verificação ainda falta antes de abrir?”
2. Alvo: sinal B; momento: falha demonstrada em 10. “O treinamento não foi concluído. Ter credencial não resolve essa falta.”
3. Alvo: área dos cenários; momento: após corrigir. “Teste os quatro casos. Uma correção precisa funcionar também quando ambos os sinais dizem SIM.”

**Erro comum e dica:** substituir A por B e apenas trocar o problema. Dica: “Preserve as duas verificações na mesma condição.”

**Testes:** o programa defeituoso deve passar 00/01/11 e falhar especificamente em 10. A referência passa os quatro; variante `SE B` falha em 01. Reiniciar depois da falha não pode manter o portão aberto ou a gema coletada.

## Fase 24 — Transporte sem manutenção

**Conceito e pré-requisitos:** reusar AND e NOT já aprendido; fases 16–23. Uso real: autorizar transporte quando a carga está presa e não há manutenção pendente.

**Objetivo:** combinar um requisito positivo e um impedimento, interpretando corretamente o significado dos sinais.

**Mapa:** início `(1,5)`, C24 `(4,5)`, G24 `(6,2)`, portal `(9,2)`, gemas `(2,5)` e `(3,5)`. Transitáveis: `(x,5)` x=1…9; `(x,2)` x=4…9; `(4,y)` e `(9,y)` y=2…5. A em `(1,2)` “Carga presa”; B em `(2,2)` “Manutenção pendente”. Prefixo `D 3`; direto `C 3; D 5`; desvio `D 5; C 3`.

**Blocos liberados:** paleta AND; destaque de revisão para NOT, sem operador novo.

**Cenários e resultado exato:** a regra é `A AND NOT B`. 00 → 0 ativações, desvio, G24 fechado; 01 → 0, desvio, fechado; 10 → 1, direto, aberto; 11 → 0, desvio, fechado. Todos coletam as duas gemas e terminam em `(9,2)`. Em 10, as **entradas do AND são 1 e 1**, pois NOT B transforma 0 em 1; a tabela do AND permanece igual.

**Solução de referência:**

```text
D 3
SE A AND (NOT B):
  ATIVAR
  C 3
  D 5
SENÃO:
  D 5
  C 3
```

**Balões:**

1. Alvo: sinal B; momento: entrada. “B significa manutenção pendente. Para transportar, precisamos que esse sinal diga NÃO.”
2. Alvo: bloco NOT encaixado em B; momento: montagem da expressão. “NÃO B responde SIM quando não há manutenção pendente. Agora combine esse resultado com A.”
3. Alvo: expressão AND; momento: cenário 10. “A diz SIM e NÃO B também. As duas entradas do E estão satisfeitas.”

**Erro comum e dica:** copiar `A AND B` sem ler os rótulos. Dica: “O sinal descreve um impedimento; negue somente B.”

**Testes:** quatro cenários; `A AND B` falha em 10 e 11; `NOT (A AND B)` falha em 00 e 01; somente `NOT B` falha em 00. Verificar escopo visual de NOT, incluindo no editor alternativo. Todas as posições permanecem dentro do mapa.

## Fase 25 — A ponte de suprimentos

**Conceito e pré-requisitos:** desafio AND, sequências e repetição; fases 21–24. Uso real: liberar uma ponte de entrega quando inspeção e destino estiverem prontos.

**Objetivo:** planejar o percurso até o console, autorizar a entrega somente com ambos os preparos e alcançar o portal pela rota correspondente.

**Mapa:** início `(1,6)`, C25 `(4,4)`, G25 `(8,2)`, portal `(10,2)`, gemas `(2,6)` e `(4,5)`. Transitáveis: `(x,6)` x=1…4; `(4,y)` y=1…6; `(x,4)` x=4…7; `(7,y)` y=2…4; `(x,2)` x=7…10; `(x,1)` x=4…10; `(10,y)` y=1…2. A em `(1,2)` “Inspeção aprovada”; B em `(2,2)` “Destino pronto”. Prefixo `D 3; C 2`; direto `D 3; C 2; D 3`; desvio `C 3; D 6; B 1`.

**Blocos liberados:** paleta AND; sem esqueleto inicial. Repetições recomendadas, sem reprovar solução equivalente com movimentos explícitos.

**Cenários e resultado exato:** 00/01/10 → nenhuma ativação, desvio, G25 fechado; 11 → uma ativação, direto, G25 aberto. Cada cenário exige as duas gemas e chegada a `(10,2)`.

**Solução de referência:**

```text
D 3
C 2
SE A AND B:
  ATIVAR
  D 3
  C 2
  D 3
SENÃO:
  C 3
  D 6
  B 1
```

**Balões:**

1. Alvo: C25; momento: entrada. “Planeje como chegar ao console. A decisão só vem depois de recolher as duas gemas.”
2. Alvo: bloco REPETIR; momento: pedido de dica. “Os trechos retos repetem movimentos. Conte cada trecho antes de encaixar a repetição.”
3. Alvo: G25; momento: tentativa indevida ou dica contextual. “A ponte exige inspeção aprovada E destino pronto. Se faltar um, use o caminho superior.”

**Erro comum e dica:** colocar ATIVAR antes do prefixo, fora do console. Dica: “Chegue a `(4,4)` antes de avaliar e ativar.”

**Testes:** quatro cenários, referências com 13 movimentos no caso verdadeiro e 15 no falso; início e fim conferidos. Rejeitar tentativa sobre qualquer célula sem console. A/B isolados falham nos casos mistos; caminho superior sem nenhuma ativação falha em 11, mesmo chegando com gemas.

## Fase 26 — Uma fonte já ajuda

**Conceito e pré-requisitos:** OR guiado e inclusivo; AND dominado, IF/ELSE e sensores. Uso real: alimentar a estação se a rede ou a bateria tiver energia.

**Objetivo:** abrir a passagem de energia se ao menos uma fonte estiver disponível, incluindo quando as duas estiverem.

**Mapa:** início `(1,3)`, C26 `(3,3)`, G26 `(5,3)`, portal `(8,3)`, gema `(2,3)`. Transitáveis: `(x,3)` x=1…8; `(x,5)` x=3…8; `(3,y)` e `(8,y)` y=3…5. A em `(1,1)` “Rede disponível”; B em `(2,1)` “Bateria carregada”. Prefixo `D 2`; direto `D 5`; desvio `B 2; D 5; C 2`.

**Blocos liberados:** paleta OR; destacar OR como único operador novo.

**Cenários e resultado exato:**

| A | B | OR | Ativações válidas | Rota de referência |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | Desvio; G26 fechado |
| 0 | 1 | 1 | 1 | Direto; G26 aberto |
| 1 | 0 | 1 | 1 | Direto; G26 aberto |
| 1 | 1 | 1 | 1 | Direto; G26 aberto |

**Solução de referência:**

```text
D 2
SE A OR B:
  ATIVAR
  D 5
SENÃO:
  B 2
  D 5
  C 2
```

**Balões:**

1. Alvo: bloco OR; momento: entrada. “OR significa OU: basta uma entrada dizer SIM. As duas dizendo SIM também funcionam.”
2. Alvo: sinais A/B; momento: cenário 01. “A rede caiu, mas a bateria está carregada. A estação ainda pode funcionar.”
3. Alvo: expressão OR; momento: cenário 11. “Duas fontes disponíveis também dão SIM. Este OU inclui o caso em que ambas funcionam.”

**Erro comum e dica:** tratar OU como “somente uma”. Dica: “Em 11 há energia; deixe a estação funcionar também.”

**Testes:** iniciar 01, depois 11, 10 e 00 sem edição. AND falha em 01/10; ativar apenas quando os sinais diferem falha em 11; ativar sempre falha em 00. Conferir que uma única ativação ocorre em 11.

## Fase 27 — Chamado de assistência

**Conceito e pré-requisitos:** prática de OR e aplicação em pedidos alternativos; fase 26.

**Objetivo:** abrir o acesso à assistência se o pedido veio pelo rádio ou pelo painel; sem pedidos, concluir a ronda pelo desvio. Trata-se de uma simulação de solicitação, sem introduzir relógio ou eventos aleatórios.

**Mapa:** início `(3,6)`, C27 `(3,4)`, G27 `(5,2)`, portal `(8,2)`, gema `(3,5)`. Transitáveis: `(3,y)` y=2…6; `(x,2)` e `(x,4)` x=3…8; `(8,y)` y=2…4. A em `(1,3)` “Pedido pelo rádio”; B em `(2,3)` “Pedido pelo painel”. Prefixo `C 2`; direto `C 2; D 5`; desvio `D 5; C 2`.

**Blocos liberados:** paleta OR; programa inicialmente vazio.

**Cenários e resultado exato:** 00 → 0 ativações, desvio, G27 fechado; 01 → 1, direto, aberto; 10 → 1, direto, aberto; 11 → 1, direto, aberto. Todos coletam `(3,5)` e alcançam `(8,2)`.

**Solução de referência:**

```text
C 2
SE A OR B:
  ATIVAR
  C 2
  D 5
SENÃO:
  D 5
  C 2
```

**Balões:**

1. Alvo: sinais A/B; momento: entrada. “O chamado pode chegar pelo rádio ou pelo painel. Qualquer um solicita assistência.”
2. Alvo: IF; momento: primeiro encaixe de AND, se ocorrer. “Esta missão aceita qualquer pedido. É preciso esperar os dois chegarem?”
3. Alvo: C27; momento: cenário 11. “Os dois pedidos chegam ao mesmo serviço. Uma ativação atende à decisão desta missão.”

**Erro comum e dica:** usar dois IFs separados, ativando duas vezes em 11. Dica: “Junte os pedidos em uma condição OU antes de ativar.”

**Testes:** quatro cenários; referência ativa exatamente uma vez em cada cenário verdadeiro. Dois IFs que ativam independentemente falham pela duplicação em 11, sem exigir nominalmente OR; qualquer estrutura equivalente com uma ativação passa. Cenário 00 deve chegar ao portal sem tentar G27.

## Fase 28 — A luz que não acendia

**Conceito e pré-requisitos:** depurar AND quando o requisito pede OR; fases 21–27. Uso real: ligar luz de serviço por presença detectada ou solicitação manual.

**Objetivo:** corrigir o requisito aplicado no programa inicial, mantendo as rotas que já estão corretas.

**Mapa:** início `(10,3)`, C28 `(8,3)`, G28 `(6,3)`, portal `(3,3)`, gema `(9,3)`. Transitáveis: `(x,3)` x=3…10; `(x,1)` x=3…8; `(3,y)` e `(8,y)` y=1…3. A em `(9,1)` “Presença detectada”; B em `(10,1)` “Luz solicitada”. Prefixo `E 2`; direto `E 5`; desvio `C 2; E 5; B 2`.

**Blocos liberados:** paleta OR. Programa inicial reproduz a referência com `A AND B` no lugar de `A OR B`.

**Cenários e resultado exato:** 00 → 0 ativações, desvio, G28 fechado; 01 → 1, direto, aberto; 10 → 1, direto, aberto; 11 → 1, direto, aberto. Todos coletam `(9,3)` e chegam a `(3,3)`.

**Solução de referência:**

```text
E 2
SE A OR B:
  ATIVAR
  E 5
SENÃO:
  C 2
  E 5
  B 2
```

**Balões:**

1. Alvo: AND do programa inicial; momento: entrada. “A luz deve atender presença ou pedido manual. Este E está exigindo mais do que a missão pede.”
2. Alvo: sinal B; momento: resultado inicial em 01. “Há um pedido manual. Mesmo sem presença detectada, a luz precisa ser ligada.”
3. Alvo: área dos cenários; momento: primeira correção. “Confira também 11. Trocar a condição não deve desligar a luz quando os dois sinais estão ativos.”

**Erro comum e dica:** corrigir apenas um cenário usando somente B. Dica: “Teste presença sem pedido manual também.”

**Testes:** versão inicial passa 00/11 e falha 01/10 por falta de ativação, embora chegue ao portal. Versão corrigida passa todos. `SE A` falha 01; `SE B` falha 10; condição que exclui 11 falha 11. Chegar ao portal sozinho não marca vitória antes de conferir a operação.

## Fase 29 — Duas credenciais aceitas

**Conceito e pré-requisitos:** reuso de OR em outro significado e outro percurso; fases 26–28. Uso real: validar acesso de visitante com ingresso ou convite.

**Objetivo:** transportar a mesma regra “ao menos uma evidência” para a entrada de um evento, sem confundir OR com a regra de duas exigências da fase 23.

**Mapa:** início `(1,5)`, C29 `(4,5)`, G29 `(6,2)`, portal `(9,2)`, gemas `(2,5)` e `(3,5)`. Transitáveis: `(x,5)` x=1…9; `(x,2)` x=4…9; `(4,y)` e `(9,y)` y=2…5. A em `(1,2)` “Ingresso válido”; B em `(2,2)` “Convite válido”. Prefixo `D 3`; direto `C 3; D 5`; desvio `D 5; C 3`.

**Blocos liberados:** paleta OR. Reusar a expressão da fase anterior é permitido; adaptar as direções ao mapa é parte da atividade. Não requer novo recurso de biblioteca ou funções.

**Cenários e resultado exato:** 00 → 0 ativações, desvio de orientação, G29 fechado; 01 → 1, direto, aberto; 10 → 1, direto, aberto; 11 → 1, direto, aberto. Todos recolhem as duas gemas e terminam em `(9,2)`.

**Solução de referência:**

```text
D 3
SE A OR B:
  ATIVAR
  C 3
  D 5
SENÃO:
  D 5
  C 3
```

**Balões:**

1. Alvo: sinais A/B; momento: entrada. “Aqui ingresso ou convite permite a entrada. Leia a regra do lugar antes de escolher E ou OU.”
2. Alvo: expressão OR; momento: montagem. “Os sinais mudaram de significado, mas a regra continua: ao menos um documento válido.”
3. Alvo: bifurcação C29; momento: pedido de dica de rota. “A condição pode ser reutilizada. Os movimentos precisam acompanhar este novo mapa.”

**Erro comum e dica:** reutilizar o programa inteiro, incluindo os movimentos para a esquerda da fase 28. Dica: “Reaproveite a decisão; confira as coordenadas dos caminhos.”

**Testes:** quatro cenários; A/B invertidos mantêm o resultado de OR. Variante AND falha em 01/10. Sem ingresso e sem convite ainda existe chegada segura pelo desvio; não deve liberar G29. Com ambos, abrir exatamente uma vez.

## Fase 30 — A estação de reserva

**Conceito e pré-requisitos:** desafio OR com sequências e repetição; fases 26–29. Uso real: manter uma estação disponível com fornecimento principal ou reserva.

**Objetivo:** executar o percurso completo, reunir as gemas e selecionar corretamente a operação em todas as combinações de fontes, sem orientação inicial de montagem.

**Mapa:** início `(1,6)`, C30 `(4,4)`, G30 `(8,2)`, portal `(10,2)`, gemas `(2,6)` e `(4,5)`. Transitáveis: `(x,6)` x=1…4; `(4,y)` y=1…6; `(x,4)` x=4…7; `(7,y)` y=2…4; `(x,2)` x=7…10; `(x,1)` x=4…10; `(10,y)` y=1…2. A em `(1,2)` “Fonte principal disponível”; B em `(2,2)` “Fonte reserva disponível”. Prefixo `D 3; C 2`; direto `D 3; C 2; D 3`; desvio `C 3; D 6; B 1`.

**Blocos liberados:** paleta OR; editor vazio. Dicas sob demanda depois da apresentação da missão.

**Cenários e resultado exato:** 00 → nenhuma ativação, desvio, G30 fechado; 01/10/11 → uma ativação, direto, G30 aberto. Todos chegam a `(10,2)` com ambas as gemas. OR precisa funcionar em 11, mesmo que o jogador imagine a reserva como “alternativa exclusiva”.

**Solução de referência:**

```text
D 3
C 2
SE A OR B:
  ATIVAR
  D 3
  C 2
  D 3
SENÃO:
  C 3
  D 6
  B 1
```

**Balões:**

1. Alvo: sinais A/B; momento: entrada. “A estação funciona com energia principal ou reserva. Monte um programa que resolva as quatro situações.”
2. Alvo: G30; momento: dica solicitada em 00. “Sem nenhuma fonte, mantenha o portão fechado e use o corredor superior.”
3. Alvo: painel de cenários, linha 11; momento: falha nessa linha. “Ter duas fontes não impede o funcionamento. O OU também responde SIM quando ambas estão disponíveis.”

**Erro comum e dica:** resolver 01/10, mas esquecer a disponibilidade simultânea. Dica: “Duas fontes disponíveis continuam sendo pelo menos uma.”

**Testes:** quatro cenários determinísticos com AST congelada durante a avaliação; 13 movimentos na referência verdadeira, 15 na falsa. Rejeitar condição que exclui 11, AND que exclui os mistos e ativação incondicional em 00. Conferir isolamento de estados e ausência de colisões. A aprovação não depende de contar um bloco OR.

## Interfaces e limites para a implementação futura

1. **Conteúdo:** os mapas ramificados exigem lista explícita de transitáveis, console/portão com ID, dois sinais rotulados e quatro cenários, em lugar de depender exclusivamente da rota linear de `makeLevel`. Prefixos e rotas deste documento especificam uma referência, não uma única solução aceita.
2. **Linguagem:** condições booleanas com sensores, NOT, AND e OR precisam de representação e avaliação comuns ao Blockly e ao editor alternativo. Os sinais não podem ser substituídos pela leitura acidental de `activated` ou direção do personagem. Expressões são puras; não movem nem ativam.
3. **Estado e vitória:** `resetState`, `handleAction`, `atGoal`, `executionStep` e `finishLevel` precisam distinguir cenário aprovado de fase aprovada e guardar tentativas/ativações. Chegar ao portal não pode encerrar com sucesso antes da exigência da operação. A avaliação deve utilizar os quatro cenários definidos, sem alterar o código do aluno entre eles.
4. **Ações e desenho:** o atual booleano único `activated` não identifica portões. Desenho do mapa, colisão, vínculo console/portão e acessibilidade precisam consultar o mesmo estado por ID. ATIVAR fora do console ou em condição proibida deve informar a razão e reprovar aquele cenário, sem abrir passagem.
5. **Ajuda:** atualizar a solução demonstrativa para referência ramificada; a atual `sampleSolution()` percorre uma rota única. Balões devem ancorar tanto em objetos do canvas quanto nos blocos dos dois editores, sem bloquear interação.
6. **Integração com as 50 fases:** expansão de mundos, navegação, contagem, progresso e migração de salvamentos pertence ao plano geral. Não sobrescrever silenciosamente o código antigo de uma fase cujo currículo mudou. Não liberar futuros operadores apenas porque a paleta atual usa uma categoria genérica final.

Os quatro cenários tornam distinguíveis AND e OR e detectam soluções constantes ou baseadas em somente um sinal. A fase 24 altera deliberadamente a polaridade de B e explicita as entradas do AND para evitar ensinar a tabela errada. A regra de uma única ativação é uma exigência da operação simulada, não uma obrigação de sintaxe; deve aparecer também no objetivo acessível da fase. Não acrescentar eventos aleatórios, consumo de recursos, física, autenticação real ou máquinas com estados complexos para representar esses exemplos.
