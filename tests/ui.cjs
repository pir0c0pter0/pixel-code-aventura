// Optional integration checks: Playwright + Chromium and the local server are required.
// Run: node tests/ui.cjs (GAME_URL overrides http://127.0.0.1:8081).
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.GAME_URL || 'http://127.0.0.1:8081';

async function modalCoversEditor(page) {
  assert.equal(await page.evaluate(() => {
    for (let y = 10; y < innerHeight; y += 40) {
      for (let x = 10; x < innerWidth; x += 40) {
        if (!document.elementFromPoint(x, y)?.closest('#modal')) return false;
      }
    }
    return true;
  }), true, 'Blockly and background controls must stay behind the modal');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    // Native dialogs may give focus to browser chrome, represented by body.
    assert.equal(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('#modal')), true,
      'Tab must not reach background controls');
  }
}

async function example(page) {
  await page.locator('#solutionBtn').click();
  await modalCoversEditor(page);
  await page.locator('#modalActions .primary').click();
  await page.waitForFunction(() => countBlocks() > 0);
}

async function restartAdventure(page) {
  await page.evaluate(() => {
    localStorage.setItem('pc-progress', JSON.stringify({0:3,1:2}));
    for (let i = 0; i < 20; i++) localStorage.setItem(`pc-code-${i}`, JSON.stringify({engine:'fallback',data:[{kind:'move_right'}]}));
    localStorage.setItem('pc-music', 'off');
    localStorage.setItem('unrelated', 'keep');
  });
  await page.reload();
  await page.waitForFunction(() => blocklyEditorSetup || blocklyFailed);
  await page.locator('#playBtn').click();
  await page.evaluate(() => { setSolution(); saveWorkspace(); });
  await page.locator('#homeBtn').click();
  const saved = await page.evaluate(() => ({...localStorage}));
  const restart = page.getByRole('button', {name:'RECOMEÇAR AVENTURA',exact:true});
  assert.equal(await restart.count(), 1, 'Menu must offer a fresh start');
  await restart.click();
  assert.match(await page.locator('#modalText').innerText(), /apagar.*estrelas.*programas/i);
  await page.getByRole('button', {name:'CANCELAR',exact:true}).click();
  assert.deepEqual(await page.evaluate(() => ({...localStorage})), saved, 'Cancelling keeps all progress');
  await restart.click();
  await page.getByRole('button', {name:'APAGAR E RECOMEÇAR',exact:true}).click();
  assert.match(await page.locator('#levelTitle').innerText(), /^01/);
  assert.match(await page.locator('#modalEyebrow').innerText(), /1 DE 3/);
  assert.equal(await page.evaluate(() => countBlocks()), 0, 'New adventure starts with an empty editor');
  assert.equal(await page.evaluate(() => highestUnlocked()), 0);
  assert.equal(await page.locator('#headStars').innerText(), '☆☆☆');
  assert.match(await page.locator('#progressLabel').innerText(), /0\/20/);
  assert.deepEqual(await page.evaluate(() => ({...localStorage})), {'pc-music':'off',unrelated:'keep'});
  await page.reload();
  assert.match(await page.locator('#playBtnText').innerText(), /COMEÇAR AVENTURA/);
  assert.equal(await page.evaluate(() => highestUnlocked()), 0, 'Reset survives reloading');
}

