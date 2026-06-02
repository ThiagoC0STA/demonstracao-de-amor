// Throwaway visual-diagnosis script. Launches Playwright's own Chromium,
// walks through the intro gate, and screenshots while scrolling with REAL
// wheel events (so Lenis smooth-scroll drives the reveals correctly).
const { chromium } = require("playwright");

const OUT = __dirname;
const URL = process.env.SHOT_URL || "http://localhost:3000";

const shot = async (page, name) => {
  try {
    await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 70, timeout: 15000 });
    console.log("shot " + name);
  } catch (e) {
    console.log("shot FAILED " + name + ": " + e.message);
  }
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await shot(page, "00-intro");

  try {
    const yes = page.getByRole("button", { name: /sim, pra sempre/i });
    await yes.waitFor({ state: "visible", timeout: 28000 });
    await shot(page, "01-question");
    await yes.click();
  } catch (e) {
    console.log("GATE: " + e.message);
  }
  await page.waitForTimeout(4500);

  // Put the pointer over the page so wheel events target the scroll container,
  // then walk down with real wheel deltas (Lenis-friendly), shooting as we go.
  await page.mouse.move(720, 450);
  await shot(page, "02-top");

  const labels = ["03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];
  for (const lbl of labels) {
    for (let k = 0; k < 5; k++) {
      await page.mouse.wheel(0, 320);
      await page.waitForTimeout(220);
    }
    await page.waitForTimeout(700);
    await shot(page, lbl + "-scroll");
    const atBottom = await page.evaluate(() => Math.ceil(window.scrollY + window.innerHeight) >= document.body.scrollHeight - 4);
    if (atBottom) { console.log("reached bottom at " + lbl); break; }
  }

  console.log("SCROLL_HEIGHT=" + (await page.evaluate(() => document.body.scrollHeight)));
  console.log("ERRORS=" + JSON.stringify(errors.slice(0, 20)));
  await browser.close();
})();
