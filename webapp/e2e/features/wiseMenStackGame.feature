Feature: Answer a question

Scenario: Answering a question correctly
  Given A question
  When I click on the correct answer button
  Then The selected answer is marked as right