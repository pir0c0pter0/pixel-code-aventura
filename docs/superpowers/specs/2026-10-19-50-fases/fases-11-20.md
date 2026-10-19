# Fases 11–20 — decisões observáveis

Planejamento, sem implementação. Faixa 11–15: booleanos e IF; faixa 16–20: IF/ELSE e NOT. Pré-requisitos: fases 1–10 ensinaram movimentos cardinais e repetir contado. Nenhuma fase exige AND, OR, XOR ou repetir até.

## Contrato comum de mapas, execução e ensino

- Interior: `x=1..10`, `y=1..6`; cima diminui y. Células não listadas são paredes. Intervalos incluem extremos; a união das linhas listadas define todo o piso. Portão fechado bloqueia sua célula. Portal e início são piso.
- `D n`, `E n`, `C n`, `B n` significam direita, esquerda, cima e baixo, n vezes. São abreviações de movimentos existentes, não novos blocos. `D 7`, por exemplo, vira `repetir 6 {D}; D`. Todas as soluções usam somente contagens de 2–6 no editor. Coordenadas e nomes em pseudocódigo são referências de planejamento, não variáveis ensinadas à criança.
- Ações existentes preservadas: movimentos absolutos, coleta ao pisar e `ativar` a placa sob Lumi. Ativar é idempotente e só abre portões vinculados ao id daquela placa. **Nos desafios novos, ativar fora de placa encerra o cenário com diagnóstico**; o comportamento antigo pode permanecer somente na compatibilidade de programas legados.
- Objetos existentes reaproveitados: Lumi, piso, parede, cristal, portal, placa e portão. Extensões necessárias: listas de placas/portões com ids e vínculos, estado individual, estado inicial por cenário, pisos ramificados e conjunto de cristais por cenário. Nenhuma ação nova é necessária.
- Predicados novos, booleanos visíveis: `portão [id] aberto?` lê o próprio portão; `caminho livre [direção]?` lê a célula adjacente naquela direção, incluindo portão; `estou no botão?` reaproveita a condição atual. O sensor direcional explicita a direção para não depender da última movimentação. A interface destaca a célula/objeto lido e exibe VERDADEIRO/FALSO, além de cor. Portões têm id visível e estado ABERTO/FECHADO; placas, id e vínculo visual com seu portão. Não existem sensores com valores secretos.
- IF genérico tem entrada booleana e corpo ENTÃO nas fases 11–15. ELSE só é liberado na 16; NOT na 18. Constantes booleanas podem ser mostradas na explicação, mas não são necessárias na paleta. Nenhum predicado já negado é oferecido antes de NOT.
- Cada execução avaliada usa **o mesmo programa imutável em todos os cenários listados**, sempre na ordem indicada. A interface oferece prévia dos cenários, informa qual está rodando e permite inspecioná-los antes de executar. Reinicializar entre cenários posição, direção, cristais, placas, portões, contadores, eventos e estado de conclusão. Sucesso exige portal com todos os cristais em todos os cenários, sem colisão nem ação inválida. Só depois salvar estrelas/progresso. O aluno pode parar e editar; isso invalida os resultados parciais e reinicia a bateria.
- A avaliação observa ações, trajetória, cristais e resultado; não exige presença nominal de IF/ELSE/NOT nem compara AST com solução. Soluções alternativas equivalentes são válidas. Os cenários impedem uma trajetória fixa: um desvio obrigatório para buscar cristal em um cenário fica bloqueado em outro.
- Todos os balões abaixo têm até 24 palavras. Ancorar por alvo semântico, com posição calculada a partir da célula ou bloco real, perto e preferencialmente acima, seta curta e sem cobrir o alvo. Se faltar espaço, reposicionar ao lado/abaixo; no celular usar faixa junto ao mapa com seta/destaque até o alvo, sem esconder controles. Um balão por vez, fechamento por toque/teclado, foco previsível e texto acessível. Apresentar explicações detalhadas com execução parada ou no modo PASSO; na execução contínua, guardar o resultado no painel consultável, sem abrir balões a cada decisão. Botão “Rever explicação” reabre a sequência e destaca o alvo relevante, sem restaurar ou modificar o estado do jogo, inclusive no editor alternativo.
- `Base` na paleta significa quatro movimentos e repetir 2–6. Blocos já aprendidos continuam disponíveis: as listas de cada fase são cumulativas. Ativar entra na 14; ELSE na 16; NOT na 18.

