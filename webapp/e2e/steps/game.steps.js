const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game.feature');
import MockAdapter from 'axios-mock-adapter';

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

      mockAxios.reset();
      // Mock the axios.post request to simulate a successful response
      mockAxios.onPost('http://localhost:3000/questions').reply(200, 
          {
          question: 'Which is the capital of Spain?',
          options: ['Madrid', 'Barcelona', 'Paris', 'London'],
          correctAnswer: 'Madrid',
          categories: ['Geography'],
          language: 'en'
          }
      );
  });

  test('Answering a question correctly', ({given,when,then}) => {

    given('A question', async () => {
        await expect(screen.findByText('Which is the capital of Spain?'));
        await expect(screen.findByText('Madrid'));
        await expect(screen.findByText('Barcelona'));
        await expect(screen.findByText('Paris'));
        await expect(screen.findByText('London'));
    });

    when('I click on the correct answer button', async () => {
        answer = await screen.getByRole('button', { name: 'Madrid' });

        await expect(answer).not.toHaveStyle({ color: 'green' });

        //selects correct answer
        await fireEvent.click(answer);
    });

    then('The button turns green', async () => {
        await expect(answer).toHaveStyle({ color: 'green' });
    });
  })

  test('Answering a question incorrectly', ({given,when,then}) => {

    given('A question', async () => {
        await expect(screen.findByText('Which is the capital of Spain?'));
        await expect(screen.findByText('Madrid'));
        await expect(screen.findByText('Barcelona'));
        await expect(screen.findByText('Paris'));
        await expect(screen.findByText('London'));
    });

    when('I click on an incorrect answer button', async () => {
        answer = await screen.getByRole('button', { name: 'Barcelona' });

        await expect(answer).not.toHaveStyle({ color: 'red' });

        //selects correct answer
        await fireEvent.click(answer);
    });

    then('The button turns red', async () => {
        await expect(answer).toHaveStyle({ color: 'red' });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});