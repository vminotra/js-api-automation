Feature: Run code snippets on glot.io

Scenario: Run a code snippet on glot.io
    When I fetch the contents of a snippet
    And I pass the file contents to the run snippet endpoint 
    Then I should get the expected output of the code snippet