Feature: Login with a existing user

Scenario: The user is already registered in the site
  Given A registered user
  When I fill the data in the form and press login
  Then Home page should be shown in the screen