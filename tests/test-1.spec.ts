import { test, expect } from '@playwright/test'; //Bring in PW test() and expect() methods for use in this file

//Test method takes 2 arguments: 1st-Test name, 2nd-call back function with the test code to run
test('test', async ({ page }) => { //Always "await" steps that run in browser. To do that this function must be async
  //Cy: cy.open('https://www.edgewordstraining.co.uk/webdriver2/')
  //WD Js: await driver.get('https://www.edgewordstraining.co.uk/webdriver2/')
  await page.goto('/webdriver2/'); //BaseURL set in config file
  //Steps follow the common pattern: tool-->find something-->do something with the found object
  //Cy: cy.get('a[src$="auth.php"]').click();
  //Wd: await driver.findElement(By.linkText("Login to restricted area")).click();
  //Old PW: await page.click('a[src$="auth.php"]'); //Dont do this - it works but is considered poor practice today as it doesnt follow the pattern
  //await page.getByRole('link', { name: 'Login To' }).click();
  await page.getByRole('link', { name: /Login .*/ }).click();

  //If an element is to be used multiple times you can define a variable that holds the locator
  //Locators can be "chained" i.e. find ElementA . inside that, find ElementB
  //.describe() can give a "friendly name" to the target element for use in the HTML report. Otherwise the locator chain is used.
  const username = page.getByRole('row', { name: 'User ' }).locator('#username').describe('The username field'); //Unlike WebDriver - no search for the element is performed here in browser. No need to await.
  //The variable can then be used multiple times instead of repeating the entire locator.
  await page.locator('input').first().fill('test')

  await username.click(); //The search for the element starts when an action is called. You *must* await actions, or your tests may flake/fail.
  await username.fill('edgewords');
  await page.locator('#username').filter({ visible: true }).click();
  //locator() takes CSS or xpath. Prefer CSS.
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  //CSS (and XPath) locators almost inevitably depend on the page structure (DOM). PW (recorder) prefers accessibility locators like getByRole getByText etc as it is reasoned they are less likely to break with further development of the target site. 
  await page.getByRole('link', { name: 'Submit' }).click();
  //Expects have 5s to complete. The test as a whole has 30s. (By default)
  await expect(page.getByRole('heading', { name: 'Add A Record To the Database' })).toBeVisible();
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
  await expect(page.locator('#AddRecord')).toMatchAriaSnapshot(`
    - heading "Add" [level=2]
    - table:
      - rowgroup:
        - row "Name?":
          - cell "Name?"
          - cell:
            - textbox
        - row "UserName?":
          - cell "UserName?"
          - cell:
            - textbox
        - row "Pin?":
          - cell "Pin?"
          - cell:
            - textbox
        - row "Password?":
          - cell "Password?"
          - cell:
            - textbox
        - row "Submit Clear":
          - cell
          - cell "Submit Clear":
            - link "Submit":
              - /url: "#"
            - link "Clear":
              - /url: "#"
    `);
});

test('all products', async ({ page }) => {

  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual matches logging the text
  }; //No need to await console, but you do need to await the locator. Or you will only get the "promise" of the text, not the actual text.

});

 test('Locator Handler', async ({ page }) => { //How to handle unpredicatable modal "pop ups"
    // Setup the handler.
    const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
    await page.addLocatorHandler(
      cookieConsent, //Locator to watch out for
      async () => { //If spotted, what to do
        //console.log("Spotted cookie consent")
        await page.getByRole('button', { name: 'Accept' }).click();
      }
      , //Optional arguments - can be omitted
      {
        times: 10, //How many times the locator may appear before the handler should stop handling the locator
        //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
        noWaitAfter: false //this can be overridden however
      }
    );

    // Now write the test as usual. If at any time the cookie consent form is shown it will be accepted.
    await page.goto('https://www.ikea.com/');
    await page.getByRole('link', { name: "40 years of the IKEA meatball" }).click();
    await expect(page.getByRole('heading', { name: "40 years of having a ball" })).toBeVisible();

    //If you're confident the locator will no longer be found you can de-register the handler
    //await page.removeLocatorHandler(cookieConsent);
    //If the cookie consent form appears from here on it may cause issues with the test...
    await page.waitForTimeout(10000); //Big dumb wait before finishing the test
  })