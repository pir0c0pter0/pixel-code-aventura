# Fases 31 a 40 — exclusividade e negação conjunta

## Contrato desta faixa

Proposta de conteúdo, sem alteração do runtime. Mundo 7: **Trilhos da Exclusividade**, fases 31–35, XOR. Mundo 8: **Usina das Inversões**, fases 36–40, NAND. Pré-requisitos: movimentos absolutos, REPETIR contado, booleanos, IF/ELSE, NOT, AND e OR. NOR, XNOR e REPETIR ATÉ não são apresentados nem necessários aqui.

Valem todos os contratos do [README](README.md), incluindo balões, acessibilidade, AST congelada, isolamento dos cenários e aceitação por comportamento. Reutilizam-se os sinais e o vínculo placa/portão das [fases 21–30](fases-21-30.md); não há inventário, energia consumível, tempo, variáveis ou novo subsistema de máquinas.

### Notação e regras comuns, exibidas também ao jogador

- Tabuleiro interior x=1…10, y=1…6; y cresce para baixo. Intervalos incluem extremos. Somente as células transitáveis listadas são chão; o restante é obstáculo. Sinais ficam fora do chão e possuem equivalentes acessíveis no painel.
- `D n`, `E n`, `C n`, `B n`: n movimentos para direita, esquerda, cima e baixo. São abreviações documentais, realizadas por movimentos individuais ou REPETIR contado; não novos blocos. O sinal B não se confunde com `B n` de movimento.
- Sinais A/B são visíveis, rotulados e somente leitura; constantes durante cada cenário. `0 = NÃO/falso`, `1 = SIM/verdadeiro`. Nenhum sinal abre portões automaticamente.
- Placa/console Cnn abre somente Gnn. Nas fases com duas placas, CnnO/CnnX ou CnnN/CnnX possuem vínculos independentes. ATIVAR atua na placa sob Lumi; toda porta começa fechada, inclusive nos cenários de regra verdadeira. Uma ativação permitida abre somente sua porta, sem mudar A/B.
- Regra verdadeira: **ativar exatamente uma vez a placa correspondente**. Regra falsa: **nenhuma tentativa de ativação**; usar o caminho livre. Tentativa proibida ou fora da placa falha com explicação. Todas essas obrigações aparecem no objetivo, com nomes das placas, antes de EXECUTAR; não são requisitos ocultos.
- Cada cenário exige todas as gemas e o portal. “Direto”/“desvio” são soluções de referência; qualquer trajeto transitável é aceito se respeitar operações, portões e coleta. Abrir corretamente e depois usar o desvio também é válido. Não exigir bloco de nome específico nem uma forma sintática particular.
- TESTAR TODOS roda o mesmo programa em 00, 01, 10 e 11, reiniciando posição, gemas, placas, portas e registro de ações. Uma edição cancela resultados parciais. A fase só é concluída com os quatro aprovados.
- Paleta **XOR**: quatro movimentos, REPETIR contado, IF/ELSE, A/B, NOT, AND, OR, XOR, ATIVAR e sensores anteriores. Paleta **NAND**: a anterior mais NAND. Expressões equivalentes com os operadores anteriores são válidas.
- Programas iniciais de depuração são `starterProgram` opcionais: mostrar prévia; inserir somente por CARREGAR DESAFIO, confirmando substituição se já houver conteúdo. Entrar na fase nunca apaga nem substitui trabalho salvo.
- Balões abaixo seguem o padrão do README: fundo `rgba(16,31,48,.92)`, texto opaco de até 24 palavras, um por vez, seta e destaque sobre alvo visível, sem modal. Preferir acima; reposicionar sem cobrir o alvo; suportar teclado, toque, dois editores e reabertura em ENTENDER/DICA. Alvos `block:<id>` são resolvidos pela instância atual; se não existir bloco, usar a paleta ou `decision`, sem apontar para elemento ausente.

## Fase 31 — Só um pedido por vez

**Conceito e pré-requisitos:** introdução guiada a XOR; conhecer OR e IF/ELSE. Exatamente uma entrada verdadeira produz verdadeiro; nenhuma ou duas produzem falso.

