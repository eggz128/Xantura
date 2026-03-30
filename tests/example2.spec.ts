import { test, expect } from "@playwright/test";

test('Test name', async ({page})=>{
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2');
});