## 11 — A pergunta do portão

**Objetivo/conceito:** buscar um cristal lateral somente quando o portão está aberto; apresentar booleano e IF. **Pré-requisito:** fase 10.

**Mapa:** piso `y4:x1..9` e `x3:y2..3`. Início `(1,4)`, direção direita; portal `(9,4)`; G1 `(3,3)`. Cristal fixo `(7,4)`. Sem placa. Novo nesta fase: estado inicial variável do portão e IF com sensor de estado.

**Blocos:** Base + IF + `portão [id] aberto?`.

**Cenários exatos:** A: G1 aberto, cristal adicional `(3,2)`. B: G1 fechado, sem cristal lateral. A exige visitar `(3,2)` e voltar; B exige permanecer no caminho principal. Ambos chegam ao portal.

**Solução:** `D2; SE G1 aberto {C2; B2}; D6`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `gate:G1` | Antes da primeira edição | “Este portão pode estar aberto ou fechado. A pergunta «está aberto?» responde verdadeiro ou falso.” |
| `block:if.condition` | Ao encaixar a pergunta | “SE a resposta for verdadeira, Lumi executa os blocos de dentro. Se for falsa, continua depois deles.” |
| `gem:(3,2)` ou sua célula | Na prévia dos cenários | “Compare os dois cenários. O cristal lateral aparece quando a passagem está aberta. Seu programa precisa resolver os dois.” |

**Erro/dica:** ir sempre para cima colide em B; ignorar o desvio deixa cristal em A. “Guarde a ida e a volta dentro do mesmo SE.”

**Aceitação:** solução termina em `(9,4)` nos dois cenários, com zero cristais. Remover o IF e seu corpo falha em A; tornar seu corpo incondicional falha em B.

## 12 — Olhe para a direita

**Objetivo/conceito:** usar sensor espacial explícito; compreender que IF não muda posição quando falso. **Pré-requisito:** 11.

**Mapa:** piso `x5:y1..6` e `y3:x6..8`. Início `(5,1)`, direção baixo; portal `(5,6)`; G1 `(6,3)`; cristal fixo `(5,5)`. Sem placa. Novo: `caminho livre [direção]?`, leitura da célula adjacente.

**Blocos:** paleta da 11 + `caminho livre [direção]?`.

**Cenários:** A: G1 fechado, apenas cristal fixo. B: G1 aberto, cristal adicional `(8,3)`. Em A seguir para baixo; em B visitar `(8,3)`, retornar a `(5,3)` e seguir para baixo.

**Solução:** `B2; SE caminho livre DIREITA {D3; E3}; B3`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `cell:(6,3)` | Ao chegar a `(5,3)` em PASSO | “«Caminho livre à direita?» examina esta casa vizinha, mesmo que o último movimento de Lumi tenha sido para baixo.” |
| `block:if.body` | Ao montar o desvio | “A ida e a volta ficam juntas dentro do SE. Assim, Lumi retorna ao caminho principal.” |

**Erro/dica:** testar em `(5,1)` lê parede, não G1. “Ande até a entrada lateral antes de perguntar.”

**Aceitação:** executar A e B sem editar; registrar leitura em `(5,3)` na demonstração. Em B coletar `(8,3)`; em A nunca tentar `(6,3)`. Avaliador aceita outra leitura/solução equivalente que cumpra a missão.

## 13 — Duas perguntas independentes

**Objetivo/conceito:** executar dois IF em sequência, sem combinar condições. **Pré-requisitos:** 11–12.

**Mapa:** piso `y4:x1..10`, `x3:y2..3`, `x7:y2..3`. Início `(1,4)`, direita; portal `(10,4)`. G1 `(3,3)`, G2 `(7,3)`; cristal fixo `(9,4)`. Cada portão aberto disponibiliza seu cristal: G1→`(3,2)`, G2→`(7,2)`. Sem placas. Novidade de dados: dois portões independentes com ids.

**Blocos:** paleta da 12.

**Cenários:** A `(G1,G2)=(F,F)`; B `(V,F)`; C `(F,V)`; D `(V,V)`, onde V=aberto e F=fechado. Cristais laterais existem exatamente nos ramos abertos. Esperado: visitar apenas os desvios abertos, depois portal.

