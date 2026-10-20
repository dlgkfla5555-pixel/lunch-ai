import type { Browser } from "puppeteer-core";

export async function launchBrowser(): Promise<Browser> {
  const isServerless = !!process.env.VERCEL;

  if (isServerless) {
    // Vercel 등 서버리스 환경: Browserless 원격 브라우저에 연결
    const puppeteer = await import("puppeteer-core");

    const apiKey = process.env.BROWSERLESS_API_KEY;
    if (!apiKey) {
      throw new Error("BROWSERLESS_API_KEY 환경변수가 설정되지 않았어요.");
    }

    return puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=${apiKey}`,
    });
  }

  // 로컬 개발 환경: 일반 puppeteer(로컬에 설치된 크롬) 사용
  const puppeteerFull = await import("puppeteer");
  return puppeteerFull.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }) as unknown as Promise<Browser>;
}