**Objetivo visível:** liberar G31 com uma ativação em C31 somente quando exatamente um trilho pedir passagem. Nos outros casos, não ativar; recolher a gema e chegar ao portal pelo desvio.

**Mapa:** início `(1,2)`, C31 `(3,2)`, G31 `(5,2)`, portal `(8,2)`, gema g31 `(2,2)`. Transitáveis: `(x,2)` x=1…8; `(x,5)` x=3…8; `(3,y)` e `(8,y)` y=2…5. Sinais A `(1,6)` “Trilho norte pede passagem”; B `(2,6)` “Trilho sul pede passagem”. Prefixo `D 2`; direto `D 5`; desvio `B 3; D 5; C 3`.

**Blocos:** paleta XOR; destacar XOR como única novidade. Prévia opcional de IF/ELSE vazio, carregada somente por ação explícita e confirmação se houver conteúdo; não inserir nem executar automaticamente.

**Quatro cenários:**

| A/B | XOR | C31 | G31 ao terminar | Referência após prefixo |
|---|---|---|---|---|
| 00 | F | Não ativar | Fechado | Desvio |
| 01 | V | Ativar uma vez | Aberto | Direto |
| 10 | V | Ativar uma vez | Aberto | Direto |
| 11 | F | Não ativar | Fechado | Desvio |

Nos quatro, coletar g31 e chegar a `(8,2)`.

**Solução completa:**

```text
D 2
SE A XOR B:
  ATIVAR
  D 5
SENÃO:
  B 3
  D 5
  C 3
```

**Balões:**

1. `signal:A`; entrada: “Cada sinal mostra um pedido. O portão aceita exatamente um pedido por vez.”
2. `palette:xor`; após o primeiro: “OU EXCLUSIVO dá verdadeiro com exatamente um SIM. Nenhum SIM ou dois SIM dão falso.”
3. `decision`; PASSO ou erro em 11: “Os dois pediram passagem. XOR responde falso; escolha o SENÃO e mantenha o portão fechado.”

**Erro/dica:** copiar OR e ativar em 11. Dica em `signal:B`: “Compare um pedido com dois pedidos. Aqui, dois não podem passar juntos.”

**Aceitação:** referência passa os quatro; OR falha em 11, AND falha em 01/10/11, ativar sempre falha em 00/11. Confirmar que o desvio não cruza G31 e que nenhuma tentativa em cenário falso é aceita.

## Fase 32 — Escolha da embalagem

**Conceito e pré-requisitos:** prática de XOR; fase 31. Aplicar exclusividade a escolhas, sem depender da história dos trilhos.

**Objetivo visível:** C32 autoriza a passagem de embalagem com exatamente um tamanho selecionado; ativar uma vez nesse caso. Com nenhum ou ambos selecionados, não ativar e levar Lumi à orientação pelo desvio. Coletar a gema e alcançar o portal.

**Mapa:** início `(3,6)`, C32 `(3,4)`, G32 `(5,2)`, portal `(9,2)`, gema g32 `(3,5)`. Transitáveis: `(3,y)` y=2…6; `(x,2)` e `(x,4)` x=3…9; `(9,y)` y=2…4. A `(1,2)` “Tamanho pequeno selecionado”; B `(1,3)` “Tamanho grande selecionado”. Prefixo `C 2`; direto `C 2; D 6`; desvio `D 6; C 2`.

**Blocos:** paleta XOR, editor vazio; REPETIR pode compactar os seis passos horizontais.

**Quatro cenários:** 00 → XOR F, zero ativações, G32 fechado, desvio; 01 → V, uma ativação, aberto, direto; 10 → V, uma ativação, aberto, direto; 11 → F, zero ativações, fechado, desvio. Todos recolhem g32 e terminam em `(9,2)`.

**Solução completa:**

```text
C 2
SE A XOR B:
  ATIVAR
  C 2
  D 6
SENÃO:
  D 6
  C 2
```

**Balões:**