**Solução:** `D2; SE G1 aberto {C2; B2}; D4; SE G2 aberto {C2; B2}; D3`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `gate:G2` | Ao apresentar o mapa | “G1 e G2 têm estados próprios. Um portão aberto não conta como resposta para o outro.” |
| `block:if.second` | Ao adicionar o segundo IF | “Estas perguntas são separadas. Lumi pode visitar nenhum desvio, um deles ou os dois.” |

**Erro/dica:** usar G1 nos dois IF funciona em A/D, mas falha B/C. “Confira o nome do portão em cada pergunta.”

**Aceitação:** quatro cenários passam; B coleta somente cristal lateral de G1, C somente de G2. Trocar o sensor de G2 por G1 deve reprovar B/C, demonstrando independência real.

## 14 — A placa mudou de lugar

**Objetivo/conceito:** IF local protege a ação ativar; vincular placa ao portão. **Pré-requisitos:** 11–13.

**Mapa:** piso `y3:x1..10` e `x4:y4..5`. Início `(1,3)`, direita; portal `(10,3)`; G1 `(8,3)`, inicialmente fechado; cristais `(4,5)` e `(9,3)`. Há exatamente uma placa S1, inicialmente desligada, ligada a G1. Sua posição muda conforme cenário. Novo: ativar e predicado existente `estou no botão?` entram no currículo; ids explicitam o vínculo.

**Blocos:** paleta da 13 + `estou no botão?` + ativar.

**Cenários:** A: S1 `(3,3)`; B: S1 `(6,3)`. A outra célula é piso comum. Em ambos, visitar os dois pontos candidatos, ativar S1 ao encontrá-la, coletar o cristal do ramal e abrir G1 antes de atravessá-lo. Ativar em piso comum é falha diagnóstica, não comando silenciosamente ignorado.

**Solução:** `D2; SE estou no botão {ativar}; D; B2; C2; D2; SE estou no botão {ativar}; D4`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `switch:S1` | Ao apresentar cada prévia | “Esta placa abre G1. Para ativá-la, Lumi precisa estar exatamente sobre ela.” |
| `block:if.onSwitch` | Ao encaixar o predicado | “«Estou no botão?» acompanha a posição de Lumi. Use a pergunta nos dois lugares onde a placa pode aparecer.” |
| `cell:invalidActivate` | Após ativação inválida | “Aqui não há placa. Coloque ATIVAR dentro do SE para agir somente quando a resposta for verdadeira.” |

**Erro/dica:** ativar nos dois pontos sem teste falha no ponto vazio; testar apenas um perde um cenário. “Repita a mesma pergunta nos dois pontos candidatos.”

**Aceitação:** A/B chegam ao portal, ativam S1 exatamente uma vez e nunca em piso vazio; ambos visitam `(4,5)`. Uma execução com ATIVAR incondicional nos dois candidatos reprova pela ação inválida, mesmo que tenha aberto o portão.

## 15 — Perguntar a cada parada

**Objetivo/conceito:** IF dentro de repetir contado reavalia o espaço em cada iteração. **Pré-requisitos:** 10–14.

**Mapa:** piso `y5:x1..10`; ramais `x3:y3..4`, `x5:y3..4`, `x7:y3..4`. Início `(1,5)`, direita; portal `(10,5)`. G1 `(3,4)`, G2 `(5,4)`, G3 `(7,4)`; cristal fixo `(9,5)`. Cristais condicionais `(3,3)`, `(5,3)`, `(7,3)` existem exatamente se o respectivo portão está aberto. Sem placas; todos os estados são estáticos durante cada cenário.

**Blocos:** paleta da 14.

**Cenários:** A `FFF`; B `VVV`; C `VFV`; D `FVF`, na ordem G1/G2/G3. Esperado: três consultas locais e visita a todos os ramais abertos, ignorando fechados, antes do portal.

**Solução:** `REPETIR 3 {D2; SE caminho livre CIMA {C2; B2}}; D3`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `block:repeat.body` | Ao montar a repetição | “Cada repetição anda até uma nova entrada e faz a pergunta de novo. A resposta pode mudar de lugar para lugar.” |
| `cell:(5,4)` | Segunda iteração de C | “Na primeira entrada havia passagem. Nesta, o portão está fechado: o mesmo SE agora pula o desvio.” |

