// Diagnostic: capture the celebration beat. Click "sim, pra sempre", skip the
// contract video ("pular"), wait for the celebrate phase, and screenshot it
// mid-rise so we can see the hearts drifting up behind the (legible) text.
const { chromium } = require("playwright");
const URL = "http://localhost:3000";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  const yes = page.getByRole("button", { name: /sim, pra sempre/i });
  await yes.waitFor({ state: "visible", timeout: 30000 });
  await yes.click();

  // Contract video plays — skip it.
  try {
    const skip = page.getByRole("button", { name: /pular/i });
    await skip.waitFor({ state: "visible", timeout: 8000 });
    await skip.click();
  } catch {
    console.log("no skip button (contract auto-advanced)");
  }

  // Wait for the celebration line, then let the hearts rise a bit.
  try {
    await page
      .getByText(/meu coração explodiu/i)
      .waitFor({ state: "visible", timeout: 12000 });
  } catch (e) {
    console.log("celebrate text not found: " + e.message);
  }
  await page.waitForTimeout(750);
  await page.screenshot({ path: `${__dirname}/celebrate.jpg`, type: "jpeg", quality: 75 });
  console.log("shot celebrate");
  await browser.close();
})();
