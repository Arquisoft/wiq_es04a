const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game.feature');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
//import MockAdapter from 'axios-mock-adapter';

let page;
let browser;
let answer;
const mockAxios = new MockAdapter(axios);

defineFeature(feature, test => {

  beforeAll(async () => {
      browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 40 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

      await page
      .goto("http://localhost:3000/game", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('Answering a question', ({given,when,then}) => {

    given('A question', async () => {
        //await expect(page.findByText('Which is the capital of Spain?'));
        const question = await page.$['data-testId="question"'];
        expect(question).not.toBeNull();
        
        const answers = await page.$x('//*[@data-testId="answer"]');
        expect(answers.length).toBe(4);
    });

    when('I click on an answer button', async () => {
        const answers = await page.$x('(//*[@data-testId="answer"])[1]');
        await answers[0].click();
    });

    then('The button is not blue anymore', async () => {
        const answerButton = await page.$x('(//*[@data-testId="answer"])[1]');

        const style = await (await answerButton[0].getProperty('style')).jsonValue();
        console.log(style);
        expect(style.backgroundColor).not.toEqual('blue');
        //await expect(answer).toHaveStyle({ color: 'green' });
        //await expect(page).toMatchElement("div", { text: 'Madrid'}).toHaveStyle({ color: 'green' });

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