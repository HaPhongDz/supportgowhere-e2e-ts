Feature: Verify Support Calculator Quantum Payouts

  Background:
    Given I navigate to "https://supportgowhere.life.gov.sg"
    When I click on the calculator button on HomePage
    And I click on the start button on Support Calculator Page

  @positive
  Scenario Outline: Calculate quantum payout based on user inputs
    When I fill in the form with the following data:
      | field                           | value                                 |
      | Year of birth                   | <birthYear>                           |
      | Recent Assessable Income (AI)   | <income>                              |
      | Housing type                    | <housingType>                         |
      | Property ownership              | <propertyOwnership>                   |
      | Do you own more than 1 property?| <multipleProperty>                    |
    And I click Show estimated benefits
    Then I should see a result for "Assurance Package <year>" that includes "<expectedAmount>"

    Examples:
      | birthYear | income                          | housingType  | propertyOwnership                    | multipleProperty | year | expectedAmount |
      | 1985      | Between $34,001 and $100,000   | 2-room flat  | Rented from HDB                      | No               | 2025 | $350           |
      | 1990      | Above $100,000                 | 3-room flat  | Rented from Open market              | No               | 2026 | $100           |
      | 1992      | $34,000 and below or No income  | 3-room flat  | Owned by me or household member      | No               | 2025 | $600           |

  @negative
  Scenario: Validate required fields
    When I click Show estimated benefits without filling any fields
    Then I should see required field error messages under all fields

