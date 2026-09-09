// Focused regression check against an already running development server.
const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1586, height: 992 }, reducedMotion: 'reduce' });
    await page.goto(process.env.VOICE_CHECK_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const track = page.locator('#voices .figma-voices-grid');
    await track.focus();
    for (let i = 0; i < 20; i++) {
      const sizes = await track.evaluate(el => [...el.querySelectorAll('.figma-voice-card:not([hidden])')].map(card => {
        const box = card.getBoundingClientRect();
        const body = card.querySelector('.figma-voice-body');
        return { name: card.dataset.voiceName, active: card.classList.contains('is-active'), height: box.height, width: box.width, rawHeight: body.offsetHeight };
      }));
      const active = sizes.filter(card => card.active);
      assert.equal(active.length, 1, 'Exactly one selected card');
      for (const card of sizes) {
        assert.ok(Math.abs(card.rawHeight - active[0].rawHeight) <= 1, `${card.name}: copy must not stretch individual cards`);
        if (!card.active) assert.ok(card.height < active[0].height && card.width < active[0].width, `${card.name}: only the central card may be largest`);
      }
      await page.keyboard.press('ArrowRight');
    }
    console.log('PASS: all 20 selections keep equal card bodies and the central card largest');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
