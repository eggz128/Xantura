import { test, expect } from '@playwright/test';

test('Options screenshots and validation', async ({ page }, testInfo) => {
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")
    await page.locator('#select').click();
    await page.waitForTimeout(1000); //Wait for options to "drop down" to esure video catches it. *Nope* Does not appear in video. 
    const optionsScreenshot = await page.screenshot(); //Get the whole page - if you attempt to screenshot a webelement the options drop down is collapsed
    await testInfo.attach('Screenshot from variable', { body: optionsScreenshot, contentType: 'image/png' });

    const optionsCollection = await page.locator('#select > option').all();
    for (const elm of optionsCollection) {
        console.log(await elm.textContent());
    };

    const expectedOptions = [ //Test Data
        "Selection One",
        "Selection TwoXXX", //Deliberate fail to show in test report
        "Selection Three"
    ];

    //Check optionsCollection matches expectedOptions
    for (let i = 0; i < expectedOptions.length; i++) { //via loop
        const optionText = await optionsCollection[i].textContent();
        expect.soft(optionText).toBe(expectedOptions[i]);
    }
    //construct and compare array
    const optionTexts = await Promise.all(optionsCollection.map(optionelm => optionelm.textContent()));
    expect(expectedOptions).toEqual(optionTexts);

    //Dynamic lazy loaded React "options"
    //https://wpbk7.csb.app/

});