**Erro/dica:** colocar a condição fora do laço testa um único lugar. “A pergunta precisa viajar junto com os passos repetidos.”

**Aceitação:** quatro cenários passam e leitura não fica congelada na primeira resposta. Programa que reutiliza a resposta inicial falha C/D. Colisões e cristais restantes permanecem critérios, sem exigir laço nominal.

## 16 — Um caminho ou o outro

**Objetivo/conceito:** introduzir IF/ELSE como escolha de exatamente um ramo. **Pré-requisito:** 15.

**Mapa:** piso `y3:x1..3`, `y3:x7..9`, `y2:x3..7`, `y4:x3..7`. Início `(1,3)`, direita; portal `(9,3)`. Gcima `(3,2)`; Gbaixo `(3,4)`. Cada cenário abre exatamente um deles. Cristal no meio da rota aberta: `(5,2)` ou `(5,4)`. Sem placa. Não há piso `y3:x4..6`, evitando atalho central.

**Blocos:** paleta da 15 + IF/ELSE; IF simples continua disponível.

**Cenários:** A: Gcima aberto, Gbaixo fechado, cristal `(5,2)`. B: Gcima fechado, Gbaixo aberto, cristal `(5,4)`. A exige rota superior; B exige inferior; ambas reencontram `(7,3)`.

**Solução:** `D2; SE Gcima aberto {C; D4; B} SENÃO {B; D4; C}; D2`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `block:ifElse.else` | Ao liberar ELSE | “SENÃO executa quando a pergunta é falsa. Lumi escolhe um dos dois caminhos e depois continua o programa.” |
| `gate:Gbaixo` | Prévia de B | “Quando o portão de cima está fechado, este está aberto. O caminho de baixo também leva ao encontro.” |
| `cell:(7,3)` | Ao desenhar a solução | “Os dois caminhos terminam aqui. Depois da escolha, os últimos passos podem ficar fora do SE.” |

**Erro/dica:** executar as duas rotas em sequência colide. “Guarde uma rota no ENTÃO e a outra no SENÃO.”

**Aceitação:** A/B coletam seu cristal e terminam em `(9,3)`; sempre há um caminho aberto. Trocar os corpos causa colisão em ambos. IF equivalentes separados também são aceitos quando resolvem todos os cenários.

## 17 — Duas bifurcações

**Objetivo/conceito:** sequência de escolhas independentes com reencontro de rotas. **Pré-requisito:** 16.

**Mapa:** piso `y3:x1..2`, `y3:x4..6`, `y3:x8..10`, `y2:x2..4`, `y4:x2..4`, `y2:x6..8`, `y4:x6..8`. Início `(1,3)`, direita; portal `(10,3)`. G1c `(2,2)`, G1b `(2,4)`, G2c `(6,2)`, G2b `(6,4)`. Cada par tem exatamente um portão aberto. Cristais: `(3,2)` ou `(3,4)` no primeiro par; `(7,2)` ou `(7,4)` no segundo, sempre na rota aberta. Sem placas.

**Blocos:** paleta da 16.

**Cenários:** A: cima/cima; B: cima/baixo; C: baixo/cima; D: baixo/baixo. Em cada par a outra rota está fechada. Esperado: escolher cada bifurcação conforme seu próprio portão e coletar os dois cristais.

**Solução:** `D; SE G1c aberto {C; D2; B} SENÃO {B; D2; C}; D2; SE G2c aberto {C; D2; B} SENÃO {B; D2; C}; D2`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `gate:G2c` | Ao chegar a `(6,3)` em PASSO | “Esta é outra decisão. O caminho escolhido antes não determina qual portão está aberto agora.” |
| `block:ifElse.second` | Ao montar a segunda escolha | “Use o nome do segundo portão nesta pergunta. Cada SE/SENÃO cuida da sua bifurcação.” |

**Erro/dica:** copiar o sensor G1c para a segunda escolha falha nos estados mistos. “Copie a estrutura, mas confira o objeto consultado.”

**Aceitação:** quatro combinações passam; ambas as rotas de cada bifurcação são exercitadas. Estado do primeiro portão não pode controlar indevidamente o segundo.

## 18 — A pergunta ao contrário

**Objetivo/conceito:** NOT inverte verdadeiro/falso, sem modificar o mundo. **Pré-requisitos:** booleanos e IF/ELSE, 16–17.

