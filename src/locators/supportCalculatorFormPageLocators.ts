const supportCalculatorFormPageLocators = {
    // Form fields
//   yearOfBirthDropdown: "//*[@aria-labelledby='personalInfo.yearOfBirth']",
  assessableIncomeDropdown: "//*[@aria-labelledby='personalInfo.assessableIncome']/ancestor::div[1]",
  yearOfBirthDropdown: "[aria-labelledby='personalInfo.yearOfBirth']",
  //assessableIncomeDropdown: "[aria-labelledby='personalInfo.assessableIncome']",
  //housingTypeDropdown: "//*[await page.getByRole('button', { name: 'Show estimated benefits' }).click();.typeOfPropertyOfResidence']/ancestor::div[1]",
  housingTypeDropdown: "[id*='property.typeOfPropertyOfResidence-container']",
  propertyOwnershipDropdown: "[id*='property.ownsPropertyOfResidence-container']",

  // Radio buttons
  ownsMoreThanOnePropertyNo: "//*[@name='property.ownsMoreThanOneProperty' and @value = 'No']/ancestor::label",
  ownsMoreThanOnePropertyYes: "//*[@name='property.ownsMoreThanOneProperty' and @value = 'Yes']/ancestor::label",

  // Dynamic option selector for dropdowns
  getDropdownOption: (value: string) => `//*[contains(@class,'react-select') and normalize-space()='${value}']`,

  showBenefitsButton: 'text=Show estimated benefits'
};  
export default supportCalculatorFormPageLocators;
  