(async () => {
  const browser = await chromium.launch({headless:true});
  let failures = 0;
  const tests = {
    'restart confirms deletion and resets the saved adventure': restartAdventure,
    'offline restart confirms deletion and resets the saved adventure': restartAdventure,
    async 'menu characters never cover text or buttons on small screens'(page) {
      await page.evaluate(() => document.fonts.ready);
      for (const width of [320,390,600,667,847,1050]) {
        await page.setViewportSize({width,height:801});
        assert.equal(await page.evaluate(() => {
          const sprites = [...document.querySelectorAll('.sprite-menu')].map(el => el.getBoundingClientRect());
          return [...document.querySelectorAll('.hero-content button,.hero-content p,.features span')].every(el => {
            const r = el.getBoundingClientRect();
            return sprites.every(s => r.right <= s.left || r.left >= s.right || r.bottom <= s.top || r.top >= s.bottom);
          });
        }), true, `Characters must not overlap menu content at ${width}px`);
        assert.equal(await page.locator('.hero-logo').evaluate(el => el.scrollWidth <= el.clientWidth), true,
          `Logo must fit without being clipped at ${width}px`);
      }
    },
    async 'modals cover Blockly, trap focus and fit short screens'(page) {
      await page.locator('#playBtn').click();
      await page.keyboard.press('Escape');
      for (const trigger of ['#hintBtn', '#helpBtn', '#solutionBtn']) {
        await page.locator(trigger).click();
        await modalCoversEditor(page);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#modal').isVisible(), false);
        assert.equal(await page.locator(trigger).evaluate(el => el === document.activeElement), true);
      }
      await page.setViewportSize({width:667,height:375});
      await page.locator('#helpBtn').click();
      const card = await page.locator('.modal-card').boundingBox();
      assert.ok(card.y >= 0 && card.y + card.height <= 375, 'Short screens must fit a scrollable dialog');
      await page.locator('#modalActions button').click();
      assert.equal(await page.locator('#modal').isVisible(), false);
    },
    async 'first level opens step-by-step popups and keeps the guide available'(page) {
      await page.locator('#playBtn').click();
      assert.equal(await page.locator('#modal').isVisible(), true, 'Starting level one opens the tutorial');
      assert.match(await page.locator('#modalEyebrow').innerText(), /1 DE 3/);
      assert.match(await page.locator('#modalText').innerText(), /portal/);
      await modalCoversEditor(page);
      await page.locator('#modalActions .primary').click();
      assert.match(await page.locator('#modalEyebrow').innerText(), /2 DE 3/);
      assert.match(await page.locator('#modalText').innerText(), /Arraste três blocos/);
      await page.getByRole('button', {name:'VOLTAR',exact:true}).click();
      assert.match(await page.locator('#modalEyebrow').innerText(), /1 DE 3/);
      await page.locator('#modalActions .primary').click();
      await page.locator('#modalActions .primary').click();
      assert.match(await page.locator('#modalEyebrow').innerText(), /3 DE 3/);
      assert.match(await page.locator('#modalText').innerText(), /EXECUTAR.*PASSO.*REINICIAR/);
      await page.getByRole('button', {name:'COMEÇAR A JOGAR'}).click();
      assert.equal(await page.locator('#modal').isVisible(), false);
      const tutorial = page.locator('#firstLevelTutorial');
      assert.equal(await tutorial.isVisible(), true, 'First level must show the tutorial');
      assert.equal(await tutorial.getAttribute('open'), null);
      assert.equal(await tutorial.locator('li').count(), 3);
      await tutorial.locator('summary').click();
      const tutorialBox = await tutorial.boundingBox();
      const gameBox = await page.locator('.game-grid').boundingBox();
      assert.ok(tutorialBox.y + tutorialBox.height <= gameBox.y, 'Tutorial must not cover the game');
      await tutorial.locator('summary').click();
      await example(page);
      await page.locator('#runBtn').click();
      await page.waitForFunction(() => document.querySelector('#modalTitle').textContent === 'Missão cumprida!' && !document.querySelector('#modal').classList.contains('hidden'));
      await modalCoversEditor(page);
      assert.equal(await page.locator('#headStars').innerText(), '★★★');
      await page.locator('#modalActions .primary').click();
      assert.match(await page.locator('#levelTitle').innerText(), /^02/);
      assert.equal(await page.locator('#modal').isVisible(), false, 'Other levels do not open the tutorial');
      assert.equal(await tutorial.isVisible(), false, 'Tutorial is limited to level one');
      await page.locator('#prevBtn').click();
      assert.match(await page.locator('#modalEyebrow').innerText(), /1 DE 3/);
      await page.getByRole('button', {name:'PULAR TUTORIAL'}).click();
      assert.equal(await page.locator('#modal').isVisible(), false);
      assert.equal(await tutorial.isVisible(), true);
      assert.equal(await tutorial.getAttribute('open'), null, 'Completed first level keeps instructions collapsed');
    },
    async 'mobile layouts and offline tutorial remain usable'(page) {
      for (const width of [320,390,847]) {
        await page.setViewportSize({width,height:801});
        for (const view of ['home','world','game']) {
          await page.evaluate(view => view === 'game' ? loadLevel(0) : showView(view), view);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true,
            `${view} must not scroll sideways at ${width}px`);
        }
        await modalCoversEditor(page);
        await page.locator('#modalActions .primary').click();
        assert.match(await page.locator('#modalText').innerText(), /Toque em “Direita” três vezes/);
        await page.keyboard.press('Escape');
        await page.locator('#helpBtn').click();
        await modalCoversEditor(page);
        await page.locator('#modalActions button').click();
      }
      assert.match(await page.locator('#tutorialBlocks').textContent(), /toque/i);
      for (let i = 0; i < 3; i++) await page.locator('#fallbackPalette button').first().click();
      await page.locator('#runBtn').click();
      await page.waitForFunction(() => currentState.finished);
      assert.equal(await page.locator('#headStars').innerText(), '★★★');
    },
    async 'leaving a finished level cancels its pending victory dialog'(page) {
      await page.locator('#playBtn').click();
      await page.keyboard.press('Escape');
      await page.evaluate(() => setSolution());
      await page.evaluate(() => { stepProgram(); stepProgram(); stepProgram(); $('gameBack').click(); });
      await page.waitForTimeout(500);
      assert.equal(await page.locator('#worldView').isVisible(), true);
      assert.equal(await page.locator('#modal').isVisible(), false, 'Stale victory must not cover another screen');
    }
  };
  for (const [name, test] of Object.entries(tests)) {
    const page = await browser.newPage({viewport:{width:1440,height:900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const offline = name.includes('offline');
    if (offline) await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
    try {
      await page.goto(url);
      await page.waitForFunction(offline ? () => blocklyFailed : () => blocklyEditorSetup);
      await test(page);
      assert.deepEqual(errors, [], 'No browser exceptions');
      console.log('PASS:', name);
    } catch (error) {
      failures++;
      console.error('FAIL:', name, error.message);
    } finally { await page.close(); }
  }
  await browser.close();
  process.exitCode = failures ? 1 : 0;
})();
