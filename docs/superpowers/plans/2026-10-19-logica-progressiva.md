# Lógica progressiva — plano de implementação

> **Substituído pelo pedido de 50 fases:** usar a [especificação de 50 fases e balões](../specs/2026-10-19-50-fases/README.md) e o [novo plano](2026-10-19-50-fases-e-baloes.md). Este arquivo preserva a proposta anterior; suas restrições de 20 fases e explicações em modal não se aplicam à nova entrega.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensinar lógica nos desafios, começando pelo básico e explicando ao jogador o que cada condição, operador e decisão faz.

**Architecture:** Aproveitar as 20 fases, o painel de lição, os diálogos de ajuda e os dois editores existentes. Acrescentar condições combináveis à árvore de comandos interpretada em `game.js`, com a mesma avaliação no Blockly e no editor de cliques. Manter os identificadores dos blocos antigos e os dados de progresso.

**Tech Stack:** JavaScript, HTML, CSS, Blockly existente, Node.js/assert e suíte de interface Playwright existente. Sem novas dependências de aplicação.

**Spec:** Requisitos do usuário nesta conversa: “nos desafios incluir lógica, AND NAND XOR IF ELSE etc.”, “começa simples e vai melhorando” e “precisa explicar pro usuário o que cada uma faz”. O desenho proposto está detalhado abaixo; implementação ainda não iniciada.

## Restrições

- Português simples, adequado ao público de 6 a 12 anos descrito no README.
- Exibir primeiro o nome em português e depois o termo: `E (AND)`, `SE (IF)`.
- Operadores produzem verdadeiro/falso; SE/SENÃO escolhem quais ações executar. Explicar essa diferença.
- Manter as 20 fases e seus índices; preservar estrelas e programas salvos. Não apagar armazenamento para atualizar o currículo.
- Nas fases 11–20, preservar rotas e ações legadas válidas; acrescentar ensino e soluções com os novos conceitos.
- Toda explicação deve funcionar por toque e teclado, sem depender de passar o mouse ou distinguir cores.
- Condições devem usar estados reais do jogo, sem introduzir chaves ou sensores que não existem no mapa.
- Não usar `eval`, nem remover limites de execução. Reutilizar o fluxo de modais e foco existente.

## Progressão proposta

Cada fase nova de lógica segue: explicação curta → exemplo resolvido → tentativa do jogador. Os blocos são liberados progressivamente, mantendo disponíveis os conceitos anteriores.

| Fase | Conceito | Explicação apresentada ao jogador |
| --- | --- | --- |
| 1–5 | Sequências | Lumi segue os comandos de cima para baixo. A ordem muda o resultado. |
| 6–10 | Repetições | Repetir faz os comandos de dentro acontecerem várias vezes. |
| 11 | Verdadeiro/falso e SE (IF) | Uma condição é uma pergunta com resposta sim ou não. SE a resposta for sim, Lumi executa os comandos de dentro. Se for não, pula esses comandos. |
| 12 | SENÃO (ELSE) | SENÃO é o outro caminho da decisão. Lumi faz o que está no SE quando a condição é verdadeira; caso contrário, faz o que está no SENÃO. |
| 13 | NÃO (NOT) | Inverte a resposta: verdadeiro vira falso e falso vira verdadeiro. |
| 14 | E (AND) | O resultado só é verdadeiro quando as duas condições são verdadeiras. |
| 15 | OU (OR) | O resultado é verdadeiro quando pelo menos uma condição é verdadeira. As duas verdadeiras também valem. |
| 16 | OU EXCLUSIVO (XOR) | O resultado é verdadeiro quando exatamente uma condição é verdadeira. Se as duas forem verdadeiras, o resultado é falso. |
| 17 | NÃO E (NAND) | É o contrário de AND. O resultado só é falso quando as duas condições são verdadeiras. |
| 18 | Praticar e comparar | Comparar AND, OR, XOR e NAND nas mesmas combinações, sem introduzir outro operador. |
| 19 | Combinar decisões e repetição | Reavaliar as condições a cada volta de uma repetição, conforme Lumi se move. Apresentar também o bloco existente “repetir até chegar”. |
| 20 | Desafio final | Combinar conceitos já apresentados e explicar as escolhas passo a passo. |

NOR e XNOR ficam fora desta primeira entrega para reservar espaço à prática dos conceitos pedidos.

## Como ensinar dentro do jogo

