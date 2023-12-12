import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { recurse } from "cypress-recurse";

let latestSnapshot = null;

// This step definition sets up the environment to open the Binance WebSocket
Given('I open the binance websocket', (url: string) => {
    // Implement the WebSocket connection setup here

    // Using a custom Cypress command to initialize the WebSocket connection
    cy.initWebSocketConnection(url);
});
// This step definition retrieves the latest snapshot using a custom Cypress command
When('I retrieve the latest snapshot', () => {
    // Use a Cypress custom command 'getDepthSnapshot' to retrieve a snapshot
    cy.getDepthSnapshot().then(res => {
        // Log the response body to the console for debugging purposes
        console.log(res.body);

        // Extract the response body and assign it to the 'body' variable
        const body = res.body;

        // Update the 'latestSnapshot' variable with the retrieved snapshot body
        latestSnapshot = body;
    });
});
// This step definition listens to a WebSocket stream until a certain number of events are received
When('listening to the stream', () => {
    // Convert the string representing the number of events to a numeric value
    const eventCount = Number(5);

    // Use the 'recurse' utility to repeatedly perform an action until a condition is met
    recurse(
        // The initial value is a wrapped Cypress command that resolves to the WebSocket events
        () => cy.getEvents(),

        // The condition checks if the length of WebSocket events is greater than the specified count
        events => {
            console.log("events", events);
            return events.length > eventCount;
        },

        // Configuration options for the 'recurse' function
        {
            timeout: 10000 // Maximum time to wait for the condition to be met
        }
    ).then(() => {
        // Once the condition is met, close the WebSocket connection
        cy.closeWebSocketConnection();
    });
});
// This step definition verifies that each new event's U should be greater than or equal to the previous event's U+1
Then("each new event's U should be greater than or equal to the previous event's U+1", () => {
    // Retrieve WebSocket events using the 'getEvents' command
    cy.getEvents().then(events => {
        // Iterate through each WebSocket event in the websocketEvents array
        for (let i = 0; i < events.length; i++) {
            // Skip the comparison for the first event in the array
            if (i === 0) {
                continue;
            }

            // Parse the current and previous WebSocket events
            const currentEvent = JSON.parse(events[i].data);
            const previousEvent = JSON.parse(events[i - 1].data);

            // Assert that the currentEvent's U is greater than or equal to the previousEvent's U+1
            expect(currentEvent.U).to.be.gte(previousEvent.U + 1);
        }
    });
});
// This step definition waits for a specific number of WebSocket events to be received
Then('I wait for the next {string} events', (eventsNumber: string) => {
    // Convert the string representing the number of events to a numeric value
    const eventCount = Number(eventsNumber);

    // Use the 'recurse' utility to repeatedly perform an action until a condition is met
    recurse(
        // The initial value is a wrapped Cypress command that resolves to the WebSocket events
        () => cy.getEvents(),

        // The condition checks if the length of WebSocket events is greater than the specified count
        events => {
            console.log("events", events);
            return events.length > eventCount;
        },

        // Configuration options for the 'recurse' function
        {
            timeout: 10000 // Maximum time to wait for the condition to be met
        }
    ).then(() => {
        // Once the condition is met, close the WebSocket connection
        cy.closeWebSocketConnection();
    });
});
// This step definition verifies that all captured WebSocket events have 'u' greater than or equal to the snapshot lastUpdateId
Then('All captured events should be greater than or equal to the snapshot lastUpdateId', () => {
    // Retrieve WebSocket events using the 'getEvents' command
    cy.getEvents().then(events => {
        // Iterate through each WebSocket event in the websocketEvents array
        for (const event of events) {
            // Log the entire WebSocket event for debugging purposes
            console.log(event);
            
            // Parse the JSON data from the WebSocket event
            const eventData = JSON.parse(event.data);

            // Log the parsed JSON data for debugging purposes
            console.log(eventData);

            // Perform an assertion: Expect the 'u' (Final Update ID) property in eventData to be greater than or equal to the lastUpdateId from the latestSnapshot
            expect(eventData.u).to.be.gte(latestSnapshot.lastUpdateId);
        }
    });
});
// This step definition verifies that the absolute quantity for the price level is displayed
Then("the absolute quantity for the price level should be displayed", () => {
    // Retrieve WebSocket events using the 'getEvents' command
    cy.getEvents().then(events => {
        // Iterate through each WebSocket event in the websocketEvents array
        for (const event of events) {
            // Parse the JSON data from the WebSocket event
            const eventData = JSON.parse(event.data);
            
            // Iterate through each bid ('b') in the WebSocket event
            for (const b of eventData.b) {
                // Assert that the quantity of the bid is greater than or equal to 0
                expect(Number(b[1])).to.be.gte(0);
            }

            // Iterate through each ask ('a') in the WebSocket event
            for (const a of eventData.a) {
                // Assert that the quantity of the ask is greater than or equal to 0
                expect(Number(a[1])).to.be.gte(0);
            }
        }
    });
});