**Mapa:** piso `x5:y1..2`, `x5:y5..6`, `y2:x3..7`, `y5:x3..7`, `x3:y3..4`, `x7:y3..4`. Início `(5,1)`, baixo; portal `(5,6)`. Gdireita `(6,2)`, Gesquerda `(4,2)`, exatamente um aberto. Cristal `(7,4)` se direita aberta ou `(3,4)` se esquerda aberta. Centro `x5:y3..4` é parede. Sem placas.

**Blocos:** paleta da 17 + NOT/NÃO com uma entrada booleana.

**Cenários:** A: Gdireita aberto/Gesquerda fechado; B: Gdireita fechado/Gesquerda aberto. `NÃO Gdireita aberto` é falso em A, verdadeiro em B; esperado seguir direita em A, esquerda em B.

**Solução:** `B; SE NÃO (Gdireita aberto) {E2; B3; D2} SENÃO {D2; B3; E2}; B`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `block:not` | Ao encaixar NOT | “NÃO troca a resposta: verdadeiro vira falso; falso vira verdadeiro. O portão continua no mesmo estado.” |
| `gate:Gdireita` | Antes de avaliar o IF em B | “O portão da direita está fechado. «Está aberto?» é falso; com NÃO, a condição fica verdadeira.” |
| `block:ifElse.then` | Ao selecionar a rota | “Agora o ENTÃO leva à esquerda. Leia a pergunta inteira, incluindo o NÃO, antes de escolher os movimentos.” |

**Erro/dica:** colocar NOT sem trocar o significado da rota leva ao portão fechado. “Confira a resposta completa e qual corpo ela escolhe.”

**Aceitação:** duas linhas da tabela de NOT conferidas em execução: entrada V→F escolhe direita; entrada F→V escolhe esquerda. Condição sem NOT e corpos trocados é alternativa válida; não fiscalizar bloco nominal.

## 19 — Sem placa, pelo desvio

**Objetivo/conceito:** NOT aplicado a uma condição local; ELSE pode conter ativação antes do movimento. **Pré-requisitos:** 14, 16 e 18.

**Mapa:** mesmo piso da 16, explicitamente `y3:x1..3`, `y3:x7..9`, `y2:x3..7`, `y4:x3..7`. Início `(1,3)`, direita; portal `(9,3)`. Gcima `(3,2)` começa fechado nos dois cenários; Gbaixo `(3,4)` depende do cenário. Quando presente, S1 `(3,3)` começa desligada e abre somente Gcima. Novo uso: cenário pode conter ou não uma placa real; não há placa invisível.

**Blocos:** paleta da 18.

**Cenários:** A: sem S1, Gbaixo aberto, cristal `(5,4)`. B: S1 presente, Gbaixo fechado, cristal `(5,2)`. Em A, não ativar e seguir baixo; em B, ativar S1 e seguir cima. Não é necessário atravessar portão fechado: em B a ativação antecede o passo.

**Solução:** `D2; SE NÃO (estou no botão) {B; D4; C} SENÃO {ativar; C; D4; B}; D2`.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `cell:(3,3)` | Prévia de A | “Sem placa sob Lumi, «estou no botão?» responde falso. NÃO transforma essa resposta em verdadeiro: siga pelo desvio.” |
| `switch:S1` | Prévia de B | “Com placa, a condição com NÃO fica falsa. O SENÃO ativa esta placa antes de entrar no caminho de cima.” |
| `gate:Gcima` | Após ativar em B | “A ativação abriu Gcima. Agora o movimento para cima é seguro.” |

**Erro/dica:** mover antes de ativar colide em B; ativar sempre falha A. “A placa só existe em um cenário; teste antes de agir.”

**Aceitação:** A termina com zero ativações e rota inferior; B com uma ativação válida e rota superior. Gcima está fechado no início de ambos e só abre após ativação em B.

## 20 — Duas estações, uma regra

**Objetivo/conceito:** consolidar repetir contado, leitura local, NOT e IF/ELSE com estado alterado por ativar. **Pré-requisitos:** 15–19.

