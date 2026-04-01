import { expect } from '@playwright/test';
import { test } from './my-test';
import { HomePagePOM } from './POMClasses/HomePagePOM';
import { AuthPagePOM } from './POMClasses/AuthPagePOM';
import Logins from './TestData/Logins.json'


test('Traditional test', async ({ page }) => {
  //Home page
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  //Login/auth page
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  //Should be on Add Record page
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('POM Test', async ({ page }) => {
  //Home page
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  //Instantiate HomePagePOM
  const HomePage = new HomePagePOM(page);
  //Check we are on Homepage -- asserts/expects belong in the test.
  //Service methods return values for the test to assert on
  expect(await HomePage.getHeading()).toContain('Access and Authentication');
  await HomePage.goLoginPage();

  //INstantiate AuthPagePOM
  const AuthPage = new AuthPagePOM(page);
  // //Object Repo
  // await AuthPage.usernameInput.fill("edgewords");
  // await AuthPage.passwordInput.fill("edgewords123");
  // await AuthPage.submitButton.click();


  // //Page Object Servce methods (low level)
  // await AuthPage.setUsername("edgewords");
  // await AuthPage.setPassword("edgewords123");
  // await AuthPage.submitForm();

  //Page Object Servce methods (higher level)
  await AuthPage.login("edgewords", "edgewords123");
})


for (const credentials of Logins) {
  test(`Data driven test using ${credentials.username}`, async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    const HomePage = new HomePagePOM(page);
    await HomePage.goLoginPage();
    const AuthPage = new AuthPagePOM(page);
    await AuthPage.setUsername(credentials.username);
    await AuthPage.setPassword(credentials.password);
    await AuthPage.submitForm();
  })
}


test('Env vars', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  const HomePage = new HomePagePOM(page);
  await HomePage.goLoginPage();
  const AuthPage = new AuthPagePOM(page);
  await AuthPage.setUsername(process.env.PWUSERNAME!);
  await AuthPage.setPassword(process.env.PWPASSWORD!);
  await AuthPage.submitForm();
})

test('Paramiterised Project', async ({ page, person }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  const HomePage = new HomePagePOM(page);
  await HomePage.goLoginPage();
  const AuthPage = new AuthPagePOM(page);
  await AuthPage.setUsername(person);
  await AuthPage.setPassword("edgewords123");
  await AuthPage.submitForm();
})

