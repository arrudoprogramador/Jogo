import puppeteer, { type Page } from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.APP_URL ?? "http://localhost:3104";

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
  if (!ok) throw new Error(`botão "${text}" não encontrado`);
}

let failures = 0;
function check(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error(`✖ ${msg}`);
  } else console.log(`✓ ${msg}`);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  // ---------- Mobile ----------
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 840 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  await sleep(1000);
  await page.type("input[placeholder='Seu apelido']", "Mobile Teste");
  await clickByText(page, "Entrar no Cassino");
  await sleep(900);

  const overflowDesktopages = await page.evaluate(() => {
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
  });
  check(overflowDesktopages.sw <= overflowDesktopages.cw, `mobile lobby sem overflow horizontal (${overflowDesktopages.sw}/${overflowDesktopages.cw})`);

  await clickByText(page, "Jogar roleta");
  await sleep(900);
  const overflowMobile = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  check(overflowMobile.sw <= overflowMobile.cw, `mobile roleta sem overflow horizontal (${overflowMobile.sw}/${overflowMobile.cw})`);

  const wedges = await page.evaluate(() => document.querySelectorAll(".wheel-svg path").length);
  check(wedges === 37, `roleta com 37 fatias (${wedges})`);

  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].map((f) => f.family).filter((f) => /Poppins|Inter/.test(f));
  });
  check(
    fonts.some((f) => /\bPoppins\b/.test(f)) && fonts.some((f) => /\bInter\b/.test(f)),
    `fontes carregadas (${[...new Set(fonts)].join(", ")})`,
  );

  await page.click("button[title='Voltar']");
  await sleep(700);
  await clickByText(page, "Jogar caça-níqueis");
  await sleep(900);
  const overflowSlots = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  check(overflowSlots.sw <= overflowSlots.cw, `mobile slots sem overflow horizontal (${overflowSlots.sw}/${overflowSlots.cw})`);
  const syms = await page.evaluate(() => document.querySelectorAll(".sym").length);
  check(syms === 72, `slots com 72 posições visíveis (${syms})`);

  // Gira e valida que o símbolo no centro de CADA rolo == resultado anunciado
  await clickByText(page, "🎰 Girar");
  await sleep(4600);
  const slotResult = await page.evaluate(() => {
    const centers = [...document.querySelectorAll(".reel-window")].map(
      (w) => w.querySelectorAll(".reel-strip .sym")[6]?.textContent.trim() ?? "",
    );
    const banner = document.querySelector(".center span:not(.pill)");
    const res = banner ? banner.textContent.trim().split(/\s{2,}/) : [];
    return { centers, res };
  });
  check(
    slotResult.centers.length === 3 &&
      slotResult.res.length === 3 &&
      slotResult.centers.every((c, i) => c === slotResult.res[i]),
    `centro dos rolos == resultado do giro (${slotResult.centers.join(" ")})`,
  );

  await browser.close();
  console.log(failures === 0 ? "\n✅ CHECAGEM VISUAL OK" : `\n❌ ${failures} falha(s)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
