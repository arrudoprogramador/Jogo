import puppeteer, { type Page } from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.APP_URL ?? "http://localhost:3104";

let failures = 0;
function check(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error(`✖ ${msg}`);
  } else {
    console.log(`✓ ${msg}`);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function clickByText(page: Page, text: string) {
  const ok = await page.evaluate((t: string) => {
    const el = document.evaluate(
      `//button[contains(., '${t}')] | //div[contains(@class,'game-card') and contains(., '${t}')]`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement | null;
    if (!el) return false;
    el.click();
    return true;
  }, text);
  if (!ok) throw new Error(`botão com texto "${text}" não encontrado`);
}

async function waitText(page: Page, text: string, timeout = 12000) {
  await page.waitForFunction(
    (t: string) =>
      !!document.evaluate(
        `//*[contains(normalize-space(.), '${t}')]`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue,
    { timeout },
    text,
  );
}

async function readBalance(page: Page): Promise<number> {
  const v = await page.$eval(".balance-pill", (el) => el.getAttribute("data-balance"));
  return Number(v ?? "0");
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  const consoleErrors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });

  // ---- Login ----
  check(!!(await page.$("input[placeholder='Seu apelido']")), "tela de login visível");
  await page.type("input[placeholder='Seu apelido']", "Teste E2E");
  await clickByText(page, "Entrar no Cassino");
  await waitText(page, "Jogos");

  // ---- Lobby ----
  let balance = await readBalance(page);
  check(balance === 1000, `saldo inicial 1.000 (visto: ${balance})`);
  check(
    (await page.evaluate(() => document.body.innerText.includes("Jogar roleta"))) === true,
    "card roleta presente",
  );
  check(
    (await page.evaluate(() => document.body.innerText.includes("Jogar caça-níqueis"))) === true,
    "card slots presente",
  );

  // ---- Daily bonus ----
  await clickByText(page, "Bônus diário");
  await sleep(600);
  balance = await readBalance(page);
  check(balance === 1500, `bônus diário soma (visto: ${balance})`);

  // ---- Roulette ----
  await clickByText(page, "Jogar roleta");
  await waitText(page, "Apostas externas");

  await clickByText(page, "Vermelho");
  await clickByText(page, "Zero 0");
  await sleep(300);
  const chipsShown = await page.$$(".mini-chip");
  const bodySnippet = await page.evaluate(() => {
    const m = document.body.innerText.match(/Apostado[^\n]*/m);
    return m ? m[0] : "SEM 'Apostado'";
  });
  check(chipsShown.length === 2, `fichas na mesa (${chipsShown.length})`);
  check(bodySnippet.includes("100"), `apostas registradas 100 (visto: ${bodySnippet})`);

  await clickByText(page, "🎡 Girar");
  await page.waitForFunction(
    () => !document.body.innerText.includes("Girando..."),
    { timeout: 15000 },
  );
  await sleep(500);

  const historyBalls = await page.$$(".hist-ball");
  check(historyBalls.length === 1, `histórico da roleta preencheu (${historyBalls.length} bola)`);

  const balanceAfterSpin = await readBalance(page);
  check(
    [1400, 1500, 3200, 3300].includes(balanceAfterSpin),
    `saldo após roleta em {1400,1500,3200,3300} (visto: ${balanceAfterSpin} → aposta Vermelho+Zero=100)`,
  );

  // ---- Back to lobby, test slots ----
  await page.click("button[title='Voltar']");
  await waitText(page, "Jogos");
  await clickByText(page, "Jogar caça-níqueis");
  await waitText(page, "JACKPOT");

  const beforeSlots = await readBalance(page);
  await clickByText(page, "🎰 Girar");
  await sleep(2600);
  const afterSlots = await readBalance(page);
  check(
    beforeSlots !== afterSlots,
    `slots consumiu/resultou saldo (${beforeSlots} → ${afterSlots})`,
  );

  // ---- Back to lobby: perfil persistiu ----
  await page.click("button[title='Voltar']");
  await waitText(page, "Jogos");
  const balPersisted = await readBalance(page);
  check(balPersisted > 0, `saldo persiste no lobby (${balPersisted})`);

  // ---- Recarregar: auto-login no lobby com saldo salvo (sem tela de login) ----
  await page.reload({ waitUntil: "networkidle0", timeout: 30000 });
  await sleep(1000);
  const inLobby = await page.evaluate(() => document.body.innerText.includes("Jogos"));
  check(inLobby, "recarregar mantém sessão (sem pedir login)");
  const restored = await readBalance(page);
  check(restored === balPersisted, `saldo restaurado após recarregar (${restored})`);

  // ---- Trocar jogador → dropdown → Sair → login lista o perfil ----
  await page.click("button[title='Trocar jogador']");
  await sleep(400);
  await clickByText(page, "Sair");
  await sleep(800);
  const playerListed = await page.evaluate(() => document.body.innerText.includes("Teste E2E"));
  check(playerListed, "tela de login lista jogadores existentes");
  await clickByText(page, "Teste E2E");
  await sleep(800);
  await waitText(page, "Jogos");

  const consoleErrFiltered = consoleErrors.filter(
    (e) =>
      !e.includes("favicon") &&
      !e.includes("Download the React DevTools") &&
      !e.includes("Violation") &&
      !e.includes("404"),
  );
  check(consoleErrFiltered.length === 0, `sem erros de console (${consoleErrFiltered.length})`);
  for (const e of consoleErrFiltered) console.log("  console error:", e);

  await browser.close();
  console.log(failures === 0 ? "\n✅ E2E COMPLETO COM SUCESSO" : `\n❌ ${failures} verificação(ões) falharam`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("E2E crash:", e);
  process.exit(1);
});