1. `switch:C32`; entrada: “Escolha pequena ou grande, mas não as duas. Sem uma escolha única, use o caminho de orientação.”
2. `signal:A`; DICA em 00: “Nenhum tamanho foi escolhido. XOR também é falso quando as duas respostas são NÃO.”
3. `decision`; erro em 10: “Só o tamanho pequeno foi escolhido. Uma única resposta SIM permite ativar.”

**Erro/dica:** usar apenas A, ignorando o tamanho grande. Dica em `scenario`: “Teste também o pedido com apenas o tamanho grande.”

**Aceitação:** quatro cenários; somente A falha em 01/11, somente B falha em 10/11; NOT(AND) falha em 00. Este último pode ser construído com operadores conhecidos, sem antecipar o nome NAND. Os dois ramos chegam com g32 em 10 movimentos totais.

## Fase 33 — Um pedido basta, um pedido apenas

**Conceito e pré-requisitos:** comparar OR inclusivo e XOR exclusivo; fases 26–32. Dois serviços recebem as mesmas entradas, mas possuem regras diferentes.

**Objetivo visível:** C33O registra pedidos se houver ao menos um: ativar uma vez nesse caso. C33X libera uma fila individual se houver exatamente um: ativar uma vez nesse caso. Não ativar a placa cuja regra for falsa. Coletar duas gemas e chegar ao portal.

**Mapa:** início `(1,3)`, C33O `(2,3)` → G33O `(3,3)`, C33X `(6,3)` → G33X `(7,3)`, portal `(10,3)`, gemas g33a `(5,3)` e g33b `(9,3)`. Transitáveis: `(x,3)` x=1…10; `(x,1)` x=2…5; `(2,y)` e `(5,y)` y=1…3; `(x,5)` x=6…9; `(6,y)` e `(9,y)` y=3…5. A `(1,5)` “Pedido do norte”; B `(2,5)` “Pedido do sul”. Prefixo `D 1`; etapa O direto `D 3` ou desvio `C 2; D 3; B 2`, ambos até `(5,3)`; ligação `D 1`; etapa X direto `D 3` ou desvio `B 2; D 3; C 2`, ambos até `(9,3)`; final `D 1`.

**Blocos:** paleta XOR; usar dois IF/ELSE sequenciais. Nenhum sensor adicional; A/B são os mesmos nas duas decisões.

**Quatro cenários:**

| A/B | OR / XOR | Ativações C33O / C33X | Portas G33O / G33X finais | Rotas O / X |
|---|---|---|---|---|
| 00 | F / F | 0 / 0 | Fechado / fechado | Desvio / desvio |
| 01 | V / V | 1 / 1 | Aberto / aberto | Direto / direto |
| 10 | V / V | 1 / 1 | Aberto / aberto | Direto / direto |
| 11 | V / F | 1 / 0 | Aberto / fechado | Direto / desvio |

Todos coletam g33a/g33b e chegam a `(10,3)`. Em 11, abrir G33O não abre G33X nem muda os sinais.

**Solução completa:**

```text
D 1
SE A OR B:
  ATIVAR
  D 3
SENÃO:
  C 2
  D 3
  B 2
D 1
SE A XOR B:
  ATIVAR
  D 3
SENÃO:
  B 2
  D 3
  C 2
D 1
```

**Balões:**

1. `switch:C33O`; entrada: “O registro aceita um ou dois pedidos. Aqui, basta pelo menos um.”
2. `switch:C33X`; DICA ou primeira chegada parada: “A fila individual aceita exatamente um pedido. Aqui, os dois juntos não valem.”
3. `decision`; erro em 11: “Com dois SIM, OU é verdadeiro e OU EXCLUSIVO é falso. Cada placa segue sua própria regra.”

**Erro/dica:** aplicar XOR nas duas placas. Dica em `switch:C33O`: “O registro também deve atender quando os dois pedem.”

**Aceitação:** testar quatro cenários e registrar ativações por ID. XOR/XOR falha em 11 por falta de ativação em C33O; OR/OR falha em 11 por tentativa proibida em C33X. Uma ativação nunca abre as duas portas. Rotas têm 17/9/9/13 movimentos para 00/01/10/11; gemas estão após as junções.

