const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/theChallangeGame.feauture');

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
    .goto("http://localhost:3000/theChallengeGame", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});

    //"mock" login
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('sessionId', 'fictitiousSessionId12345');
    });

    await page
    .goto("http://localhost:3000/theChallengeGame", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});
  });


  test('Answering a question correctly', ({given,when,then}) => {

    given('A question', async () => {
        const button = await page.$('[data-testid="start-button"]');
        await button.click();

        //await expect(page.findByText('Which is the capital of Spain?'));
        const question = await page.$['data-testid="question"'];
        await expect(page).toMatchElement("div", { text: 'Which is the capital of Spain?'.toUpperCase()});
        expect(question).not.toBeNull();
        
        const answers = await page.$x('//*[contains(@data-testid, "success") or contains(@data-testid, "failure") or contains(@data-testid, "answer")]');
        expect(answers.length).toBe(4);
    });

    when('I click on the correct answer button', async () => {
        const answers = await page.$x('//*[contains(@data-testid, "success") or contains(@data-testid, "failure") or contains(@data-testid, "answer")]');
        await answers[0].click();
  
    });

    then('The button turns green', async () => {
        await expect(page).toMatchElement("button", { style: { color: 'rgb(51, 153, 102);' } });
    });
  })

  test('Answering a question incorrectly', ({given,when,then}) => {

    given('A question', async () => {
        const button = await page.$('[data-testid="start-button"]');
        await button.click();

        //await expect(page.findByText('Which is the capital of Spain?'));
        const question = await page.$['data-testid="question"'];
        await expect(page).toMatchElement("div", { text: 'Which is the capital of Spain?'.toUpperCase()});
        expect(question).not.toBeNull();
        
        const answers = await page.$x('//*[contains(@data-testid, "success") or contains(@data-testid, "failure") or contains(@data-testid, "answer")]');
        expect(answers.length).toBe(4);
    });

    when('I click on an incorrect answer button', async () => {
        const answers = await page.$x('//*[contains(@data-testid, "success") or contains(@data-testid, "failure") or contains(@data-testid, "answer")]');
        await answers[1].click();
    });

    then('The button turns red', async () => {
        await expect(page).toMatchElement("button", { style: { color: 'rgb(153, 0, 0);' } });
        await expect(page).toMatchElement("button", { style: { color: 'rgb(51, 153, 102);' } });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});