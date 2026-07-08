import type { Browser } from "puppeteer-core";

export async function launchBrowser(): Promise<Browser> {
  const isServerless = !!process.env.VERCEL;

  if (isServerless) {
    // Vercel 등 서버리스 환경: 경량 크로미움 사용
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");

    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // 로컬 개발 환경: 일반 puppeteer(로컬에 설치된 크롬) 사용
  const puppeteerFull = await import("puppeteer");
  return puppeteerFull.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }) as unknown as Promise<Browser>;
}
