import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

// This step definition checks if the Binance API is accessible
Given('the Binance API is accessible', () => {
    // Check if Binance API is accessible using a custom Cypress command
    cy.checkBinanceApiAccessibility();
});
// This step definition requests a depth snapshot for the symbol 'BNBBTC' with a limit of 1000 and checks the response status code
When('a depth snapshot is requested for symbol BNBBTC with limit 1000 with the response status code should be 200', () => {
    // Retrieve depth snapshot with valid parameters using a custom Cypress command
    cy.checkgetDepthSnapshot('BNBBTC', 1000);
});
// This step definition requests a depth snapshot for an invalid symbol and checks the response status code and error message
When('a depth snapshot is requested for an invalid symbol with the response status code should be 400 and the response should contain an error message', () => {
    // Retrieve depth snapshot with an invalid symbol using a custom Cypress command
    cy.getDepthSnapshotWithInvalidSymbol('BNBBTX', 1000);
});
// This step definition requests a depth snapshot with an invalid limit and checks the response status code and error message
When('a depth snapshot is requested with an invalid limit with the response status code should be 400 and the response should contain an error message', () => {
    // Retrieve depth snapshot with an invalid limit using a custom Cypress command
    cy.getDepthSnapshotWithInvalidLimit('BNBBTC', 0.9);
});
// This step definition requests a depth snapshot without specifying a symbol and checks the response status code and error message
When('a depth snapshot is requested without specifying a symbol with the response status code should be 400 and the response should contain an error message', () => {
    // Retrieve depth snapshot without specifying a symbol using a custom Cypress command
    cy.getDepthSnapshotWithoutSymbol(1000);
});
