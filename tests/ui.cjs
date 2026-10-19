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

(async () => {
  const browser = await chromium.launch({headless:true});
  let failures = 0;
  const tests = {
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
    async 'first level teaches the controls without covering the game'(page) {
      await page.locator('#playBtn').click();
      const tutorial = page.locator('#firstLevelTutorial');
      assert.equal(await tutorial.isVisible(), true, 'First level must show the tutorial');
      assert.equal(await tutorial.getAttribute('open'), '');
      assert.equal(await tutorial.locator('li').count(), 3);
      const tutorialBox = await tutorial.boundingBox();
      const gameBox = await page.locator('.game-grid').boundingBox();
      assert.ok(tutorialBox.y + tutorialBox.height <= gameBox.y, 'Tutorial must not cover the game');
      await tutorial.locator('summary').click();
      await tutorial.locator('summary').click();
      await example(page);
      await page.locator('#runBtn').click();
      await page.waitForFunction(() => document.querySelector('#modalTitle').textContent === 'Missão cumprida!' && !document.querySelector('#modal').classList.contains('hidden'));
      await modalCoversEditor(page);
      assert.equal(await page.locator('#headStars').innerText(), '★★★');
      await page.locator('#modalActions .primary').click();
      assert.match(await page.locator('#levelTitle').innerText(), /^02/);
      assert.equal(await tutorial.isVisible(), false, 'Tutorial is limited to level one');
      await page.locator('#prevBtn').click();
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
        await page.locator('#helpBtn').click();
        await modalCoversEditor(page);
        await page.locator('#modalActions button').click();
      }
      assert.match(await page.locator('#tutorialBlocks').innerText(), /toque/i);
      for (let i = 0; i < 3; i++) await page.locator('#fallbackPalette button').first().click();
      await page.locator('#runBtn').click();
      await page.waitForFunction(() => currentState.finished);
      assert.equal(await page.locator('#headStars').innerText(), '★★★');
    },
    async 'leaving a finished level cancels its pending victory dialog'(page) {
      await page.locator('#playBtn').click();
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
