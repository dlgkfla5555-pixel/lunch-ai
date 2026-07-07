import puppeteer, { Page } from "puppeteer";

const POST_LINK_SELECTOR = ".box_list_board a.link_board";

export async function scrapeKakaoLatestUrl(): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.goto("https://pf.kakao.com/_mHWxjX", {
      waitUntil: "networkidle2",
    });

    // JS 렌더링 대기
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const hasBoard = await page.$(POST_LINK_SELECTOR);
    if (!hasBoard) {
      console.warn(`⚠️ ${POST_LINK_SELECTOR} 요소를 찾지 못했어요.`);
      return null;
    }

    const urlBeforeClick = page.url();

    // target="_blank"로 새 탭이 열리는 경우도 대비
    const popupPromise = new Promise<Page | null>((resolve) => {
      const timeout = setTimeout(() => resolve(null), 5000);
      browser.once("targetcreated", async (target) => {
        clearTimeout(timeout);
        const newPage = await target.page();
        resolve(newPage);
      });
    });

    // box_list_board 안의 첫 번째(=최신) 게시물 클릭
    await page.click(POST_LINK_SELECTOR);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const popup = await popupPromise;

    // 1순위: 새 탭이 열렸다면 그 탭의 URL
    if (popup) {
      const finalUrl = popup.url();
      await popup.close();
      console.log("✅ 최신 게시물 URL(새 탭):", finalUrl);
      return finalUrl;
    }

    // 2순위: 같은 탭에서 SPA 방식으로 URL이 바뀐 경우
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
