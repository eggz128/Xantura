import {Page, Locator} from '@playwright/test'
import { AuthPagePOM } from './AuthPagePOM';

export class HomePagePOM {

    page: Page //Property to hold the page so other methods here can use it
    loginLink: Locator
    heading: Locator

    //Constructor is a "special" method that automatically runs when this class is turned in to an object
    constructor(page: Page){
        this.page = page; //Put the page the test passed to the constructor in to the clas property
        //Populatoe locator properties with actual locators
        this.loginLink = page.getByRole('link', { name: 'Login To Restricted Area' })
        this.heading = page.locator('h1');
    }

    //Service methods
    async goLoginPage(){
        await this.loginLink.click();
    }

    //REturning a value
    async getHeading(){
        return await this.heading.textContent();
    }

}