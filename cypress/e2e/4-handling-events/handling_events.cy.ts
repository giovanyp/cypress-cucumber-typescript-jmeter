import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { recurse } from "cypress-recurse";

// Initializing event variables with initial values
let currentEventE = 1800000002022;
let currentEventU = 52000000500;
let currentEventu = 52000000200;

// This step definition simulates the receipt of a new bid price and quantity event
When('I receive an event {string} and quantity {string}', (price: string, quantity: string) => {

    // Using the 'cy.task' command to simulate sending a message/event
    cy.task("sendMessage", {
        "stream": "btcusdt@depth",
        "data": {
            "e": "depthUpdate", // Event type
            "E": currentEventE,  // Event time
            "s": "BTCUSDT",      // Symbol
            "U": currentEventU,  // First update ID in event
            "u": currentEventu,  // Final update ID in event
            "b": [[price, quantity]],  // Bid prices and quantities
            "a": []                     // Ask prices and quantities (empty for bid event)
        }
    });

    // Incrementing event variables for future events
    currentEventE++;
    currentEventU += 4;
    currentEventu += 4;
});
// This step definition verifies that a record with the specified price exists
Then('I should still see {string} in the order book', (price: string) => {
    // Using the 'recurse' function to wait for the appearance of the specified price

    // Wait until an element containing the specified price is found
    recurse(
        () => cy.contains(price),

        // Check if the element containing the price is not null
        events => events !== null,

        // Configuration options for the 'recurse' function
        {
            timeout: 15000, // Maximum time to wait for the appearance of the price
            delay: 2000      // Delay between each retry
        }
    );

    // Checking the number of rows in the grid
    cy.get('[role="grid"]')
        .children() // Selecting rows
        .should("have.length", 1); // Expecting only one row to be present

    // Checking the content of the first row
    cy.get('[role="grid"]')
        .children()
        .each((row, rowNumber) => {
            const firstElem = row.children()[0];
            const subDivs = firstElem.children; 
            const columns = subDivs[0].children;
            console.log("row", row);
            console.log("subDivs", subDivs);
            console.log("columns", columns);
            // Checking the content of the second column in the first row
            if (rowNumber === 0) {
                expect(columns.item(1).textContent).eq(price);
            }
        });
});


// This step definition handles the removal of a bid
Then('There are no bids in the order book', () => {
    // Using the 'recurse' function to wait for the bid removal process

    // Find the grid containing the bid information
    recurse(
        () => cy.get('[role="grid"]'),

        // Check if the row group (children of the grid) is empty,
        // indicating that the bid has been successfully removed
        rowGroup => rowGroup.children().length === 0,

        // Configuration options for the 'recurse' function
        {
            timeout: 15000, // Maximum time to wait for the bid removal
            delay: 2000     // Delay between each retry
        }
    );
});