- O painel da fase mostra seu conceito específico, em vez de apenas o tema do mundo.
- Um botão `ENTENDER A LÓGICA` reabre a explicação e um exemplo a qualquer momento, sem substituir o programa.
- Na primeira apresentação do conceito, abrir a explicação com uma ação clara para começar a prática. Reutilizar o diálogo existente.
- Exemplo de AND no contexto real: “Estou no botão E o portão ainda está fechado. As duas respostas precisam ser sim para executar ATIVAR.”
- Exemplo de decisão: “SE estou no botão, ATIVAR; SENÃO, seguir o caminho indicado na fase.” Mostrar ações concretas e seguras para a rota dessa fase.
- Para operadores de duas entradas, incluir quatro exemplos de verdadeiro/falso. Identificar A e B como as duas perguntas; nunca exigir que a criança saiba álgebra.
- O feedback da execução mostra as perguntas, as respostas e o ramo escolhido: “Estou no botão: sim. Portão aberto: não. AND: falso. Lumi seguirá o SENÃO.”
- Separar explicação, dica e solução: entender não revela a rota inteira; carregar solução continua pedindo confirmação antes de substituir os blocos.
- A solução de exemplo de cada fase 11–20 deve usar o conceito ensinado, com pelo menos uma decisão que altere as ações executadas. Não inserir operadores sem efeito apenas para exibi-los.

Tabela de referência para conteúdo e testes:

| A | B | AND | OR | XOR | NAND |
| --- | --- | --- | --- | --- | --- |
| falso | falso | falso | falso | falso | verdadeiro |
| falso | verdadeiro | falso | verdadeiro | verdadeiro | verdadeiro |
| verdadeiro | falso | falso | verdadeiro | verdadeiro | verdadeiro |
| verdadeiro | verdadeiro | verdadeiro | verdadeiro | falso | falso |

## Pontos de revisão

1. Programas antigos: os blocos e as condições legadas continuam funcionando, inclusive após salvar e reabrir.
2. Blockly indisponível: todas as condições novas podem ser montadas e explicadas no editor de cliques.
3. Expressões incompletas ou inválidas: erro compreensível antes de mover Lumi, sem interpretar entrada ausente como falso silenciosamente.
4. Estado que muda: condições são avaliadas no momento da decisão, não ao carregar a fase; direção de “caminho livre” fica explícita.
5. Dificuldade e pontuação: contar expressões de modo equivalente nos dois editores e recalibrar os limites de estrelas das soluções novas.

## Tarefa 1 — Condições e decisões no interpretador

**Arquivos:** `game.js`, `tests/curriculo.cjs`.

**Interfaces:**
- `evaluateCondition(condition)` retorna booleano usando `currentState` e `LEVELS[currentLevel]`.
- Condições simples: `{kind:'path'}`, `{kind:'switch'}`, `{kind:'activated'}`, `{kind:'allgems'}`. Reutilizar `isAheadPassable()` e `isOnSwitch()`; consultar `activated` e `crystals.size` para as outras duas.
- Negação: `{kind:'not',operand:Condition}`. Operadores binários: `{kind:'and'|'or'|'xor'|'nand',left:Condition,right:Condition}`.
- Decisão: `{kind:'if',condition:Condition,children:Node[],elseChildren:Node[]}`. Lista SENÃO vazia representa um SE simples.
- Preservar a interpretação dos nós existentes `ifpath` e `ifswitch`.

- [ ] Acrescentar testes de tabela-verdade para todas as quatro combinações de cada operador, os dois resultados de NOT e ambos os ramos de IF/ELSE; executar `npm test` e confirmar a falha causada pelas funcionalidades ausentes.
- [ ] Implementar a avaliação e integrar o novo nó ao `executeTree`, sem alterar a semântica dos comandos existentes.
- [ ] Validar estruturas e operadores, incluindo expressões ausentes e profundamente aninhadas; adotar profundidade máxima de 10 e mensagem de erro em português, coerente com o editor alternativo.
- [ ] Testar reavaliação após movimento/ativação, condições aninhadas, entrada inválida e continuidade das soluções legadas.
- [ ] Atualizar `countNodes` para contar cada nó de condição, alinhado à contagem de blocos do Blockly; testar uma expressão aninhada nos dois formatos.
- [ ] Executar `npm test`; todas as verificações novas e as 20 soluções existentes devem passar.

## Tarefa 2 — Construção nos dois editores e persistência

