const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game.feature');

//const dbService = require('../../../questions/services/question-data-service');
//import MockAdapter from 'axios-mock-adapter';

let page;
let browser;
let answer;


defineFeature(feature, test => {

  beforeAll(async () => {
      
      browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 40 });
    page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if(req.url().endsWith('/questions')) {
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
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

      await page
      .goto("http://localhost:3000/game", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('Answering a question correctly', ({given,when,then}) => {

    given('A question', async () => {
        //await expect(page.findByText('Which is the capital of Spain?'));
        const question = await page.$['data-testId="question"'];
        await expect(page).toMatchElement("div", { text: 'Which is the capital of Spain?'});
        expect(question).not.toBeNull();
        
        const answers = await page.$x('//*[@data-testId="answer"]');
        expect(answers.length).toBe(4);
    });

    when('I click on the correct answer button', async () => {
        const answers = await page.$x('(//*[@data-testId="answer"])[1]');
        await answers[0].click();
    });

    then('The button turns green', async () => {
        const answerButton = await page.$x('(//*[@data-testId="answer"])[1]');
        const textoBoton = await page.evaluate(button => button.innerText, answerButton[0]);
        await expect(textoBoton).toMatch(/Madrid/i);
        await expect(page).toMatchElement("button", { style: { color: 'green' } });
    });
  })

  /*test('Answering a question incorrectly', ({given,when,then}) => {

    given('A question', async () => {
      await expect(page).toMatchElement("div", { text: 'Which is the capital of Spain?'});
      await expect(page).toMatchElement("div", { text: 'Madrid'});
      await expect(page).toMatchElement("div", { text: 'Barcelona'});
      await expect(page).toMatchElement("div", { text: 'Paris'});
      await expect(page).toMatchElement("div", { text: 'London'});
    });

    when('I click on an incorrect answer button', async () => {
        //answer = await page.getByRole('button', { name: 'Barcelona' });
        await expect(page).toMatchElement("div", { text: 'Barcelona'}).not.toHaveStyle({ color: 'green' });
        await expect(page).toClick('button', { text: 'Barcelona' })


        //await expect(answer).not.toHaveStyle({ color: 'red' });

        //selects correct answer
        //await fireEvent.click(answer);
    });

    then('The button turns red', async () => {
        //await expect(answer).toHaveStyle({ color: 'red' });
        await expect(page).toMatchElement("div", { text: 'Barcelona'}).toHaveStyle({ color: 'green' });

    });
  })*/

  afterAll(async ()=>{
    browser.close()
  })

});