Feature: Update and delete snippets on glot.io

    Scenario: Update a user's snippet 
        When I create a new snippet
        And I update the newly created snippet
        Then the snippet should contain the updated contents
    
    Scenario: Delete a user's snippet
        When I create a new snippet
        And I delete the created snippet
        Then I should receieve a 204 no content response