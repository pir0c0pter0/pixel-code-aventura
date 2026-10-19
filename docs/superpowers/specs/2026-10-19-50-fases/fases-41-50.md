# Fases 41 a 50 — observar, comparar e continuar

## Contrato desta faixa

Planejamento, sem alteração do runtime. Fases 41–45 pertencem ao **Observatório dos Sinais**; 46–50 à **Estação das Estrelas**, ambos com tema cosmos. Pré-requisitos acumulados: movimentos cardinais, repetição contada, IF/ELSE, NOT, AND, OR, XOR, NAND, placas identificadas e sensores de caminho. NOR é explicado na 41; XNOR na 44; repetir até na 46. Não antecipar os blocos novos na paleta.

- Mapas têm 10 × 6 células: x=1…10, y=1…6, y cresce para baixo. Somente o piso declarado é transitável; o restante é parede. Intervalos incluem extremos. `D/E/C/B n` abrevia n movimentos direita/esquerda/cima/baixo, desdobráveis em movimentos ou repetir contado. Início sempre voltado para a direita; sensores cardinais não dependem dessa orientação.
- Sinais `A/B/C/D` são visíveis, identificados, somente leitura e constantes durante cada cenário. Suas posições indicadas são elementos do painel do mapa, fora do piso. Placas `S...` e sinais são objetos distintos. `ATIVAR` age somente sobre a placa sob Lumi. Cada placa começa desligada e abre apenas o portão vinculado, inicialmente fechado, se sua regra for verdadeira. Ativação com regra falsa ou fora da placa falha com explicação.
- **Obrigação visível em todas as missões com placas:** ativar cada placa exatamente uma vez se sua regra for verdadeira; nenhuma tentativa se falsa. Depois, coletar todas as gemas e chegar ao portal sem colisão. Desviar após uma ativação válida também é permitido. Isso impede vencer sempre desviando, sem exigir presença nominal de operador. Aceitar condições logicamente equivalentes.
- `00/01/10/11` significa A/B falso/falso, falso/verdadeiro, verdadeiro/falso e verdadeiro/verdadeiro. Cada fase usa o mesmo programa em todos os cenários, sem edição e com reinicialização completa. Estados não mencionados são fixos pelo mapa. Gemas têm IDs locais `J1...`; portais usam `goal`.
- **Paleta prévia:** movimentos, repetir contado 2–6, IF/ELSE, NOT, AND, OR, XOR, NAND, ATIVAR, sinais identificados, `estou no botão?`, `portão [id] aberto?` e `caminho livre [direção]?`. Na 41 acrescentar NOR; na 44 XNOR; na 46 `REPETIR ATÉ portal com todas as gemas`. Paletas posteriores são cumulativas.
- O laço até testa **antes** de cada volta a condição de conclusão: posição no portal e nenhuma gema restante. Se verdadeira, faz zero voltas; senão executa o corpo e testa novamente. Não há contagem fixa escondida, variável, teletransporte ou ação nova. Limites por cenário: 500 comandos e 100 voltas; expressões com profundidade até 10. Limites interrompem com diagnóstico, nunca concedem vitória.
- Balões seguem integralmente o README: um por vez, fundo `rgba(16,31,48,.92)`, texto opaco até 24 palavras, alvo semântico, seta e reposicionamento, teclado/toque e reabertura. Práticas não reapresentam introduções automaticamente. Demonstrações de decisão ocorrem em PASSO; execução contínua registra a decisão sem abrir balões repetidos.

## 41 — Silêncio no observatório

**Conceito/pré-requisito:** introdução guiada de NOR; conhecer OR, NOT e IF/ELSE. **Objetivo:** liberar a observação somente quando nenhum dos dois alertas estiver ativo.

**Mapa:** piso `y3:x1..9`, `y5:x3..7`, `x3:y3..5`, `x7:y3..5`. Início `(1,3)`, portal `(9,3)`, J1 `(2,3)`, J2 `(8,3)`, S41 `(3,3)`→G41 `(5,3)`. A `(1,1)` “Alerta de luz”; B `(2,1)` “Alerta de ruído”. Regra S41: `A NOR B`. **Blocos:** paleta prévia + NOR; explicar antes do primeiro encaixe.

