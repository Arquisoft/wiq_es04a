const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/wiseMenStackGame.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
      
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 40 });
    page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if(req.url().endsWith('/Geography')) {
        req.respond({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          contentType: 'application/json',
          body: JSON.stringify([{
            question: 'Which is the capital of Spain?',
            options: ['Madrid', 'Barcelona', 'Paris', 'London'],
            correctAnswer: 'Madrid',
            categories: ['Geography'],
            language: 'en'
          }])
        });
      } else {
        req.continue();
      }
    });
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })
  });

  beforeEach(async () => {
    await page
    .goto("http://localhost:3000/wiseMenStackGame", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});
    
    //"mock" login
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('sessionId', 'fictitiousSessionId12345');
    });

    await page
    .goto("http://localhost:3000/wiseMenStackGame", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});
  });


  test('Answering a question correctly', ({given,when,then}) => {

    given('A question', async () => {
      const button = await page.$('[data-testid="start-button"]');
      await button.click();

      const question = await page.$['data-testid="question"'];
      expect(question).not.toBeNull();
      await expect(page).toMatchElement("div", { text: 'WHICH IS THE CAPITAL OF SPAIN?'});
      
      const answers = await page.$x('//*[contains(@data-testid, "answer")]');
      expect(answers.length).toBe(2);
    });

    when('I click on the correct answer button', async () => {
      const answers = await page.$x('//*[contains(@data-testid, "answer")]');
      const textoBoton1 = await page.evaluate(button => button.innerText, answers[0]);
      if(textoBoton1 === "MADRID") {
        await answers[0].click();
      } else {
        await answers[1].click();
      }
    });

    then('The selected answer is marked as right', async () => {
      const answer = await page.$x('//*[contains(@data-testid, "success")]');
      expect(answer.length).toBe(1);
      const textoBoton = await page.evaluate(button => button.innerText, answer[0]);
      await expect(textoBoton).toMatch(/Madrid/i);
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});