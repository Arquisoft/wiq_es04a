const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;

async function registerUser(username, password, name, surname) {
    clickLink('//*[@id="root"]/div/header/div/a[2]');
  
    await expect(page).toClick("a", { text: "Don't have an account? Register here." });
  
    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toFill('input[name="name"]', name);
    await expect(page).toFill('input[name="surname"]', surname);
    await expect(page).toClick('button', { text: 'Sign Up' });
  }

async function clickLink(linkXPath) {
const [link] = await page.$x(linkXPath);
if (link) {
    await link.click();
} else {
    throw new Error(`Cannot find link "${link}"`);
}
}

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 40 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is already registered in the site', ({given,when,then}) => {

    given('A registered user', async () => {
      username = "usuarioNuevo2"
      password = "12345678mM."
      let name = "Jordi";
      let surname = "Hurtado";

      await registerUser(username, password, name, surname);
    });

    when('I fill the data in the form and press login', async () => {
      clickLink('//*[@id="root"]/div/header/div/div[3]/button');
      clickLink('//*[@id="root"]/div/header/div/a[2]');

      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
    });

    then('Home page should be shown in the screen', async () => {
        await expect(page).toMatchElement("button", { text: "PLAY" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});