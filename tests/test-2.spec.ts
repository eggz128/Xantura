import { test, expect } from '@playwright/test';

test('Capturing Text', async ({ page }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
  await page.locator('#textInput').fill("Hello World");

  let textPromise = page.locator('#right-column').textContent();
  console.log("Without 'await'ing textContent() you get a 'promise' of the future text, not the actual text");
  console.log(textPromise);

  let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

  console.log("The right column text is with textContent is: " + rightColText);

  rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

  console.log("The right column text is with innertext is: " + rightColText);

  let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
  console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

  //Using generic $eval to get the browser to return the INPUT text
  //This will *not* retry or wait
  textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
  
  console.log("The text box actually contains: " + textBoxText);

  await page.$eval('#textInput', elm => {
    console.log(typeof (elm)); //Writes to browser's console! Not NodeJS console.
  });

  await page.locator('#textInput').evaluate(elm => { //using locator().evaluate() the locator will be retried if no element found
    console.log(elm); //Also outputs to browser console.
  });

  expect(textBoxText).toBe("Hello World");
  await expect(page).toHaveTitle("Forms", { timeout: 5000 }) //Override global config with a custom expect timeout
});

test('Generic methods', { tag: ['@RunMe', '@Smoke'] }, async ({ page }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

  const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
  console.log(`There are ${menuLinks.length} links`)

  console.log("The link texts are:")

  for (const iterator of menuLinks) {
    console.log(iterator!.trim())
  }
  //$eval and $$eval DONT retry. If the locator doesnt find a matching element(s) then you get null.

  //Preferred - using retry-able Playwright locators
  //expect(await page.locator('#menu a').all()).toHaveLength(5) //Collection should have 5 members - do not cotinue until that is true
  const preferredLinks = await page.locator('#menu a').all();
  for (const elm of preferredLinks) {
    // const elmtext = await elm.textContent();
    // const elmtexttrimmed = elmtext?.trim(); //Combine these two steps below
    console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
  }
});

test('Waits',async ({ page }) => {
  //test.setTimeout(20 * 1000);
  test.slow(); //Triple test timeout
  page.setDefaultTimeout(7000); //Actions here have 7s. Set as 5 in global config. Default is inf.
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/',{timeout:20000});
  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Dynamic Content' }).click();
  await page.locator('#delay').click();
  await page.locator('#delay').fill('10');
  await page.getByRole('link', { name: 'Load Content' }).click();
  //Wait for spinner/loader to go away
  await page.waitForSelector('#spinner-holder > img', {state: 'hidden',timeout: 11000 });
  //await page.locator('#image-holder > img').click({timeout: 5000});
  await page.locator('#image-holder > img').click();
  await page.getByRole('link', { name: 'Home' }).click();
  
});


test("Waiting for a pop up window", async ({ page, context }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html")

  //[a,b] = [10,20] - aray destructuring syntax will assign a=10 b=20
  //Below we discard the second promise return value - we only need the first which gets us a handle to the new page
  const [newSpawnedPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
    context.waitForEvent('page'),
    page.locator("#right-column > a[onclick='return popUpWindow();']").click()
  ])

  await page.waitForTimeout(2000); //Essentially a Thread.sleep(2000); - try to avoid this as other wait types can exit early if condition is met


  const closeBtn = newSpawnedPage.getByRole('link', { name: 'Close Window' })
  await closeBtn.click();

  await page.getByRole('link', { name: 'Load Content' }).click();

});