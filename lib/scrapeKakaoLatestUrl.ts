import { Page } from "puppeteer-core";
import { launchBrowser } from "@/lib/launchBrowser";

const POST_LINK_SELECTOR = ".box_list_board a.link_board";

export async function scrapeKakaoLatestUrl(): Promise<string | null> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    await page.goto("https://pf.kakao.com/_mHWxjX", {
      waitUntil: "networkidle2",
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const hasBoard = await page.$(POST_LINK_SELECTOR);
    if (!hasBoard) {
      console.warn(`⚠️ ${POST_LINK_SELECTOR} 요소를 찾지 못했어요.`);
      return null;
    }

    const urlBeforeClick = page.url();

    const popupPromise = new Promise<Page | null>((resolve) => {
      const timeout = setTimeout(() => resolve(null), 5000);
      browser.once("targetcreated", async (target) => {
        clearTimeout(timeout);
        const newPage = await target.page();
        resolve(newPage as Page | null);
      });
    });

    await page.click(POST_LINK_SELECTOR);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const popup = await popupPromise;

    if (popup) {
      const finalUrl = popup.url();
      await popup.close();
      console.log("✅ 최신 게시물 URL(새 탭):", finalUrl);
      return finalUrl;
    }

    const urlAfterClick = page.url();
    if (urlAfterClick !== urlBeforeClick) {
      console.log("✅ 최신 게시물 URL(같은 탭):", urlAfterClick);
      return urlAfterClick;
    }

    console.warn("⚠️ 클릭해도 URL 변화가 감지되지 않았어요.");
    return null;
  } finally {
    await browser.close();
  }
}
