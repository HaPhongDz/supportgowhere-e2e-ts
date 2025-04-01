Feature: Verify Support Calculator Quantum Payouts

  Scenario Outline: Calculate quantum payout based on user inputs
    Given I navigate to "https://supportgowhere.life.gov.sg"
    When I click on the calculator button on HomePage
    And I click on the start button on Support Calculator Page
    And I fill in the form with the following data:
      | field                           | value           |
      | Year of birth                   | <birthYear>     |
      | Recent Assessable Income (AI)   | <income>        |
      | Housing type                    | <housingType>   |
      | Property ownership              | <propertyOwnership> |
      | Do you own more than 1 property?| <multipleProperty> |
    And I click on the "Show estimated benefits" button
    Then I should see a result that includes "<expectedResult>"

    Examples:
      | birthYear | income                           | housingType  | propertyOwnership  | multipleProperty | expectedResult |
      | 1985      | Between $34,001 and $100,000    | 2-room flat | Rented from HDB   | Yes             | Benefit A      |