**Cenários e comportamento:** 00→NOR verdadeiro, uma ativação S41, G41 aberto; 01/10/11→falso, zero ativações, G41 fechado. Referência usa rota direta em 00 e desvio inferior nos demais. Nos quatro, coletar J1/J2 e chegar a `(9,3)`.

**Solução:**
```text
D2
SE A NOR B {ATIVAR; D4}
SENÃO {B2; D4; C2}
D2
```

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `signal:A` | Entrada, antes da edição | “A e B mostram alertas. Só podemos observar quando nenhum dos dois estiver ligado.” |
| `palette:nor` | Após o primeiro balão | “NOR significa nem um nem outro. Só responde verdadeiro, ou sim, quando as duas entradas são falsas.” |
| `block:if.condition` | Ao encaixar NOR | “Com algum alerta ligado, NOR responde falso. O SENÃO leva pelo corredor seguro.” |

**Erro/dica:** confundir NOR com NAND ativa em 01/10. Dica ancorada na decisão: “NOR exige dois nãos; apenas um não ainda não basta.” **Teste:** quatro cenários; substituir NOR por NAND falha 01/10, por OR falha todos; nunca ativar falha 00. Conferir duas gemas e chegada em ambos os ramos.

## 42 — O corredor tranquilo

**Conceito/pré-requisito:** prática de NOR em mapa vertical; fase 41. **Objetivo:** autorizar o corredor apenas sem manutenção nem trânsito contrário.

**Mapa:** piso `x3:y2..6`, `y2:x3..8`, `y4:x3..8`, `x8:y2..4`. Início `(3,6)`, portal `(8,2)`, J1 `(3,5)`, J2 `(8,2)`, S42 `(3,4)`→G42 `(5,2)`. A `(1,1)` “Manutenção”; B `(2,1)` “Trânsito contrário”. Regra S42: `A NOR B`. **Blocos:** paleta da 41; nenhum novo.

**Cenários e comportamento:** 00→uma ativação S42 e G42 aberto; 01/10/11→nenhuma ativação e G42 fechado. Em 00 a referência sobe e segue direita; demais seguem direita antes de subir. Todos coletam J1/J2 e chegam a `(8,2)`; J2 é coletada ao entrar no portal, antes da checagem de vitória.

**Solução:** `C2; SE A NOR B {ATIVAR; C2; D5} SENÃO {D5; C2}`.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `switch:S42` | Entrada, objetivo curto | “Decida sobre esta placa. O desvio continua seguro quando houver manutenção ou trânsito contrário.” |
| `decision` | DICA ou erro em 10 | “Manutenção ligada já impede a autorização. NOR não espera que os dois alertas estejam ligados.” |

**Erro/dica:** testar somente B ignora manutenção; “Compare também A antes de ativar.” **Teste:** repetir 00/01/10/11; condição `NOT B` falha 10, `NOT A` falha 01. As duas rotas devem terminar com as duas gemas recolhidas.

## 43 — Duas maneiras de perguntar

**Conceito/pré-requisito:** comparar `A NOR B` e `NOT (A OR B)`; fases 41–42 e NOT/OR. **Objetivo:** corrigir uma pergunta invertida sem mudar as rotas.

**Mapa:** piso `y3:x2..10`, `y1:x4..8`, `x4:y1..3`, `x8:y1..3`. Início `(10,3)`, portal `(2,3)`, J1 `(9,3)`, J2 `(3,3)`, S43 `(8,3)`→G43 `(6,3)`. A `(9,1)` “Neblina”; B `(10,1)` “Chuva”. Regra S43: `A NOR B`. **Blocos:** paleta da 42. Exemplo opcional com as rotas abaixo e condição errada `NOT A OR B`; carregar somente com confirmação, nunca substituir trabalho automaticamente.

**Cenários e comportamento:** 00→uma ativação S43; 01/10/11→nenhuma. G43 só abre em 00. Recolher J1/J2 e chegar a `(2,3)`. Quadro comparativo antes de executar: OR vale F/V/V/V; NOT desse resultado e NOR valem V/F/F/F.