## Fase 34 — O seletor que aceitava tudo

**Conceito e pré-requisitos:** depuração de OR usado no lugar de exclusividade; fases 31–33.

**Objetivo visível:** corrigir o seletor para ativar C34 uma vez apenas com exatamente uma amostra escolhida. Com nenhuma ou duas, não ativar. As rotas prontas devem continuar recolhendo a gema e chegando ao portal.

**Mapa:** início `(10,4)`, C34 `(8,4)`, G34 `(6,4)`, portal `(3,4)`, gema g34 `(9,4)`. Transitáveis: `(x,4)` x=3…10; `(x,2)` x=3…8; `(3,y)` e `(8,y)` y=2…4. A `(9,1)` “Amostra azul escolhida”; B `(10,1)` “Amostra dourada escolhida”, com símbolos e nomes além da cor. Prefixo `E 2`; direto `E 5`; desvio `C 2; E 5; B 2`.

**Blocos:** paleta XOR. Programa inicial exatamente igual à referência abaixo, exceto pela condição `A OR B`.

**Quatro cenários:** 00 → XOR F, 0 ativações, G34 fechado, desvio; 01 → V, 1, aberto, direto; 10 → V, 1, aberto, direto; 11 → F, 0, fechado, desvio. Todos recolhem g34 e chegam a `(3,4)`.

**Solução completa:**

```text
E 2
SE A XOR B:
  ATIVAR
  E 5
SENÃO:
  C 2
  E 5
  B 2
```

**Balões:**

1. `block:initial-condition`; entrada: “Este programa usa OU. Descubra em qual cenário ele aceita amostras demais.”
2. `decision`; falha inicial em 11: “As duas amostras foram escolhidas. O seletor exige exatamente uma, então esta ativação não é permitida.”
3. `scenario`; após editar: “Confira os quatro casos com a mesma correção. Os casos com uma amostra precisam continuar funcionando.”

**Erro/dica:** substituir OR por AND. Dica em `palette:xor`: “Precisamos dos casos mistos: uma resposta SIM e outra NÃO.”

**Aceitação:** programa inicial passa 00/01/10, falha somente em 11. Corrigido passa os quatro; `A AND NOT B` falha em 01. Reiniciar após tentativa indevida restaura G34 fechado, gema e posição, sem apagar a edição.

## Fase 35 — A entrega de trilho único

**Conceito e pré-requisitos:** desafio XOR com planejamento de trajetos e repetição contada; fases 31–34. Sem esqueleto inicial.

**Objetivo visível:** recolher duas gemas antes da decisão; ativar C35 uma vez se exatamente um destino solicitar entrega. Sem solicitação ou com duas, não ativar; seguir ao portal pelo corredor de organização.

**Mapa:** início `(1,6)`, C35 `(4,4)`, G35 `(8,2)`, portal `(10,2)`, gemas g35a `(2,6)` e g35b `(4,5)`. Transitáveis: `(x,6)` x=1…4; `(4,y)` y=1…6; `(x,4)` x=4…7; `(7,y)` y=2…4; `(x,2)` x=7…10; `(x,1)` x=4…10; `(10,y)` y=1…2. A `(1,2)` “Destino norte solicita entrega”; B `(2,2)` “Destino sul solicita entrega”. Prefixo `D 3; C 2`; direto `D 3; C 2; D 3`; desvio `C 3; D 6; B 1`.

**Blocos:** paleta XOR, editor vazio. REPETIR contado recomendado para os trechos retos, sem tornar sua presença condição de aprovação.

**Quatro cenários:** 00 → F, zero ativações, G35 fechado, desvio; 01 → V, uma ativação, aberto, direto; 10 → V, uma ativação, aberto, direto; 11 → F, zero ativações, fechado, desvio. Sempre coletar ambas as gemas e chegar a `(10,2)`.

**Solução completa:**

