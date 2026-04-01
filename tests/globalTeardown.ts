import {test as teardown} from '@playwright/test';

teardown('logout', async ({ page }) => {
    page.once('dialog', dialog => { //Listen for logout alert
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.accept().catch(() => {});
    });
    await page.getByRole('link', { name: 'Log Out' }).click(); //Cause logout alert
});