# 50 fases e balões explicativos — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar 50 fases progressivas com aplicações reais dos operadores lógicos e guias semitransparentes ancorados nos objetos explicados.

**Architecture:** Extrair o catálogo para `levels.js` e o controlador de guias para `tutorial.js`, mantendo o motor e a integração dos dois editores em `game.js`. Estender o estado existente para objetos por ID e cenários determinísticos. Compartilhar dados de objetivos e condições entre execução, UI e testes; manter o interpretador sem `eval`.

**Tech Stack:** HTML, CSS, JavaScript, Blockly existente, Node.js/assert e Playwright já empregado nos testes. Sem novas dependências de produto.

**Spec:** [Especificação consolidada](../specs/2026-10-19-50-fases/README.md), incluindo as cinco fichas de dez fases ligadas nela. Ler ambas as partes antes de implementar. Este plano é proposto para revisão; nenhuma tarefa de código foi executada.

## Restrições globais

- 50 fases, dez mundos de cinco, identidade persistente `logic-01` a `logic-50`.
- Currículo: 01–05 sequências; 06–10 repetir; 11–15 booleanos/IF; 16–20 ELSE/NOT; 21–25 AND; 26–30 OR; 31–35 XOR; 36–40 NAND; 41–45 NOR/XNOR; 46–50 integração.
- Balão com fundo `rgba(16,31,48,.92)`, texto opaco de pelo menos 16 px e até 24 palavras, largura até 300 px e margem de viewport de 12 px. Alvo continua interativo.
- Dois editores e dois renderizadores suportados. Cenários e resultados lógicos idênticos em todos.
- Até 500 comandos por cenário, 100 voltas no laço até o portal e profundidade de expressão até 10.
- Progresso antigo preservado em suas chaves. Não copiar estrelas de uma fase para outra semanticamente diferente.
- A tarefa é implementar as fichas, não gerar dez mundos aleatórios ou preencher lacunas com fases repetidas sem novo objetivo.

## Foco da revisão

1. Um balão sobre canvas ou Blockly precisa continuar apontando ao alvo após redimensionamento/rolagem; testar na tarefa 5.
2. Programa que passa um cenário e é editado não pode aproveitar os resultados anteriores para concluir a fase; testar na tarefa 3.
3. NAND com duas entradas falsas e XOR com duas verdadeiras costumam ser confundidos; testar tabelas completas na tarefa 2 e aplicações na tarefa 6.
4. Mundo pedagógico 10 não pode indexar um vetor visual de quatro temas; testar ambos renderizadores na tarefa 1.
5. Armazenamento cheio ou migração parcial não pode apagar programas antigos, duplicar importação ou marcar a fase errada; testar tarefa 7.

## Ordem e limites das entregas

Executar as sete tarefas em ordem, mantendo o jogo atual utilizável até o catálogo completo entrar na tarefa 6. Cada tarefa termina com suas verificações; não liberar uma trilha parcialmente preenchida como se tivesse 50 fases. Revisar o diff por tarefa. Commits podem acompanhar cada entrega se fizerem parte do fluxo escolhido; não publicar, implantar ou modificar dados externos por este plano.

### Tarefa 1 — Dados de fases e navegação sem limites fixos

**Arquivos:** criar `levels.js`; modificar `game.js`, `gpu-renderer.js`, `index.html`, `tests/curriculo.cjs` e `tests/ui.cjs`.

**Interfaces:** `LEVEL_DEFINITIONS` e `WORLD_DEFINITIONS` globais, carregadas antes do motor; fase tem `id` e `worldId`; `makeLevel(seed,index)` normaliza rotas antigas/células explícitas e deriva `themeId` do mundo. `getWorldLevels(worldId)` retorna fases do mundo na ordem do catálogo.

- [ ] Testar IDs únicos, agrupamento por mundo e uma fixture com 50 fases/dez mundos; validar navegação 49→50, fim na 50 e rejeição de índices inválidos. Executar `npm test` e confirmar a falha correspondente.
- [ ] Extrair os dados atuais sem mudar conteúdo. Substituir limites 19/20, progresso, reinício, rótulos, navDots e contagem de mundos por dados do catálogo; não substituir cegamente números usados em arte ou coordenadas.
- [ ] Separar `worldId` e `themeId` nos dois renderizadores e música. O teste do mundo 10 deve usar `themeId=3` e desenhar sem acesso fora do vetor.
- [ ] Validar coordenadas, IDs de objetos, cristais e destino; rejeitar rotas e índices inválidos. Corrigir a declaração antiga de gema no índice do portal na fase 10, mantendo a célula anterior efetivamente usada pelo ajuste atual.
- [ ] Rodar `npm test`; rodar suíte UI com fixture de dez mundos. Restaurar catálogo de 20 fases até a tarefa 6. Não prometer progresso novo antes da tarefa 7.

### Tarefa 2 — Expressões, sensores e objetos por ID

**Arquivos:** `game.js`, `gpu-renderer.js`, `tests/curriculo.cjs`; dados e fixtures em `levels.js`.

