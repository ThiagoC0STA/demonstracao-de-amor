// Diagnostic: after passing the gate and scrolling to the timeline, report the
// reveal state of each timeline photo frame (computed clip-path + opacity) and
// whether the inner <img> actually loaded. Tells us reveal-bug vs load-failure.
const { chromium } = require("playwright");
const URL = "http://localhost:3000";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  try {
    const yes = page.getByRole("button", { name: /sim, pra sempre/i });
    await yes.waitFor({ state: "visible", timeout: 28000 });
    await yes.click();
  } catch (e) { console.log("GATE: " + e.message); }
  await page.waitForTimeout(3000);

  await page.mouse.move(720, 450);
  for (let k = 0; k < 16; k++) { await page.mouse.wheel(0, 320); await page.waitForTimeout(180); }
  await page.waitForTimeout(1500);

  const report = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].filter(i => /\/us\//.test(i.currentSrc || i.src));
    const frames = imgs.slice(0, 6).map(img => {
      let el = img;
      let clipEl = null;
      for (let d = 0; d < 6 && el; d++) { el = el.parentElement; if (el && getComputedStyle(el).clipPath !== 'none') { clipEl = el; break; } }
      const cs = clipEl ? getComputedStyle(clipEl) : null;
      const r = img.getBoundingClientRect();
      return {
        src: (img.currentSrc || img.src).split('/').pop(),
        complete: img.complete,
        naturalW: img.naturalWidth,
        imgOpacity: getComputedStyle(img).opacity,
        rectTop: Math.round(r.top), rectH: Math.round(r.height),
        clipPath: cs ? cs.clipPath : 'NO-CLIP-ANCESTOR',
        clipOpacity: cs ? cs.opacity : null,
      };
    });
    return { scrollY: Math.round(window.scrollY), count: imgs.length, frames };
  });
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})();
