Feature: Verify Support Calculator Quantum Payouts

  Scenario Outline: Calculate quantum payout based on user inputs
    Given I navigate to "https://supportgowhere.life.gov.sg"
    When I click on the calculator button on HomePage
    And I click on the start button on Support Calculator Page
    And I fill in the form with the following data:
      | field             | value           |
      | birthYear         | <birthYear>     |
      | income            | <income>        |
      | nsStatus          | <nsStatus>      |
      | cpf               | <cpf>           |
      | propertyOwnership | <propertyOwnership> |
      | housingType       | <housingType>   |
      | av                | <av>            |
    And I click on the "Show estimated benefits" button
    Then I should see a result that includes "<expectedResult>"

    Examples:
      | birthYear | income | nsStatus | cpf   | propertyOwnership | housingType | av     | expectedResult |
      | 1990      | 50000  | yes      | 20000 | single            | HDB       | N/A    | Benefit A      |
      | 1985      | 75000  | no       | 30000 | multiple          | Private   | 15000  | Benefit B      |