**Arquivos:** `game.js`, `tests/ui.cjs`, `tests/curriculo.cjs`.

**Interfaces:** os dois editores produzem a mesma AST da tarefa 1. Blockly usa entradas booleanas para as condições; o editor alternativo oferece seletores e controles para montar os mesmos operandos.

- [ ] Acrescentar testes de montagem de um AND dentro de IF/ELSE, edição dos operandos, execução e reabertura do programa salvo, tanto com Blockly quanto com o CDN bloqueado. Confirmar falha antes da implementação.
- [ ] Atualizar `BLOCK_DEFS`, `blockTypes`, `blocklyBlockList`, `createBlocklyBlock` e as funções de renderização/edição do fallback. Liberar os novos blocos por fase conforme a tabela.
- [ ] Manter definições antigas e o formato de armazenamento por editor; validar expressões carregadas antes da execução. Não prometer conversão automática entre programas Blockly e fallback, que o projeto atualmente não oferece.
- [ ] Testar expressões incompletas, mensagens acessíveis e programas legados salvos. Confirmar contagem equivalente e ausência de alterações no progresso.
- [ ] Executar `npm test` e, com servidor local e Playwright disponíveis, `GAME_URL=http://localhost:8080 node tests/ui.cjs`.

## Tarefa 3 — Explicações, exemplos e prática progressiva

**Arquivos:** `game.js`, `index.html`, `style.css`, `tests/curriculo.cjs`, `tests/ui.cjs`.

**Interfaces:** acrescentar aos dados de cada fase `concept`, `explanation` e `example`; usar `intro` e `hint` existentes para objetivo e dica. O painel e o diálogo consomem esses dados. `sampleSolution()` continua retornando uma AST executável, com exemplos específicos para as fases de lógica.

- [ ] Acrescentar testes para o conceito e a explicação de cada fase 11–20, abertura/reabertura da ajuda sem alteração do programa, e liberação gradual dos operadores; confirmar falhas antes de implementar.
- [ ] Escrever as explicações segundo a tabela, com uma pergunta real do mapa por exemplo. Usar frases curtas e explicitar OR versus XOR e AND versus NAND.
- [ ] Adicionar o botão de explicação ao painel existente, reutilizar o modal com foco e teclado e apresentar o resultado das decisões no feedback. Durante execução contínua, manter esse resultado consultável; não deixá-lo apenas em uma mensagem substituída imediatamente pelo próximo passo.
- [ ] Atualizar os exemplos das fases 11–20 para empregar os conceitos previstos. Manter os mapas e verificar se todos os exemplos chegam ao portal; recalibrar `limit` pelo tamanho real de cada solução.
- [ ] Testar verdadeiro e falso de cada condição usada nos exemplos em estados controlados, incluindo XOR com duas entradas verdadeiras e NAND com duas falsas. Verificar que as ações executadas mudam conforme o resultado.
- [ ] Verificar manualmente leitura em tela pequena, toque, teclado e execução passo a passo, nos dois editores.
- [ ] Executar `npm test` e a suíte de interface. As 20 fases devem continuar solucionáveis, e os exemplos novos devem conquistar três estrelas.

## Tarefa 4 — Documentação e revisão final

**Arquivos:** `README.md`, `docs/GUIA-EDUCADOR.md`.

- [ ] Atualizar currículo, instruções da ajuda e conceitos disponíveis, refletindo o que foi efetivamente implementado.
- [ ] Incluir no guia perguntas como “Por que OR aceita duas respostas sim e XOR não?” e “Quando NAND dá falso?”.
- [ ] Revisar a linguagem das explicações contra as tabelas-verdade e conferir que nenhum conceito aparece em um desafio antes de ser ensinado.
- [ ] Conferir o diff e os resultados das verificações; registrar limitações reais. Não afirmar validação pedagógica com crianças sem realizá-la.

## Limites e critérios de conclusão

Concluído quando os conceitos pedidos estiverem explicados e utilizáveis nos dois editores, as soluções demonstrarem seus efeitos, os testes cobrirem seus resultados e todas as fases continuarem jogáveis com o progresso preservado. Esta entrega não comprova domínio do aluno apenas por ele chegar ao portal: programas de movimento continuam válidos por compatibilidade. Avaliação obrigatória por múltiplos cenários e novos mundos exigem uma etapa posterior.

Este arquivo contém somente o planejamento. Nenhuma mudança no jogo foi realizada nesta etapa.
