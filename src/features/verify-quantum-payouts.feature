Feature: Verify Support Calculator Quantum Payouts

  Background:
    Given I navigate to "https://supportgowhere.life.gov.sg"
    When I click on the calculator button on HomePage
    And I click on the start button on Support Calculator Page

  @quantum-payouts
  Scenario Outline: Verify fields visibility based on birth year
    When I fill in the form with birth year "<birthYear>"
    Then I should see the following fields with correct labels:
      | field                           | isVisible |
      | Recent Assessable Income (AI)   | <incomeVisible> |
      | CPF MediSave balance           | <cpfVisible> |

    Examples:
      | birthYear | incomeVisible | cpfVisible |
      | 2003      | true          | false      |
      | 1973      | true          | true       |
      | 2010      | false         | false      | 
    
