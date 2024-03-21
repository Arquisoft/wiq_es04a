const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

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

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;
    let name;
    let surname;

    given('An unregistered user', async () => {
      username = "usuarioNuevo"
      password = "12345678mM."
      name = "Jordi"
      surname = "Hurtado"
    
      const [loginLink] = await page.$x('//*[@id="root"]/div/header/div/a[2]');

      if (loginLink) {
        await loginLink.click();
      } else {
        throw new Error('Cannot find link "LOG IN"');
      }

      await expect(page).toClick("a", { text: "Don't have an account? Register here." });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="name"]', name);
      await expect(page).toFill('input[name="surname"]', surname);
      await expect(page).toClick('button', { text: 'Sign Up' })
    });

    then('A confirmation message should be shown in the screen', async () => {
        await expect(page).toMatchElement("div", { text: "User added successfully" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});