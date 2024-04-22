const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const { expect } = require('expect-puppeteer');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game.feature');

let page;
let browser;


async function loginUser(username, password, name, surname) {
  clickLink('//button[text()="PLAY"]');

  await expect(page).toFill('input[name="username"]', username);
  await expect(page).toFill('input[name="password"]', password);
  await expect(page).toClick('button', { text: /Log in/i });

  if(await expect(page).toBe('button', { text: /Log in/i })) {
    await expect(page).toClick("a", { text: "Don't have an account? Register here." });
    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toFill('input[name="name"]', name);
    await expect(page).toFill('input[name="surname"]', surname);
    await expect(page).toClick('button', { text: /Sign Up/i })
    
  }
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

    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if(req.url().endsWith('/questions/en')) {
        req.respond({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          contentType: 'application/json',
          body: JSON.stringify({
            question: 'Which is the capital of Spain?',
            options: ['Madrid', 'Barcelona', 'Paris', 'London'],
            correctAnswer: 'Madrid',
            categories: ['Geography'],
            language: 'en'
          })
        });
      } else {
        req.continue();
      }
      });
      setDefaultOptions({ timeout: 10000 })
      await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
      await loginUser("prueba14","123456789Ab=11", "pr","prueba");
      
      //Way of setting up the timeout     
  });

  beforeEach(async () => {
    await page
    .goto("http://localhost:3000/game", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});
  });


  test('Answering a question correctly', ({given,when,then}) => {

    given('A question', async () => {
        //await expect(page.findByText('Which is the capital of Spain?'));
        const question = await page.$['data-testid="question"'];
        await expect(page).toMatchElement("div", { text: 'Which is the capital of Spain?'});
        expect(question).not.toBeNull();
        
        const answers = await page.$x('//*[@data-testid="answer"]');
        expect(answers.length).toBe(4);
    });

    when('I click on the correct answer button', async () => {
        const answers = await page.$x('(//*[@data-testid="answer"])[1]');
        await answers[0].click();
    });

    then('The button turns green', async () => {
        const answerButton = await page.$x('(//*[@data-testid="answer"])[1]');
        const textoBoton = await page.evaluate(button => button.innerText, answerButton[0]);
        await expect(textoBoton).toMatch(/Madrid/i);
        await expect(page).toMatchElement("button", { style: { color: 'green' } });
    });
  })

  test('Answering a question incorrectly', ({given,when,then}) => {

    given('A question', async () => {
        //await expect(page.findByText('Which is the capital of Spain?'));
        const question = await page.$['data-testid="question"'];
        await expect(page).toMatchElement("div", { text: 'Which is the capital of Spain?'});
        expect(question).not.toBeNull();
        
        const answers = await page.$x('//*[@data-testid="answer"]');
        expect(answers.length).toBe(4);
    });

    when('I click on an incorrect answer button', async () => {
        const answers = await page.$x('(//*[@data-testid="answer"])[2]');
        await answers[0].click();
    });

    then('The button turns red', async () => {
        const answerButton = await page.$x('(//*[@data-testid="answer"])[2]');
        const textoBoton = await page.evaluate(button => button.innerText, answerButton[0]);
        await expect(textoBoton).toMatch(/Barcelona/i);
        await expect(page).toMatchElement("button", { style: { color: 'red' } });
        await expect(page).toMatchElement("button", { style: { color: 'green' } });

    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});