import { expect, test } from "@playwright/test";

test("E-01 トップページを開くと、見出し「Our Wedding」が表示される", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Our Wedding" })).toBeVisible();
});