**Interfaces:** `validateProgram(nodes,level)` lança erro em português antes da execução; `evaluateCondition(condition,state,level)` retorna booleano; `isGateOpen(id,state,level)` e `isPassable(x,y,state,level)` centralizam colisão. `resetState(scenarioId)` reconstrói o estado completo. Objetos identificados são os definidos nas fichas.

- [ ] Testar NOT para F/V e AND/OR/XOR/NAND/NOR/XNOR para FF/FV/VF/VV, com resultados exatos da especificação; testar ramo IF verdadeiro, falso com ELSE e falso sem ELSE. Confirmar testes falhando.
- [ ] Implementar condições e IF genérico no AST; preservar leitura de `ifpath`, `ifswitch` e movimentos legados. Validar IDs desconhecidos, operandos ausentes, tipos não booleanos, nós não suportados e profundidade 11 antes de qualquer movimento.
- [ ] Modelar sinais somente leitura, placas e portões por ID. Implementar efeitos/guardas declarados em cada ficha, sem ligar todos os portões por um único `activated`.
- [ ] Testar duas placas independentes, ativação fora de placa nos desafios novos, portão fechado, entradas alteradas entre cenários e condição reavaliada após movimento. Testar validação inclusive do ramo não executado.
- [ ] Renderizar IDs/rótulos/estados em WebGL e Canvas2D, reutilizando sprites; fornecer representação DOM dos sinais e estado para leitura e tutorial.
- [ ] Executar `npm test`; todas as soluções anteriores continuam passando.

### Tarefa 3 — Rodada de cenários e avaliação de comportamento

**Arquivos:** `game.js`, `index.html`, `style.css`, `tests/curriculo.cjs`, `tests/ui.cjs`.

**Interfaces:** `startScenarioRun(program,scenarioIds)` executa cópia validada da AST; `evaluateScenario(level,state,trace)` retorna `{passed,reason}`; `cancelScenarioRun()` invalida execução/resultados parciais. `trace` registra movimento, ativação e decisão suficientes para os objetivos da ficha, sem análise nominal de blocos.

- [ ] Testar mesma AST nos cenários 00/01/10/11, resultado por cenário e vitória só após quatro sucessos. Confirmar falhas antes de implementar.
- [ ] Acrescentar treino de um cenário, seletor de cenário e `TESTAR TODOS`; separar término de cenário e `finishLevel`. Preservar parada imediata no portal com todas as gemas e avaliar ali as obrigações; comandos posteriores não executam. Testar esse comportamento, inclusive a sequência longa alternativa da fase 46. Reutilizar cancelamento `serial` para impedir vitória atrasada.
- [ ] Exibir objetivos comportamentais antes da execução, estado inicial e primeiro erro. Todo cenário deve ter caminho válido quando condição falsa.
- [ ] Testar edição depois de dois sucessos, mudança de fase, reset, erro no terceiro cenário e repetição da rodada: nada concede estrelas parciais ou reutiliza estado anterior.
- [ ] Testar uma solução equivalente aceita e uma solução com operador desconectado/redundante que falha por comportamento. Não impor uso sintático quando a solução é correta.
- [ ] Executar `npm test` e os casos UI novos.

### Tarefa 4 — Blocos e editor alternativo completos

**Arquivos:** `game.js`, `tests/curriculo.cjs`, `tests/ui.cjs`.

**Interfaces:** `blocklyBlockList` e `createBlocklyBlock` convertem a AST da tarefa 2 em ambos os sentidos; fallback produz a mesma árvore. `countNodes` inclui sensores e operadores, com a mesma contagem do Blockly. `blockTypes` usa `tools` da fase.

- [ ] Testar ida/volta e execução de IF com `AND(NOT(A),B)`, ambos os ramos e laço contendo decisão; incluir todos os outros operadores na serialização. Confirmar falhas esperadas.
- [ ] Adicionar encaixes booleanos no Blockly e seleção/edição de operandos no fallback, com nomes em português e termo técnico entre parênteses. Bloquear execução de expressão incompleta com mensagem útil.
- [ ] Liberar operadores conforme currículo, mantendo definições de blocos antigos para carregar programas. Não liberar conceitos futuros apenas porque pertencem ao mesmo conjunto de toolbox.
- [ ] Testar salvar/recarregar em cada editor, contagem equivalente, exclusão/edição de operando e acesso por teclado aos controles novos. Não inventar migração automática entre formatos de editores diferentes.
- [ ] Executar `npm test` e `GAME_URL=http://localhost:8080 node tests/ui.cjs`, incluindo cenário com CDN bloqueado.

### Tarefa 5 — Tutorial ancorado e feedback das decisões

**Arquivos:** criar `tutorial.js`; modificar `game.js`, `index.html`, `style.css`, `tests/ui.cjs`, `tests/browser_smoke.py`.

**Interfaces:** `showGuide(steps,{levelId,reason})`, `closeGuide()` e `resolveGuideAnchor(target)`; este retorna um retângulo de viewport ou `null`. Etapa tem `id`, `target`, `text`, `trigger`, `advanceOn` opcional. O motor emite eventos de estado que também alimentam `decision` no painel; o tutorial não manipula o programa.

