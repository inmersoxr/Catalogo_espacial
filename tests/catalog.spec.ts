import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
const ids = [
  "cover",
  "contents",
  "manifesto",
  "living",
  "stories",
  "bedroom",
  "storefront",
  "dining",
  "final",
];
async function seek(page: Page, id: string, progress = 0.3) {
  await page.evaluate(
    ({ id, progress }) => {
      const el = document.getElementById(id)!;
      window.scrollTo(
        0,
        el.offsetTop + (el.offsetHeight - innerHeight) * progress,
      );
    },
    { id, progress },
  );
  await page.waitForTimeout(850);
}
for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 844, height: 390 },
]) {
  test(`${viewport.name}: all chapters, reverse scroll, products and navigation`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto("");
    await page.waitForTimeout(1600);
    fs.mkdirSync(`docs/screenshots/${viewport.name}`, { recursive: true });
    await expect(page.locator(".scene")).toHaveCount(9);
    await page.screenshot({
      path: `docs/screenshots/${viewport.name}/00-cover.png`,
    });
    for (const id of ids.slice(1)) {
      await seek(page, id);
      await expect(page.locator(`#${id} .stage`)).toBeInViewport();
      const geometry = await page.locator(`#${id} .stage`).boundingBox();
      expect(geometry?.width).toBe(viewport.width);
      expect(geometry?.height).toBe(viewport.height);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `docs/screenshots/${viewport.name}/${id}.png`,
      });
    }
    for (const id of ["manifesto", "stories", "storefront", "final"]) {
      await seek(page, id, 0.3);
      const hidden = await page
        .locator(`#${id} .secondary .char, #${id} .relation-item`)
        .evaluateAll((els) =>
          els.every((el) => Number(getComputedStyle(el).opacity) < 0.01),
        );
      expect(hidden).toBeTruthy();
      await seek(page, id, 0.73);
      await page.screenshot({
        path: `docs/screenshots/${viewport.name}/${id}-reprise.png`,
      });
    }
    for (const id of ["living", "bedroom", "dining"]) {
      await seek(page, id, 0.72);
      const room = page.locator(`#${id}`);
      await expect(room.locator(".commerce")).toBeVisible();
      await room.locator(".product-selection button").nth(1).click();
      await expect(
        room.locator(".product-selection button").nth(1),
      ).toHaveAttribute("aria-pressed", "true");
      await room.getByRole("button", { name: "Object details +" }).click();
      await expect(room.locator(".product-details")).toBeVisible();
      await page.screenshot({
        path: `docs/screenshots/${viewport.name}/${id}-commerce.png`,
      });
      await room.getByRole("button", { name: "Close details −" }).click();
      const at = await room
        .locator(".room-heading .char")
        .first()
        .evaluate((el) => getComputedStyle(el).opacity);
      expect(Number(at)).toBeLessThan(0.1);
      await seek(page, id, 0.3);
      await expect(room.locator(".commerce")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      const restored = await room
        .locator(".room-heading .char")
        .first()
        .evaluate((el) => getComputedStyle(el).opacity);
      expect(Number(restored)).toBeGreaterThan(0.99);
      await room.getByRole("button", { name: "Explore the objects" }).click();
      await page.waitForTimeout(850);
      await expect(room.locator(".commerce")).toBeVisible();
    }
    await seek(page, "contents", 0.3);
    await page.locator(".contents-list a").nth(1).click();
    await page.waitForTimeout(850);
    expect(new URL(page.url()).hash).toBe("#bedroom");
    await page.getByRole("button", { name: "Open chapter navigation" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    ).toBeTruthy();
    expect(errors).toEqual([]);
  });
}
test("reduced motion, deep links and portrait gate", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("#bedroom");
  await page.waitForTimeout(650);
  await expect(page.locator("#bedroom .commerce")).toBeVisible();
  await expect(
    page.locator("#bedroom .product-selection button").first(),
  ).toBeEnabled();
  await page.screenshot({ path: "docs/screenshots/reduced-motion.png" });
  expect(await page.locator("#bedroom").evaluate((el) => el.clientHeight)).toBe(
    390,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".rotate-screen")).toBeVisible();
  await expect(page.locator("main")).not.toBeVisible();
  await page.screenshot({ path: "docs/screenshots/portrait.png" });
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator("main")).toBeVisible();
});