**Solução:** `E2; SE NOT (A OR B) {ATIVAR; E4} SENÃO {C2; E4; B2}; E2`. Alternativa equivalente: substituir somente a condição por `A NOR B`.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `block:not` | ENTENDER, após mostrar OR | “Primeiro OU pergunta se algum sinal está ligado. NÃO inverte a resposta inteira: isso produz o mesmo resultado de NOR.” |
| `block:if.condition` | DICA no exemplo incorreto | “O NÃO precisa envolver o OU inteiro. Inverter apenas A muda a pergunta.” |
| `decision` | PASSO em 11 | “Com dois sins, OU responde sim. NÃO transforma em não; NOR também responde não.” |

**Erro/dica:** `NOT A OR B` ativa indevidamente 01/11; “Leia os parênteses antes de escolher a rota.” **Teste:** executar os quatro cenários com cada referência separadamente; ambos devem produzir as mesmas ativações e chegada. Exemplo incorreto falha 01/11. Não comparar nomes de blocos para conceder vitória.

## 44 — Respostas em sintonia

**Conceito/pré-requisito:** introdução guiada de XNOR; conhecer XOR, NOT e booleanos. **Objetivo:** autorizar a passagem quando dois indicadores derem respostas iguais, inclusive dois nãos.

**Mapa:** piso `y3:x1..9`, `y5:x3..7`, `x3:y3..5`, `x7:y3..5`. Início `(1,3)`, portal `(9,3)`, J1 `(2,3)`, J2 `(8,3)`, S44 `(3,3)`→G44 `(5,3)`. A `(1,1)` “Indicador esquerdo ligado”; B `(2,1)` “Indicador direito ligado”. Regra S44: `A XNOR B`. **Blocos:** paleta da 43 + XNOR, explicado antes do primeiro uso.

**Cenários e comportamento:** 00/11→XNOR verdadeiro, uma ativação S44 e G44 aberto; 01/10→falso, nenhuma ativação e G44 fechado. Referência usa direto nas respostas iguais, desvio nas diferentes; sempre recolher J1/J2 e chegar a `(9,3)`.

**Solução:** `D2; SE A XNOR B {ATIVAR; D4} SENÃO {B2; D4; C2}; D2`.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `signal:A` | Entrada | “Compare as respostas dos dois indicadores. Dois sins combinam, e dois nãos também combinam.” |
| `palette:xnor` | Após comparar os sinais | “XNOR significa respostas iguais. Dá verdadeiro, ou sim, para dois sins ou dois nãos; respostas diferentes dão falso.” |
| `decision` | PASSO em 00 | “Os dois indicadores dizem não. As respostas são iguais, então XNOR permite ativar a placa.” |

**Erro/dica:** usar AND esquece 00; “Igualdade também acontece com tudo desligado.” **Teste:** quatro cenários; AND falha 00 e XOR inverte os quatro resultados. Verificar explicação de 00 antes de oferecer exemplos montados.

## 45 — A dupla conferência

**Conceito/pré-requisito:** prática de igualdade e comparação com XOR; fase 44. **Objetivo:** liberar o corredor somente quando dois leitores concordarem.

**Mapa:** piso `x3:y2..6`, `y2:x3..8`, `y4:x3..8`, `x8:y2..4`. Início `(3,6)`, portal `(8,2)`, J1 `(3,5)`, J2 `(8,2)`, S45 `(3,4)`→G45 `(5,2)`. A `(1,1)` “Leitor A detecta estrela”; B `(2,1)` “Leitor B detecta estrela”. Regra S45: `A XNOR B`. **Blocos:** paleta da 44.

**Cenários e comportamento:** 00/11→uma ativação S45, G45 aberto, referência pelo alto; 01/10→nenhuma, G45 fechado, referência pelo desvio. Recolher ambas as gemas e chegar ao portal em todos.

