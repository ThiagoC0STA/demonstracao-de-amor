// Throwaway visual-diagnosis script. Launches Playwright's own Chromium,
// walks through the intro gate, and screenshots the whole page while scrolling.
// Not committed; lives under .shots/ which is gitignored ad hoc.
const { chromium } = require("playwright");

const OUT = __dirname;
const URL = process.env.SHOT_URL || "http://localhost:3000";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/00-intro.jpg`, type: "jpeg", quality: 72 });

  // Intro gate: 3 buildup lines auto-advance, then the question + Yes button.
  try {
    const yes = page.getByRole("button", { name: /sim, pra sempre/i });
    await yes.waitFor({ state: "visible", timeout: 28000 });
    await page.screenshot({ path: `${OUT}/01-question.jpg`, type: "jpeg", quality: 72 });
    await yes.click();
  } catch (e) {
    console.log("GATE: yes button not reached: " + e.message);
  }

  await page.waitForTimeout(4500); // let the dissolve finish
  await page.screenshot({ path: `${OUT}/02-top.jpg`, type: "jpeg", quality: 72 });

  // Walk the full page in ~10 steps using wheel events (works with Lenis).
  const total = await page.evaluate(() => document.body.scrollHeight);
  const steps = 10;
  const step = Math.ceil(total / steps);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(1100);
    const n = String(i + 3).padStart(2, "0");
    await page.screenshot({ path: `${OUT}/${n}-scroll.jpg`, type: "jpeg", quality: 72 });
  }

  console.log("SCROLL_HEIGHT=" + total);
  console.log("CONSOLE_ERRORS=" + JSON.stringify(errors.slice(0, 30)));
  await browser.close();
})();