```text
D 3
C 2
SE A XOR B:
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

1. `switch:C35`; entrada: “Recolha as gemas e decida na placa: a entrega só parte com exatamente um destino solicitando.”
2. `palette:repeat`; DICA de percurso: “Conte cada trecho reto. REPETIR pode organizar os movimentos antes e depois da escolha.”
3. `decision`; erro em 00 ou 11: “XOR é falso quando as respostas são iguais. O corredor superior continua livre.”

**Erro/dica:** decidir e ativar no início, fora da placa. Dica em `switch:C35`: “Primeiro chegue à placa em `(4,4)`. Só ali é possível ativar.”

**Aceitação:** referência nos quatro cenários, 13 movimentos em 01/10 e 15 em 00/11. Nunca ativar falha em 01/10 mesmo coletando gemas; nunca desviar colide em 00/11. Aceitar também `(A OR B) AND NOT(A AND B)` com o mesmo comportamento.

## Fase 36 — A inspeção permanece aberta

**Conceito e pré-requisitos:** introdução guiada a NAND; AND e NOT já conhecidos. NAND nega o resultado conjunto de AND; só é falso quando ambas as entradas são verdadeiras.

**Objetivo visível:** abrir o acesso à inspeção G36 enquanto faltar ao menos uma confirmação. Ativar C36 uma vez em 00/01/10. Com as duas confirmações prontas, não ativar e seguir pelo corredor de conclusão. Recolher a gema e chegar ao portal.

**Mapa:** início `(1,4)`, C36 `(3,4)`, G36 `(5,4)`, portal `(8,4)`, gema g36 `(2,4)`. Transitáveis: `(x,4)` x=1…8; `(x,2)` x=3…8; `(3,y)` e `(8,y)` y=2…4. A `(1,1)` “Primeira inspeção concluída”; B `(2,1)` “Segunda inspeção concluída”. Prefixo `D 2`; direto `D 5`; desvio `C 2; D 5; B 2`.

**Blocos:** paleta NAND; destacar NAND como única novidade. Prévia opcional de IF/ELSE vazio, carregada somente por ação explícita e confirmação se houver conteúdo; não alterar automaticamente o programa.

**Quatro cenários:**

| A/B | AND | NAND | C36 | G36 final | Referência |
|---|---|---|---|---|---|
| 00 | F | V | Uma ativação | Aberto | Direto |
| 01 | F | V | Uma ativação | Aberto | Direto |
| 10 | F | V | Uma ativação | Aberto | Direto |
| 11 | V | F | Nenhuma tentativa | Fechado | Desvio |

Todos recolhem g36 e chegam a `(8,4)`; 00 significa que ambas as inspeções ainda faltam, portanto o acesso à inspeção deve abrir.

**Solução completa:**

```text
D 2
SE A NAND B:
  ATIVAR
  D 5
SENÃO:
  C 2
  D 5
  B 2
```

**Balões:**

1. `signal:A`; entrada: “Estes sinais mostram inspeções concluídas. Enquanto faltar alguma, precisamos abrir o acesso à inspeção.”
2. `palette:nand`; após o primeiro: “NÃO E inverte o resultado do E. Só fica falso quando as duas entradas são verdadeiras.”
3. `decision`; PASSO em 00: “As duas inspeções faltam. E responde falso; NÃO E responde verdadeiro. Aqui, devemos ativar.”

**Erro/dica:** reutilizar XOR e esquecer 00. Dica em `scenario`: “NAND também responde verdadeiro quando as duas entradas são falsas.”

**Aceitação:** quatro cenários; XOR falha somente em 00; AND falha nos quatro; NOT A falha em 10 e NOT B em 01. No cenário 11, desvio chega com a gema sem atravessar G36.

## Fase 37 — Revisão dos dois registros

**Conceito e pré-requisitos:** prática NAND em um mapa vertical; fase 36.

**Objetivo visível:** abrir G37 para revisão enquanto os dois registros ainda não estiverem completos juntos. Ativar C37 uma vez em 00/01/10 e não ativar em 11; recolher a gema e chegar ao portal em todos.

**Mapa:** início `(8,6)`, C37 `(8,4)`, G37 `(6,2)`, portal `(2,2)`, gema g37 `(8,5)`. Transitáveis: `(8,y)` y=2…6; `(x,2)` e `(x,4)` x=2…8; `(2,y)` y=2…4. A `(10,2)` “Registro de entrada completo”; B `(10,3)` “Registro de saída completo”. Prefixo `C 2`; direto `C 2; E 6`; desvio `E 6; C 2`.

**Blocos:** paleta NAND; editor vazio, ajuda sob demanda.

**Quatro cenários:** 00 → NAND V, uma ativação, G37 aberto, direto; 01 → V, uma, aberto, direto; 10 → V, uma, aberto, direto; 11 → F, nenhuma tentativa, fechado, desvio. Todos recolhem g37 e chegam a `(2,2)`.

**Solução completa:**

```text
C 2
SE A NAND B:
  ATIVAR
  C 2
  E 6
