// locators/calculatedResultPageLocators.ts
const calculatedResultPageLocators = {
    
    // Tab selector by year
    yearTab: (year: string) => 
      `//div[@data-testid="scroll-content"]//span[text()='${year}']`,
    
    // Selector for assurance package amount by year
    assurancePackageAmount: (year: string) => 
      `//*[text()='Payout in December ${year}']/../../*[contains(@Id,'You-payout')]`,

  };
  
export default calculatedResultPageLocators;
  