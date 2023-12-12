import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { recurse } from "cypress-recurse";
// import { Server } from 'mock-socket';

// let mockSocket;
// let mockServer;
// create a WS instance, listening on port 1234 on localhost
// real clients can connect
let client;

// Initializing event variables with initial values
let currentEventE = 1800000002022;
let currentEventU = 52000000500;
let currentEventu = 52000000200;

// This step definition sets up the environment to open the Binance order book
Given('I open the binance order book', () => {
    // Using the 'cy.task' command to start a WebSocket and obtain its URL
    cy.task("startSocket").then((url: string) => {
        // Creating a WebSocket client and handling its events
        client = new WebSocket(url);
        let open = false;
        client.onopen = () => {
            console.log("open");
            open = true;
        };
        client.onmessage = (ev) => {
            console.log("message", ev);
        };

        // Intercepting a specific API request and providing a mocked response
        cy.intercept("https://www.binance.com/api/v1/depth?symbol=BTCUSDT&limit=1000", {
            body: {
                "lastUpdateId": 40997824176,
                "bids": [["43154.24000000", "0.11000000"]],
                "asks": [],
            }
        });

        // Visiting the Binance order book page with WebSocket stubbed
        cy.visit("https://www.binance.com/en-GB/orderbook/BTC_USDT", {
            onBeforeLoad: (win) => {
                // Stubbing the WebSocket to use the client created earlier
                cy.stub(win, 'WebSocket').callsFake((url) => {
                    console.log("url", url)
                    return client;
                });
            }
        });

        // Using the 'recurse' function to wait for the WebSocket to open
        recurse(
            () => cy.wrap([]),
            () => open,
            {
                timeout: 15000, // Maximum time to wait for the WebSocket to open
                delay: 2000     // Delay between each retry
            }
        );
    });

    // Uncomment the line below if you need to interact with a specific element after the setup
    //cy.get("#onetrust-accept-btn-handler").click();
});
// This step definition simulates the receipt of a new bid price event
When('I receive a new bid price event', () => {
    // Using the 'cy.task' command to simulate sending a message/event

    cy.task("sendMessage", {
        "stream": "btcusdt@depth",
        "data": {
            "e": "depthUpdate",    // Event type
            "E": 1702028535326,    // Event time
            "s": "BTCUSDT",         // Symbol
            "U": 50997824190,      // First update ID in event
            "u": 50997824178,      // Final update ID in event
            "b": [["43215.49000000", "10.50676000"]],  // Bid prices and quantities
            "a": []                // Ask prices and quantities (empty for bid event)
        }
    });
});
// This step definition verifies that the absolute quantity for a price level is displayed
Then('The absolute quantity for the price level should be displayed', () => {
    // Using the 'recurse' function to wait for the presence of the absolute quantity

    // Waiting for the grid's children to be available
    recurse(
        () => cy.get('[role="grid"]').children(),

        // Checking if the grid's children are not null, indicating availability
        events => events !== null,

        // Configuration options for the 'recurse' function
        {
            timeout: 15000, // Maximum time to wait for the presence of the absolute quantity
            delay: 2000      // Delay between each retry
        }
    );
});
// This step definition simulates the receipt of a new bid price and quantity event
When('I receive a new bid price of {string} and quantity {string} event', (price: string, quantity: string) => {

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
Then('I see a record of price {string}', (price: string) => {
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
Then('The bid is removed', () => {
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