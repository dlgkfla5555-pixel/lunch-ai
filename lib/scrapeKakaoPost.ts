import puppeteer from "puppeteer";

export async function scrapeKakaoPost(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await page.screenshot({ path: "kakao.png", fullPage: true });
console.log("📸 screenshot 저장 완료");

    // 디버깅용 (나중에 정상 동작하면 삭제 가능)
    const html = await page.content();
    console.log("desc_card 존재:", html.includes("desc_card"));

    await page.waitForSelector(".desc_card", {
      timeout: 10000,
    });

    const text = await page.$eval(
      ".desc_card",
      (el) => el.textContent || ""
    );

    return text;
  } finally {
    await browser.close();
  }
}