**Solução:** `C2; SE A XNOR B {ATIVAR; C2; D5} SENÃO {D5; C2}`. `NOT (A XOR B)` é alternativa ensinada em ENTENDER depois da tentativa.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `signal:B` | Entrada, objetivo curto | “Os leitores podem concordar sobre presença ou ausência. Nos dois casos, autorize a passagem.” |
| `decision` | DICA em 01 ou 10 | “XOR reconhece respostas diferentes. XNOR faz o contrário: reconhece respostas iguais.” |

**Erro/dica:** confundir “iguais” com “ambos ligados”; “Teste também o cenário com duas respostas não.” **Teste:** todos os quatro; trocar XNOR por NOR falha 11, trocar por OR falha 00/01/10. Conferir equivalência com NOT(XOR) nos quatro.

## 46 — Continue até chegar

**Conceito/pré-requisito:** introduzir repetir até, com parada testada antes do corpo; repetição contada e coleta. **Objetivo:** usar o mesmo programa para duas distâncias, terminando no portal com todas as gemas.

**Mapa:** piso `y3:x1..9`. Portal `(9,3)`, J1 `(5,3)`, J2 `(8,3)`. Sem placas, portões ou sinais. Início varia somente conforme cenário: L `(1,3)`; C `(4,3)`. **Blocos:** paleta da 45 + repetir até portal com todas as gemas; destacar somente o novo laço e direita na introdução.

**Cenários e comportamento:** a referência percorre oito passos D em L e cinco em C. Ambos coletam J1/J2 e terminam em `(9,3)`. Não é obrigatório usar laço nominalmente; as condições de chegada e ausência de colisões continuam sendo a avaliação. O jogo encerra ao chegar com todas as gemas, ignorando comandos restantes: oito D desenrolados também vencem os dois cenários. O laço ensina parada e concisão, sem alegar que estes cenários provam seu uso.

**Solução:** `REPETIR ATÉ portal com todas as gemas {D}`. O corpo com D fixo é seguro **somente porque este mapa é um corredor reto**, e não se repete depois de chegar. Nas fases seguintes, curvas exigem decisões ou trechos completos.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `palette:untilGoal` | Entrada, antes do uso | “REPETIR ATÉ verifica a chegada antes de cada volta. Continua enquanto faltar alcançar o portal com todas as gemas.” |
| `block:until.body` | Ao encaixar D | “Neste corredor reto, cada volta anda uma casa. O começo muda, mas a pergunta de parada continua valendo.” |
| `goal` | PASSO antes da última verificação | “Lumi chegou com todas as gemas. A pergunta agora responde sim, então o laço termina sem outro movimento.” |

**Erro/dica:** repetir cinco vezes deixa L incompleto; “Deixe a chegada decidir quando parar.” **Teste:** L/C completos; cinco movimentos fixos falham L, oito fixos são aceitos pelo encerramento antecipado da execução. Teste isolado do interpretador: começando no portal sem gemas pendentes, corpo faz zero ações; corpo vazio fora do portal atinge proteção de 100 voltas e falha, sem travar a tela. Esse teste não é um terceiro cenário curricular; não alterar a semântica de vitória para forçar o uso do laço.

## 47 — Silêncio antes da curva

**Conceito/pré-requisito:** NOR seguido de laço até com sensor espacial; fases 41–43 e 46. **Objetivo:** autorizar apenas sem alertas e seguir um corredor que dobra para baixo.

**Mapa:** piso `y2:x1..8`, `x8:y2..5`, `y4:x3..6`, `x3:y2..4`, `x6:y2..4`. Início `(1,2)`, portal `(8,5)`, J1 `(2,2)`, J2 `(7,2)`, J3 `(8,4)`, S47 `(3,2)`→G47 `(5,2)`. A `(1,6)` “Alerta de luz”; B `(2,6)` “Alerta de ruído”. Regra S47: `A NOR B`. **Blocos:** paleta da 46.

**Cenários e comportamento:** 00→uma ativação S47; 01/10/11→nenhuma. Referência reencontra `(6,2)` por direto ou desvio e segue até `(8,5)`, coletando três gemas. Nenhum cenário atravessa G47 fechado.

**Solução:**
```text
D2
SE A NOR B {ATIVAR; D3} SENÃO {B2; D3; C2}
REPETIR ATÉ portal com todas as gemas {
  SE caminho livre DIREITA {D} SENÃO {B}
}
```

