// Diagnostic: verify the intro (cosmic) renders, and that the "No" button flees
// on hover. Screenshots the name beat, the question, and the button before/after
// two hovers; logs the button's transform so we can confirm it actually moved.
const { chromium } = require("playwright");
const URL = "http://localhost:3000";

const shot = async (page, name) => {
  await page.screenshot({ path: `${__dirname}/${name}.jpg`, type: "jpeg", quality: 72 });
  console.log("shot " + name);
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  await page.waitForTimeout(1400);
  await shot(page, "intro-name");

  const yes = page.getByRole("button", { name: /sim, pra sempre/i });
  await yes.waitFor({ state: "visible", timeout: 30000 });
  await shot(page, "intro-question");

  const no = page.getByRole("button", { name: /deixa eu pensar/i });
  const before = await no.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.move(720, 450);
  await no.hover().catch(() => {});
  await page.waitForTimeout(500);
  const after1 = await no.evaluate((el) => getComputedStyle(el).transform);
  await shot(page, "dodge-1");
  // chase it: hover wherever it is now
  const box = await no.boundingBox();
  if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(500);
  const after2 = await no.evaluate((el) => getComputedStyle(el).transform);
  await shot(page, "dodge-2");

  console.log("NO transform before: " + before);
  console.log("NO transform after hover 1: " + after1);
  console.log("NO transform after hover 2: " + after2);
  console.log("MOVED: " + (before !== after1));
  await browser.close();
})();