- [ ] Substituir testes antigos que exigem três modais e tutorial só na fase 1 por testes de balão ancorado, alvo clicável, navegar/voltar/pular/reabrir e disparo por ação. Confirmar falhas antes de implementar.
- [ ] Implementar aparência e posicionamento da especificação. Não usar o `<dialog>` modal existente para os guias; conservá-lo para confirmar substituição de programa, reinício e vitória.
- [ ] Implementar resolução de alvos HTML, canvas e Blockly/fallback. Testar escala do canvas, scroll, zoom do editor, bloco removido, gema coletada e carregamento lento do editor.
- [ ] Implementar roteiro inicial e os guias das fichas: texto adaptado ao editor, até três balões iniciais por conceito, PASSO/REINICIAR contextuais e painel da última decisão.
- [ ] Testar 320×568, 390×844, 667×375 e 1440×900: retângulo do balão dentro da viewport, alvo desobstruído, seta alinhada. Testar teclado, Escape, foco, toque, reduced-motion e ausência de roubo de foco por atualização automática.
- [ ] Testar saída de fase, reset, troca de cenário e abertura de modal: nenhum balão órfão ou callback antigo. Pular/voltar/reabrir mantém AST e estrelas.
- [ ] Rodar suíte UI e smoke WebGL; conferir visualmente ao menos desktop/mobile e fallback/Canvas2D.

### Tarefa 6 — Incorporar e verificar as 50 fichas

**Arquivos:** `levels.js`, `game.js`, `tests/curriculo.cjs`, `tests/ui.cjs`.

**Interfaces:** cada fase fornece mapa/cenários/objetivos e `referenceProgram` explícito. `sampleSolution()` passa a retornar cópia da solução da fase; geração por rota não resolve automaticamente lógica nova.

- [ ] Criar teste de exatamente 50 IDs únicos, cinco fases por mundo e cobertura de conceitos; confirmar falha com catálogo antigo.
- [ ] Converter as cinco fichas em dados, em ordem de pré-requisitos, sem arredondar mapas ou trocar cenários. Cada mapa deve ter validação de células, destino, gemas alcançáveis e objetos existentes. Nas fases de depuração, adicionar `starterProgram` e prévia com carregamento explícito/confirmado, sem substituir trabalho ao entrar na fase.
- [ ] Para cada fase, simular solução de referência em todos os cenários e verificar objetivos, coleta e vitória. Incluir rotas de condição falsa, XOR11, NAND00, NOR00 e XNOR00/11.
- [ ] Simular programas incorretos indicados nas fichas. Eles devem falhar pelo motivo descrito, não por célula inválida acidental ou objetivo oculto.
- [ ] Medir `countNodes(referenceProgram)` para definir orçamento de três estrelas; verificar paridade nos editores e impedir premiar blocos desconectados como aprendizado.
- [ ] Conferir que conteúdo de introdução tem alvo disponível e no máximo 24 palavras por texto de balão. Verificar que o bloco novo está liberado antes de pedir uso.
- [ ] Executar `npm test` para todos os cenários; fazer smoke UI nas fases 1,11,16,21,26,31,36,41,44,46,50 nos dois editores.

### Tarefa 7 — Progresso, documentos e regressão final

**Arquivos:** `game.js`, `tests/curriculo.cjs`, `tests/ui.cjs`, `README.md`, `docs/GUIA-EDUCADOR.md`, `package.json`; revisar `test.html` e seus consumidores.

**Interfaces:** `migrateLegacyProgress(storage)` implementa as chaves e o mapeamento da especificação, idempotentemente; as fases usam IDs estáveis para programa, progresso e guias.

- [ ] Testar armazenamento vazio, legado completo, v2 parcial e misto, JSON inválido, erro de escrita e migração repetida. Confirmar falhas antes de implementar.
- [ ] Importar somente fases equivalentes 01–08 e 10 após conferir seus mapas/semântica; manter chaves antigas intactas. Sem transação em localStorage: gravar registros novos sem sobrescrever existentes, reler, só então marcar migração.
- [ ] Atualizar reinício confirmado, sem tocar chaves externas ou preferência de áudio; testar que reset não reimporta legado depois do reload. Atualizar avisos para explicar mudanças de currículo e limitações de salvamento.
- [ ] Atualizar README e guia com dez mundos, 50 fases, operadores, cenários e balões. Ajustar descrição do pacote e entradas HTML de teste mantidas; não mudar número de versão/release sem necessidade deste trabalho.
- [ ] Rodar `npm test`, suíte UI e smoke dos renderizadores. Validar migração, fase50 e fim da jornada em navegador.
- [ ] Revisar diff e relatar mudanças, evidência de testes e limitações. Capturas novas apenas após a UI real existir; nenhuma afirmação de validação com crianças sem sessão realizada.

## Revisão do plano

Cobertura: as fichas têm responsáveis exclusivos para cada dez fases; este plano cobre motor, dados, dois editores, dois renderizadores, balões, cenário, persistência e documentação. A implementação depende da revisão desta especificação consolidada. Os cinco agentes solicitados participam do planejamento, não constituem autorização automática para cinco implementações conflitantes no mesmo `game.js`.