No trecho do laço, x só aumenta até 8; depois y só aumenta até 5. Não há bifurcação para baixo antes da curva nem retorno ao desvio; a distância restante diminui a cada volta.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `block:until.body` | ENTENDER ou primeira montagem | “Depois do reencontro, pergunte a cada volta: dá para ir à direita? Na curva, o caminho continua para baixo.” |
| `decision` | PASSO em `(8,2)` | “À direita há parede. O SENÃO desce uma casa; o laço pergunta novamente antes do próximo passo.” |

**Erro/dica:** manter somente D no laço colide em `(9,2)`; “A chegada decide parar; o sensor decide por onde andar.” **Teste:** quatro entradas, três gemas e cinco voltas no trecho final. Mutação D fixo deve falhar em todos; ativação sempre falha nos três falsos.

## 48 — Nenhum alerta, respostas iguais

**Conceito/pré-requisito:** duas regras independentes aplicadas ao mesmo par, NOR e XNOR; fases 41–47. **Objetivo:** distinguir ausência de alertas de igualdade de respostas na mesma viagem.

**Mapa:** piso `y3:x1..10`, `y5:x2..4`, `y5:x6..8`, `x2:y3..5`, `x4:y3..5`, `x6:y3..5`, `x8:y3..5`. Início `(1,3)`, portal `(10,3)`, J1 `(5,3)`, J2 `(9,3)`. S48a `(2,3)`→G48a `(3,3)`, regra `A NOR B`; S48b `(6,3)`→G48b `(7,3)`, regra `A XNOR B`. A `(1,1)` “Alerta A”; B `(2,1)` “Alerta B”. **Blocos:** paleta da 47.

**Cenários e comportamento:** 00→ativar S48a e S48b uma vez; 01/10→não ativar nenhuma; 11→ativar apenas S48b. Portões abrem exclusivamente pela respectiva ativação. Todos coletam J1/J2 e chegam ao portal. Obrigação de cada placa aparece junto de seu vínculo antes de executar.

**Solução:**
```text
D
SE A NOR B {ATIVAR; D2} SENÃO {B2; D2; C2}
D2
SE A XNOR B {ATIVAR; D2} SENÃO {B2; D2; C2}
REPETIR ATÉ portal com todas as gemas {D}
```

O trecho final começa `(8,3)` e é reto, com duas voltas; não pode ser usado para atravessar os portões antes das decisões.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `switch:S48a` | Entrada, objetivo curto | “A primeira placa pede dois alertas desligados. A segunda pede respostas iguais. Confira a regra de cada placa.” |
| `switch:S48b` | DICA em 11 | “Dois alertas ligados não passam no NOR, mas são respostas iguais. Aqui XNOR permite ativar.” |

**Erro/dica:** copiar NOR para a segunda placa falha 11; “Copie a estrutura, mas confira qual pergunta cada estação faz.” **Teste:** quatro cenários e ambas as obrigações; copiar XNOR para a primeira falha 11. Abrir G48a não pode abrir G48b. Cenário 11 distingue as duas regras sem exigir sintaxe específica.

## 49 — Pergunte em cada estação

**Conceito/pré-requisito:** decisão local dentro de repetir até e expressão curta com operadores conhecidos; fases 46–48, XOR/OR. **Objetivo:** visitar duas placas com a mesma regra: uma antena ligada, ou autorização de teste.

**Mapa:** piso `y3:x1..10`, `y5:x2..4`, `y5:x6..8`, `x2:y3..5`, `x4:y3..5`, `x6:y3..5`, `x8:y3..5`. Início `(1,3)`, portal `(10,3)`, J1 `(5,3)`, J2 `(9,3)`. S49a `(2,3)`→G49a `(3,3)` e S49b `(6,3)`→G49b `(7,3)`, ambas com regra `(A XOR B) OR C`. A `(1,1)` “Antena A ligada”; B `(2,1)` “Antena B ligada”; C `(3,1)` “Teste autorizado”. **Blocos:** paleta da 48; nenhum predicado novo.