SENÃO:
  E 6
  C 2
```

**Balões:**

1. `switch:C37`; entrada: “A revisão continua necessária enquanto faltar qualquer registro. Ela termina quando os dois estiverem completos.”
2. `signal:B`; DICA em 10: “O registro de saída falta. Mesmo com a entrada completa, ainda precisamos abrir a revisão.”
3. `decision`; erro em 11: “Os dois registros estão completos. NAND fica falso; siga pelo caminho de conclusão sem ativar.”

**Erro/dica:** exigir que os dois registros faltem, usando `NOT A AND NOT B`. Dica em `scenario`: “Uma única pendência também exige revisão.”

**Aceitação:** os quatro cenários chegam em 10 movimentos. `NOT A AND NOT B` falha em 01/10; ativar sempre falha em 11. Aceitar `NOT A OR NOT B` sem exigir que a criança aprenda uma nova lei ou nome para essa equivalência.

## Fase 38 — Duas escritas, a mesma resposta

**Conceito e pré-requisitos:** comparar NAND e `NOT(AND)`; fases 21–25 e 36–37. Explicitar o alcance da negação.

**Objetivo visível:** manter a autorização de revisão enquanto as duas etapas não estiverem concluídas juntas. C38 exige uma ativação em 00/01/10 e nenhuma em 11; alcançar o portal com as duas gemas. Experimentar NAND e NÃO sobre o E deve conservar esse comportamento.

**Mapa:** início `(1,5)`, C38 `(4,5)`, G38 `(6,2)`, portal `(9,2)`, gemas g38a `(2,5)` e g38b `(3,5)`. Transitáveis: `(x,5)` x=1…9; `(x,2)` x=4…9; `(4,y)` e `(9,y)` y=2…5. A `(1,2)` “Etapa de entrada concluída”; B `(2,2)` “Etapa de saída concluída”. Prefixo `D 3`; direto `C 3; D 5`; desvio `D 5; C 3`.

**Blocos:** paleta NAND. Exemplo opcional exibe as duas expressões lado a lado no guia; não cria bloco de igualdade ou comparação. A criança pode resolver com qualquer forma; trocar programa reinicia TESTAR TODOS.

**Quatro cenários:** 00 → AND F, NOT(AND) V, NAND V, uma ativação, G38 aberto, direto; 01 → F/V/V, uma, aberto, direto; 10 → F/V/V, uma, aberto, direto; 11 → V/F/F, nenhuma, fechado, desvio. Todos recolhem g38a/g38b e chegam a `(9,2)`.

**Solução completa:**

```text
D 3
SE NOT (A AND B):
  ATIVAR
  C 3
  D 5
SENÃO:
  D 5
  C 3
