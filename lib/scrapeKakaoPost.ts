import { launchBrowser } from "@/lib/launchBrowser";

export async function scrapeKakaoPost(url: string) {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector(".desc_card", {
      timeout: 10000,
    });

    const text = await page.$eval(".desc_card", (el) => el.textContent || "");

    return text;
  } finally {
    await browser.close();
  }
}
