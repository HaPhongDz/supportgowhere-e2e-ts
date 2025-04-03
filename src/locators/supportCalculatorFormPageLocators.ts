const supportCalculatorFormPageLocators = {
    // Form fields
  //   yearOfBirthDropdown: "//*[@aria-labelledby='personalInfo.yearOfBirth']",
  assessableIncomeDropdown: "div[id*='personalInfo.assessableIncome']",
  assessableIncomeLabel: "//*[@id='personalInfo.assessableIncome']/ancestor::fieldset//label",
  yearOfBirthDropdown: "div[id*='personalInfo.yearOfBirth-container']",
  //assessableIncomeDropdown: "[aria-labelledby='personalInfo.assessableIncome']",
  //housingTypeDropdown: "//*[await page.getByRole('button', { name: 'Show estimated benefits' }).click();.typeOfPropertyOfResidence']/ancestor::div[1]",
  housingTypeDropdown: "div[id*='property.typeOfPropertyOfResidence-container']",
  propertyOwnershipDropdown: "div[id*='property.ownsPropertyOfResidence-container']",

  // Radio buttons
  ownsMoreThanOnePropertyNo: "//*[@name='property.ownsMoreThanOneProperty' and @value = 'No']/ancestor::label",
  ownsMoreThanOnePropertyYes: "//*[@name='property.ownsMoreThanOneProperty' and @value = 'Yes']/ancestor::label",
  medisaveBalanceLabel: "//fieldset[@id='personalInfo.medisaveBalance']//label[contains(@class,'Label')]",
  medisaveBalanceTier1: "//*[@name='personalInfo.medisaveBalance' and @value = 'MEDISAVE_BALANCE_TIER_1']/ancestor::label",
  medisaveBalanceTier2: "//*[@name='personalInfo.medisaveBalance' and @value = 'MEDISAVE_BALANCE_TIER_2']/ancestor::label",

  // Dynamic option selector for dropdowns
  getDropdownOption: (value: string) => `//*[contains(@class,'react-select') and normalize-space()='${value}']`,

  showBenefitsButton: 'text=Show estimated benefits',

  // Error messages
  yearOfBirthError: "//*[@id='personalInfo.yearOfBirth-container']/ancestor::fieldset//*[text()='This is a required field.']",
  assessableIncomeError: "//*[@id='personalInfo.assessableIncome-container']/ancestor::fieldset//*[text()='This is a required field.']",
  housingTypeError: "//*[@id='property.typeOfPropertyOfResidence-container']/ancestor::fieldset//*[text()='This is a required field.']",
  propertyOwnershipError: "//*[@id='property.ownsPropertyOfResidence-container']/ancestor::fieldset//*[text()='This is a required field.']",
  multiplePropertyError: "//*[@name='property.ownsMoreThanOneProperty']/ancestor::fieldset//*[text()='This is a required field.']"
};  
export default supportCalculatorFormPageLocators;
  