```

A segunda referência é este programa completo com a condição substituída por `A NAND B`; todas as demais ações permanecem idênticas. A primeira já é uma solução aceita, sem obrigar uma edição apenas estética.

**Balões:**

1. `palette:nand`; entrada: “NAND é uma forma curta de escrever NÃO aplicado ao resultado inteiro de A E B.”
2. `workspace`; ao abrir a comparação: “O NÃO envolve o E inteiro. Negar apenas A muda a pergunta.”
3. `decision`; PASSO em 11: “A E B deu verdadeiro. O NÃO transforma esse resultado em falso, igual ao NAND.”

**Erro/dica:** montar `(NOT A) AND B`. Dica em `palette:not`: “Encaixe o E completo dentro do NÃO.”

**Aceitação:** executar as duas referências separadamente nos quatro cenários, comparando ações, portas, gemas e chegada: resultados idênticos, 11 movimentos em todos. Não somar testes de programas distintos. `(NOT A) AND B` falha em 00/10; confirmar escopo visual nos dois editores.

## Fase 39 — O NÃO ficou no lugar errado

**Conceito e pré-requisitos:** depurar o alcance de NOT na equivalência com NAND; fase 38.

**Objetivo visível:** corrigir a autorização para abrir revisão se faltar qualquer aprovação. Ativar C39 uma vez em 00/01/10; não ativar em 11. Preservar coleta da gema e chegada ao portal.

**Mapa:** início `(10,3)`, C39 `(8,3)`, G39 `(6,3)`, portal `(3,3)`, gema g39 `(9,3)`. Transitáveis: `(x,3)` x=3…10; `(x,6)` x=3…8; `(3,y)` e `(8,y)` y=3…6. A `(9,1)` “Aprovação da entrada”; B `(10,1)` “Aprovação da saída”. Prefixo `E 2`; direto `E 5`; desvio `B 3; E 5; C 3`.

**Blocos:** paleta NAND. Programa inicial usa os mesmos movimentos da referência, mas condição `(NOT A) AND B`.

**Quatro cenários:** 00 → NAND V, uma ativação, G39 aberto, direto; 01 → V, uma, aberto, direto; 10 → V, uma, aberto, direto; 11 → F, nenhuma tentativa, fechado, desvio. Todos recolhem g39 e chegam a `(3,3)`.

**Solução completa:**

```text
E 2
SE A NAND B:
  ATIVAR
  E 5
SENÃO:
  B 3
  E 5
  C 3
```

**Balões:**

1. `block:initial-condition`; entrada: “O programa nega apenas A. A missão pede negar o resultado das duas aprovações juntas.”
2. `decision`; falha inicial em 00: “Nenhuma aprovação chegou. A revisão deveria abrir, mas a condição atual respondeu falso.”
3. `palette:nand`; DICA após a falha: “Use NÃO E, ou coloque A E B inteiro dentro de NÃO.”

**Erro/dica:** mover o NOT apenas para B, produzindo `A AND NOT B`. Dica em `scenario`: “Confira 00: sem nenhuma aprovação, a revisão ainda precisa abrir.”

**Aceitação:** defeituoso passa 01/11 e falha 00/10 por falta de ativação, apesar de chegar com gema. Corrigido passa todos; `A AND NOT B` falha 00/01. Falha deve identificar a operação faltante, sem declarar que faltou um bloco NAND.

## Fase 40 — Revisar e encaminhar

**Conceito e pré-requisitos:** aplicação de NAND com XOR, sequências e repetição contada; fases 31–39. Usar dois resultados distintos sobre os mesmos sinais, sem encadear efeitos indevidos entre portas.

**Objetivo visível:** C40N abre revisão enquanto faltar ao menos uma confirmação: ativar uma vez em 00/01/10. C40X encaminha a pendência individual quando exatamente uma confirmação chegou: ativar uma vez em 01/10. Não ativar a placa cuja regra for falsa. Recolher duas gemas e alcançar o portal.

**Mapa:** início `(1,3)`, C40N `(2,3)` → G40N `(3,3)`, C40X `(6,3)` → G40X `(7,3)`, portal `(10,3)`, gemas g40a `(5,3)` e g40b `(9,3)`. Transitáveis: `(x,3)` x=1…10; `(x,1)` x=2…5; `(2,y)` e `(5,y)` y=1…3; `(x,5)` x=6…9; `(6,y)` e `(9,y)` y=3…5. A `(1,5)` “Confirmação da entrada chegou”; B `(2,5)` “Confirmação da saída chegou”. Prefixo `D 1`; etapa N direto `D 3` ou desvio `C 2; D 3; B 2`, até `(5,3)`; ligação `D 1`; etapa X direto `D 3` ou desvio `B 2; D 3; C 2`, até `(9,3)`; final `D 1`.

**Blocos:** paleta NAND, editor vazio. A condição de referência NAND pode ser construída com NOT/AND; a XOR pode ser construída com AND/OR/NOT. Nenhuma forma é exigida por nome.

**Quatro cenários:**

| A/B | NAND / XOR | Ativações C40N / C40X | Portas G40N / G40X finais | Rotas N / X |
|---|---|---|---|---|
| 00 | V / F | 1 / 0 | Aberto / fechado | Direto / desvio |
| 01 | V / V | 1 / 1 | Aberto / aberto | Direto / direto |
| 10 | V / V | 1 / 1 | Aberto / aberto | Direto / direto |
| 11 | F / F | 0 / 0 | Fechado / fechado | Desvio / desvio |

Todos recolhem g40a/g40b e chegam a `(10,3)`. Em 00, abrir a revisão não significa que uma confirmação chegou; A/B continuam 00 e G40X permanece fechado.

**Solução completa:**

```text
D 1
SE A NAND B:
  ATIVAR
  D 3