**Cenários e comportamento:** oito cenários ABC: 000→F; 001→V; 010→V; 011→V; 100→V; 101→V; 110→F; 111→V. Se V, ativar cada placa uma vez; se F, nenhuma. Sempre recolher J1/J2 e chegar a `(10,3)`. A autorização C permite operar mesmo com zero ou duas antenas ligadas; essa regra é mostrada na missão.

**Solução:**
```text
REPETIR ATÉ portal com todas as gemas {
  SE estou no botão {
    SE (A XOR B) OR C {ATIVAR; D2}
    SENÃO {B2; D2; C2}
  } SENÃO {D}
}
```

Cada volta fora de placa avança x em 1; cada volta sobre placa termina após o portão, avançando x em 2. O desvio inteiro fica dentro do ramo; nenhuma volta começa no meio de sua vertical. Assim não há retorno infinito nem ativação repetida. `estou no botão` é reavaliado a cada volta, incluindo S49b.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `block:until.body` | ENTENDER | “Em cada volta, veja se há uma placa. Sobre ela, decida e atravesse a estação inteira antes da próxima volta.” |
| `signal:C` | DICA em 001 | “Mesmo sem antenas ligadas, a autorização de teste permite operar. O OU considera essa segunda possibilidade.” |
| `switch:S49b` | PASSO na segunda placa | “Esta placa ainda não foi ativada. A pergunta local é refeita; a primeira ativação não abre este portão.” |

**Erro/dica:** testar placa só antes do laço nunca a encontra no início; “A pergunta sobre a placa fica dentro da repetição.” **Teste:** oito cenários, duas ativações nos seis verdadeiros e zero nos dois falsos; sete voltas em todos. Trocar XOR por OR falha 110; ignorar C falha 001/111. Guardar o primeiro resultado local causa colisão, diagnosticando leitura congelada.

## 50 — A última viagem de Lumi

**Conceito/pré-requisito:** síntese de decisões sequenciais, NAND, XNOR, ativação por ID, repetição e navegação; todas as anteriores. **Objetivo:** autorizar duas estações segundo regras diferentes e concluir a curva final com todas as gemas. A síntese usa conceitos já ensinados; não exige encaixar todos os operadores em uma expressão gigante.

**Mapa:** piso `y3:x1..10`, `x10:y3..6`, `y5:x2..4`, `y5:x6..8`, `x2:y3..5`, `x4:y3..5`, `x6:y3..5`, `x8:y3..5`. Início `(1,3)`, portal `(10,6)`, J1 `(5,3)`, J2 `(9,3)`, J3 `(10,5)`. S50a `(2,3)`→G50a `(3,3)`, regra `A NAND B`; S50b `(6,3)`→G50b `(7,3)`, regra `C XNOR D`. A `(1,1)` “Canal A ocupado”; B `(2,1)` “Canal B ocupado”; C `(3,1)` “Leitor C detecta estrela”; D `(4,1)` “Leitor D detecta estrela”. **Blocos:** paleta completa da 49; soluções equivalentes e repetição contada continuam aceitas.

**Cenários determinísticos:** produto cartesiano dos quatro AB pelos quatro CD, 16 cenários nomeados `AB-CD`. A tabela explicita as placas que devem ser ativadas exatamente uma vez; `—` significa nenhuma. Demais ativações são proibidas. Cada portão só abre com sua placa.

| AB \ CD | 00 | 01 | 10 | 11 |
|---|---|---|---|---|
| 00 | S50a, S50b | S50a | S50a | S50a, S50b |
| 01 | S50a, S50b | S50a | S50a | S50a, S50b |
| 10 | S50a, S50b | S50a | S50a | S50a, S50b |
| 11 | S50b | — | — | S50b |

**Comportamento obrigatório:** cumprir ambas as regras em todos os 16 cenários, coletar J1/J2/J3, alcançar `(10,6)` sem colisão nem ações após o término da referência. Uma regra não pode substituir a outra: por exemplo, 11-00 exige apenas S50b e 00-01 apenas S50a.

