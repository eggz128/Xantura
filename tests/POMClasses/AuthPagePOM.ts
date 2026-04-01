import {Page, Locator} from '@playwright/test'

export class AuthPagePOM{

    page: Page //Property to hold the page so other methods here can use it
    usernameInput: Locator
    passwordInput: Locator
    submitButton: Locator

    //Constructor is a "special" method that automatically runs when this class is turned in to an object
    constructor(page: Page){
        this.page = page; //Put the page the test passed to the constructor in to the clas property
        //Populatoe locator properties with actual locators
        this.usernameInput = page.getByRole('row', { name: 'User Name?' }).locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.getByRole('link', { name: 'Submit' });
    }

    //Service methods
    async setUsername(username: string){
        await this.usernameInput.clear();
        await this.usernameInput.pressSequentially(username, {delay: 500})
    }

    async setPassword(password: string){
        await this.passwordInput.fill(password);
    }

    async submitForm(){
        await this.submitButton.click();
    }

    //Higher level
    async login(username: string, password: string){
        await this.setUsername(username);
        await this.setPassword(password);
        await this.submitForm();
    }

}