SENÃO:
  C 2
  D 3
  B 2
D 1
SE A XOR B:
  ATIVAR
  D 3
SENÃO:
  B 2
  D 3
  C 2
D 1
```

**Balões:**

1. `switch:C40N`; entrada: “Abra a revisão enquanto faltar qualquer confirmação. Leia separadamente a regra do encaminhamento.”
2. `switch:C40X`; DICA ou primeira chegada parada: “O encaminhamento individual só abre quando exatamente uma confirmação chegou.”
3. `decision`; erro em 00: “NAND deu verdadeiro, mas XOR deu falso. Abrir a primeira porta não muda os sinais nem a segunda porta.”

**Erro/dica:** copiar NAND nas duas decisões, ativando C40X em 00. Dica em `signal:A`: “Nenhuma confirmação é diferente de exatamente uma confirmação.”

**Aceitação:** quatro cenários; 13/9/9/17 movimentos em 00/01/10/11. NAND/NAND falha 00 na segunda placa; XOR/XOR falha 00 na primeira; OR/XOR falha 00/11 na primeira. Testar solução equivalente com `NOT(A AND B)` na primeira decisão e `(A OR B) AND NOT(A AND B)` na segunda. Não há estado global que abra ambas as portas.

## Interfaces e verificação desta contribuição

A implementação usa somente o modelo compartilhado: `walkable`, `start`, `goal`, gemas com ID, `signals` A/B, `switches` vinculados por ID a `gates`, quatro `scenarios`, condições compostas, `referenceProgram`, balões e critérios de operação. Fases 33 e 40 exigem dois pares independentes de placa/portão, já previstos pelo contrato geral de IDs, e rastros de ativação por placa. O painel de decisão apresenta operandos e resultado; nenhuma mensagem depende de verificar o nome de um bloco na solução do aluno.

A checagem documental percorre cada movimento das referências nos quatro cenários e verifica: limites, chão, coleta, chegada, placa correta, porta correspondente aberta ao cruzar, ausência de ativação proibida, quantidade exata de ativações e tabela-verdade. Também verifica até 24 palavras por balão e resultados dos programas defeituosos especificados. Essa checagem não substitui testes do runtime, Blockly/fallback, Canvas/WebGL, acessibilidade ou observação com crianças, que ficam para a implementação.

**Evidência obtida nesta etapa:** replay documental em Python, lendo os pseudocódigos deste arquivo e transcrevendo os mapas em conjuntos de células: 40/40 cenários de referência aprovados; 12/12 replays de soluções equivalentes aprovados (35, 38 e 40); oito execuções dos programas defeituosos produziram exatamente as falhas previstas (34: 11; 39: 00/10). Os 30 balões foram extraídos do arquivo e contados: máximo de 19 palavras. O verificador temporário foi executado sem adicionar script ao repositório; não é teste do jogo implementado.
