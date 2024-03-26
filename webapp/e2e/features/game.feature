Feature: Answer a question correctly

Scenario: The question is not answered yet
  Given A not answered question
  When I click on the correct answer button
  Then The button turns green