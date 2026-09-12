import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.APP_URL ?? "http://localhost:3104";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });

  await page.type("input[placeholder='Seu apelido']", "Visual QA");
  await page.evaluate(() => {
    document
      .evaluate("//button[contains(., 'Entrar no Cassino')]", document, null, 9, null)
      .singleNodeValue?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await sleep(1200);
  await page.screenshot({ path: "C:/Users/joaop/AppData/Local/Temp/opencode/casino-lobby.png", fullPage: false });

  await page.evaluate(() => {
    document
      .evaluate("//button[contains(., 'Jogar roleta')]", document, null, 9, null)
      .singleNodeValue?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await sleep(1000);
  await page.screenshot({ path: "C:/Users/joaop/AppData/Local/Temp/opencode/casino-roulette.png" });

  const rouletteDom = await page.evaluate(() => ({
    ball: !!document.querySelector(".wheel-ball-dot"),
    parrotCenter: document.querySelector(".wheel-center")?.textContent?.trim(),
    markers: !!document.querySelector(".wheel-marker"),
  }));
  console.log("ROULETTE DOM:", JSON.stringify(rouletteDom, null, 2));

  // place a bet and screenshot with chips
  await page.evaluate(() => {
    document
      .evaluate("//button[contains(., 'Vermelho')]", document, null, 9, null)
      .singleNodeValue?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await sleep(400);
  await page.screenshot({ path: "C:/Users/joaop/AppData/Local/Temp/opencode/casino-roulette-bet.png" });

  await page.evaluate(() => {
    document
      .evaluate("//button[contains(., '🎡 Girar')]", document, null, 9, null)
      .singleNodeValue?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await sleep(2500);
  await page.screenshot({ path: "C:/Users/joaop/AppData/Local/Temp/opencode/casino-roulette-spinning.png" });
  await sleep(8200);
  const ballLanded = await page.evaluate(() => !!document.querySelector(".wheel-ball"));
  console.log("BALL PRESENT AFTER SPIN:", ballLanded);
  await page.screenshot({ path: "C:/Users/joaop/AppData/Local/Temp/opencode/casino-roulette-result.png" });

  await browser.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});