**Solução:**
```text
D
SE A NAND B {ATIVAR; REPETIR 2 {D}}
SENÃO {REPETIR 2 {B}; REPETIR 2 {D}; REPETIR 2 {C}}
REPETIR 2 {D}
SE C XNOR D {ATIVAR; REPETIR 2 {D}}
SENÃO {REPETIR 2 {B}; REPETIR 2 {D}; REPETIR 2 {C}}
REPETIR ATÉ portal com todas as gemas {
  SE caminho livre DIREITA {D} SENÃO {B}
}
```

Nos cabeçalhos de condição `C` e `D` são IDs de sinais; nos corpos são movimentos cima/direita, com formatos distintos nos editores. O laço começa `(8,3)`, avança até x10 e então desce até y6: cinco voltas, distância ao portal sempre decrescente. Não entra nos desvios já resolvidos.

**Balões:**

| Alvo | Gatilho | Texto |
|---|---|---|
| `scenario` | Entrada, objetivo curto | “Seu programa precisa completar dezesseis cenários. Confira as duas regras e teste todas as combinações sem editar entre elas.” |
| `switch:S50b` | DICA após confundir regras | “A segunda estação compara os leitores C e D. Ela não usa a ocupação dos canais A e B.” |
| `goal` | ENTENDER antes da curva final | “Planeje decisões, coleta e chegada. O último laço precisa escolher movimentos seguros até alcançar este portal com todas as gemas.” |

**Erro/dica:** reutilizar A/B na segunda condição ou tomar NAND por XOR; “Leia os quatro sinais e confira cada vínculo.” **Teste:** 16 cenários em uma AST congelada; inverter a segunda regra, copiar os primeiros sinais ou trocar NAND por XOR deve reprovar combinações específicas. Em 00-00, XOR no lugar de NAND perde S50a; em 11-00, usar A/B para XNOR pode coincidir, mas 00-01 revela o erro. Após sucesso integral, encerrar a campanha sem buscar fase 51; reexecutar não duplica recompensa.

## Interfaces e verificação desta proposta

- Dados precisam dos mesmos sinais, placas/portões por ID, gemas, cenários e obrigações já propostos no README e nas fases 21–30. Não criar inventário, mensagens, variáveis, portas temporizadas ou objetos acionáveis além de placas. Regras de autorização são dados da missão, sempre visíveis ao jogador.
- NOR/XNOR ampliam a AST de expressões e a avaliação nos dois editores; ambos retornam booleanos sem modificar sinais. Repetir até reutiliza a condição de conclusão do cenário, reavaliada depois de cada corpo; respeita cancelamento, PASSO, serialização e proteções de execução.
- Coleção de gemas ocorre antes de avaliar chegada na mesma célula. Todos os ramos válidos têm saída segura; obrigações de ativação distinguem aprendizagem de uma rota fixa pelo desvio. Reiniciar cenários restaura placas e portões independentemente.
- A implementação deve executar referências e mutações descritas, inclusive operandos/ramos inválidos não escolhidos, zero voltas ao já concluir, 100 voltas sem progresso e 500 comandos. A contagem exata de blocos para estrelas será medida na AST implementada, não estimada neste documento.
- Verificação de planejamento executada: replay independente em Python, com asserts de piso, portão aberto antes da travessia, ativações autorizadas exatas, gemas, chegada e término, passou nos **54 cenários** das referências. Também verificou zero voltas quando a condição inicial já está satisfeita. Máximos por fase, em movimentos + ATIVAR: 41=12, 42=10, 43=12, 44=12, 45=10, 46=8, 47=14, 48=17, 49=17, 50=20. Máximos de voltas de ATÉ: 46=8, 47=5, 48=2, 49=7, 50=5. Mesmo contando testes e controles desses programas pequenos, há ampla margem para 500 comandos; a contagem oficial deve ser conferida no interpretador implementado.
- Conferência textual executada: dez fichas e **26 balões**, todos com até **20 palavras**, abaixo do limite de 24. As mutações e testes de proteção descritos nas fichas são requisitos para implementação posterior; não foram executados contra o jogo atual. O replay não valida renderização, acessibilidade, migração ou eficácia pedagógica com crianças.
