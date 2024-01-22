# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run prod`
It executes the production version using the package `serve`. For this command to work you need the `build` directory which is created using `npm run build`.

### Unitary tests (`npm test`)

Unitary tests can be found in the same directory where the react components lie. Each react component (for instance, App.js), will have its own test file (App.test.js).

Here is an example of the tests for App.js:

```javascript
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the 2024 edition of the Software Architecture course/i);
  expect(linkElement).toBeInTheDocument();
});
```
This example is pretty simple as it is only checking that the app is rendering correctly. Other tests are more complex as they depend on other components. As we are performing unitary testing, we need to decouple these dependencies, mocking the components that we do not want to test. For instance:

```javascript
describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    render(<AddUser />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Add User/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  });
...
```
This would be a test for adding a user in the `AddUser` component. As you can see, the call to the service handling new users is mocked so its returning an OK response. If you check the file `AddUser.test.js` you can see a similar example but returning a negative response.

In order to execute these unitary tests we need to execute `npm test`. The tests are executed using jest. 

Note that code coverage is not updated for executing the tests. Only when we create a new release and fire all the actions involved with it, the coverage report will be sent to SonarCloud. You can check the unit-tests job in order to understand how this works:

```yml
unit-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm --prefix users/authservice ci
    - run: npm --prefix users/userservice ci
    - run: npm --prefix gatewayservice ci
    - run: npm --prefix webapp ci
    - run: npm --prefix users/authservice test -- --coverage
    - run: npm --prefix users/userservice test -- --coverage
    - run: npm --prefix gatewayservice test -- --coverage
    - run: npm --prefix webapp test -- --coverage
    - name: Analyze with SonarCloud
      uses: sonarsource/sonarcloud-github-action@master
      env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```


### E2E tests (`npm run test:e2e`)

E2E tests are maybe the most difficult part to integrate in our system. We have to test the system as a whole. The idea here is to deploy the system and make the tests using [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) (browser automatization) and [jest-cucumber](https://www.npmjs.com/package/jest-cucumber) (user stories). We will also be using [expect-puppeteer](https://www.npmjs.com/package/expect-puppeteer) to make easier the test writing. All the structure needed is under the `webapp/e2e` directory. These tests can be run locally using `npm run test:e2e` and they will be run also in GitHub Actions, just after the unitary tests. 

In this project, the E2E testing user stories are defined using Cucumber. Cucumber uses a language called Gherkin to define the user stories. You can find the example in the `features` directory. Then, the actual tests are in the folder `steps`. We are going to configure jest to execute only the tests of this directory (check the `jest.config.ts` file in the `e2e` directory). 

The E2E tests have two extra difficulties. The first one, we need a browser to perform the tests as if the user was using the application. For this matter, we use `jest-puppeteer` that will launch a Chromium instance for running the tests. The browser is started in the `beforeAll` function. Note that the browser is launched in a headless mode. This is necessary for the tests to run in the CI environment. If you want to debug the tests you can always turn this feature off. The second problem is that we need all our services at the same time to be able to run the tests. For achieving this, we are going to use the package `start-server-and-test`. This package, allows us to launch multiple servers and then run the tests. No need for any configuration. We can configure it straight in the `package.json` file:

```json
   "test:e2e": "start-server-and-test 'node e2e/test-environment-setup.js' http://localhost:8000/health prod 3000 \"cd e2e && jest\"",
```


The package accepts pairs of parameters (launch a server and an URL to check if it is running. It also accepts npm commands (for instance prod, for the webapp, that will run `npm run prod`). The last parameter of the task will be launching Jest to run the E2E tests.

Note that we are handling all the setup for the auth and user microservices using the file `test-environment-setup.js`. This file has the code needed to run everything, including an in-memory Mongo database to be able to execute the tests.

