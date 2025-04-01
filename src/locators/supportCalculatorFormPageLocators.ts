const supportCalculatorFormPageLocators = {
    // Form fields
//   yearOfBirthDropdown: "//*[@aria-labelledby='personalInfo.yearOfBirth']",
  assessableIncomeDropdown: "div[id*='personalInfo.assessableIncome']",
  yearOfBirthDropdown: "div[id*='personalInfo.yearOfBirth-container']",
  //assessableIncomeDropdown: "[aria-labelledby='personalInfo.assessableIncome']",
  //housingTypeDropdown: "//*[await page.getByRole('button', { name: 'Show estimated benefits' }).click();.typeOfPropertyOfResidence']/ancestor::div[1]",
  housingTypeDropdown: "div[id*='property.typeOfPropertyOfResidence-container']",
  propertyOwnershipDropdown: "div[id*='property.ownsPropertyOfResidence-container']",

  // Radio buttons
  ownsMoreThanOnePropertyNo: "//*[@name='property.ownsMoreThanOneProperty' and @value = 'No']/ancestor::label",
  ownsMoreThanOnePropertyYes: "//*[@name='property.ownsMoreThanOneProperty' and @value = 'Yes']/ancestor::label",

  // Dynamic option selector for dropdowns
  getDropdownOption: (value: string) => `//*[contains(@class,'react-select') and normalize-space()='${value}']`,

  showBenefitsButton: 'text=Show estimated benefits'
};  
export default supportCalculatorFormPageLocators;
  