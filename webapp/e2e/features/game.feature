Feature: Answer a question

Scenario: Answering a question correctly
  Given A question
  When I click on the correct answer button
  Then The button turns green

Scenario: Answering a question incorrectly
  Given A question
  When I click on an incorrect answer button
  Then The button turns red