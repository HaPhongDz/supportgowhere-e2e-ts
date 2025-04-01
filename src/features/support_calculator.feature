Feature: Verify Support Calculator Quantum Payouts

  Scenario Outline: Calculate quantum payout based on user inputs
    Given I navigate to "https://supportgowhere.life.gov.sg"
    When I click on the calculator button on HomePage
    And I click on the start button on Support Calculator Page
    # And I fill in the form with the following data:
    #   | field                           | value           |
    #   | Year of birth                   | <birthYear>     |
    #   | Recent Assessable Income (AI)   | <income>        |
    #   | Housing type                    | <housingType>   |
    #   | Property ownership              | <propertyOwnership> |
    #   | Do you own more than 1 property?| <multipleProperty> |
    # And I click on the "Show estimated benefits" button
    # Then I should see a result for "Assurance Package <year>" that includes "<expectedAmount>"

    Examples:
      | birthYear | income                           | housingType  | propertyOwnership  | multipleProperty | year | expectedAmount |
      | 1985      | Between $34,001 and $100,000    | 2-room flat | Rented from HDB   | Yes             | 2025 | $100          |
      | 1990      | Between $34,001 and $100,000    | 3-room flat | Rented from HDB   | No              | 2024 | $200          |
