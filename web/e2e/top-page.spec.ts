import { expect, test } from "@playwright/test";

const count: number = "3";

test("E-01 トップページを開くと、見出し「Our Wedding」が表示される", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Our Wedding" })).toBeVisible();
});

test("存在しない見出しで落ちる", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Not Our Wedding" })).toBeVisible();
});