**Mapa:** piso `y3:x1..2`, `y3:x4..6`, `y3:x8..10`, `y2:x2..4`, `y4:x2..4`, `y2:x6..8`, `y4:x6..8`. Início `(1,3)`, direita; portal `(10,3)`. G1c `(2,2)`, G1b `(2,4)`, G2c `(6,2)`, G2b `(6,4)`. Candidatos S1 `(2,3)`→G1c e S2 `(6,3)`→G2c. Todos os portões superiores começam fechados. Em cada estação, presença da placa implica portão inferior fechado e cristal superior; ausência implica inferior aberto e cristal inferior. Placas presentes começam desligadas. Cristais da estação 1 `(3,2)`/`(3,4)`; estação 2 `(7,2)`/`(7,4)`.

**Blocos:** paleta da 19. Nenhum operador binário nem laço até.

**Cenários:** A sem S1/sem S2; B com S1/sem S2; C sem S1/com S2; D com S1/com S2. Pela regra acima, isso fixa todos os portões e cristais sem aleatoriedade. Esperado: estação sem placa usa baixo; estação com placa ativa seu próprio portão e usa cima. Ativações esperadas A=0, B=1 em S1, C=1 em S2, D=2, uma em cada.

**Solução:** `REPETIR 2 {D; SE NÃO (estou no botão) {B; D2; C} SENÃO {ativar; C; D2; B}; D}; D`.

A primeira iteração começa `(1,3)` e termina `(5,3)`; a segunda começa `(5,3)` e termina `(9,3)`; o último D chega ao portal `(10,3)`. Cada teste ocorre exatamente na entrada da estação.

**Balões:**

| Alvo | Momento | Texto |
|---|---|---|
| `block:repeat.body` | Ao montar a rotina | “As duas estações seguem a mesma regra. Repita os passos, a pergunta e a escolha de caminho duas vezes.” |
| `switch:S2` ou `cell:(6,3)` | Segunda iteração de C | “A segunda estação pode ter uma resposta diferente. Pergunte novamente ao chegar; não reutilize a resposta anterior.” |
| `gate:G2c` | Após ativar S1 em B | “S1 abre somente G1c. Cada placa controla seu próprio portão; G2c ainda está fechado.” |

**Erro/dica:** estado global de ativação abre indevidamente todas as portas; sensor avaliado fora do laço ignora segunda estação. “Confira o id de cada vínculo e pergunte dentro da repetição.”

**Aceitação:** quatro cenários passam, sem ação inválida, coletando dois cristais. Em B, abrir G1c não abre G2c; em C, a ausência inicial de S1 não impede detectar S2. Estado de D não vaza para A ao reexecutar a bateria. Valem soluções desenroladas ou logicamente equivalentes.

## Interfaces e riscos para implementação posterior

- `SEEDS/makeLevel` hoje derivam o piso de uma única rota e possuem um único `switchTile/gateTile`; os mapas acima exigem células explícitas, cenários e listas com ids. Rotas de exemplo devem ser programadas por cenário/condição; não podem continuar sendo geradas exclusivamente de `route`.
- `currentState.activated`, `isAheadPassable`, `isOnSwitch`, `handleAction`, `atGoal`, `resetState` e conclusão/progresso precisam respeitar o cenário e os ids. Não conceder vitória da fase ao primeiro portal da bateria.
- AST, interpretação e serialização Blockly/fallback precisam da mesma expressão booleana, IF simples, IF/ELSE e NOT. Preservar carga de blocos legados sem antecipar a liberação curricular. O antigo `ifpath` consulta orientação implícita e já contém ELSE; não o apresentar assim na fase 12.
- Canvas 2D e renderizador GPU precisam mostrar os mesmos objetos/estados, ids, células e âncoras. `index.html` hoje oferece tutorial fixo e modal; balões contextualizados exigem camada posicionada e alvo semântico independente do motor gráfico.
- Mudanças de mapas podem invalidar programas salvos das antigas fases 11–20; migração/versionamento de progresso e programas deve ser definido no plano geral, sem apagar dados silenciosamente.
- Validação de planejamento realizada: replay independente dos 28 cenários confirmou rotas inteiramente no piso, ausência de travessia por portão fechado, coleta de todos os cristais e chegada aos portais. Conferência textual verificou 10 fases e 26 balões, todos até 24 palavras. Isso não valida o motor atual: a faixa não foi implementada nem testada no jogo. Na implementação, executar novamente as soluções e os casos inválidos indicados, mais verificação visual/teclado/celular dos balões.
