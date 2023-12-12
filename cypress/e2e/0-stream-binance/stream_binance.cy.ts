import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import {recurse} from "cypress-recurse"


// This step definition sets up a WebSocket connection to the specified URL
Given('I have a WebSocket connection to {string}', (url: string) => {
  // Implement the WebSocket connection setup here using a custom Cypress command
  cy.initWebSocketConnection(url);
});
// This step definition sets up an invalid WebSocket connection to the specified URL for testing error handling
Given('I have an invalid WebSocket connection to {string}', (url: string) => {
  // Set up an invalid WebSocket connection URL using a custom Cypress command
  cy.validateInvalidWebSocketConnection(url).as('invalidWebSocketError');
});
// This step definition waits until at least one event is received from the WebSocket stream
When('I receive an event from the stream', () => {
  // Use the 'recurse' utility to repeatedly perform an action until a condition is met

  // Wait until there are at least two WebSocket events
  recurse(
    () => cy.getEvents(),

    // Check if the length of WebSocket events is greater than 1
    events => events.length > 1,

    // Configuration options for the 'recurse' function
    {
        timeout: 15000, // Maximum time to wait for the condition to be met
        delay: 2000      // Delay between each retry
    }
  )
});
// This step definition closes the WebSocket connection
When('I close the WebSocket connection', () => {
  // Use a custom Cypress command to close the WebSocket connection
  cy.closeWebSocketConnection();
});
// This step definition verifies that events have been buffered
Then('event should be buffered', () => {
  // Buffer the received events
  cy.getEvents().then(events => {
    // Assert that the length of the first event's data array is greater than 1
    expect(events[0].data.length).greaterThan(1);
  })

  // Ensure this command is executed after cy.bufferEvents()
  cy.get('@bufferedEvents');
});
// This step definition verifies that the buffered events contain a property "e" of type "string"
Then('the buffered events should contain property "e" of type "string"', () => {
  // Buffer the received events and parse the first event's data as JSON
  cy.getEvents().then(events => JSON.parse(events[0].data))
    // Assert that the parsed event has a property "e"
    .should("have.a.property", "e")
    // Extract the value of the "e" property and assert its type
    .then(event => event.e)
    .should("be.a", "string");
});
// This step definition verifies that the buffered events contain a property "E" of type "number"
Then('the buffered events should contain property "E" of type "number"', () => {
  // Buffer the received events and parse the first event's data as JSON
  cy.getEvents().then(events => JSON.parse(events[0].data))
    // Assert that the parsed event has a property "E"
    .should("have.a.property", "E")
    // Extract the value of the "E" property and assert its type
    .then(event => event.E)
    .should("be.a", "number");
});
// This step definition verifies that the buffered events contain a property "s" with the value "BNBBTC"
Then('the buffered events should contain property "s" with value "BNBBTC"', () => {
  // Buffer the received events and parse the first event's data as JSON
  cy.getEvents().then(events => JSON.parse(events[0].data))
    // Assert that the parsed event has a property "s"
    .should("have.a.property", "s")
    // Extract the value of the "s" property and assert its equality to "BNBBTC"
    .then(event => event.s)
    .should("eq", "BNBBTC");
});
// This step definition verifies that the buffered events contain a property "u" of type "number"
Then('the buffered events should contain property "u" of type "number"', () => {
  // Buffer the received events and parse the first event's data as JSON
  cy.getEvents().then(events => JSON.parse(events[0].data))
    // Assert that the parsed event has a property "u"
    .should("have.a.property", "u")
    // Extract the value of the "u" property and assert its type
    .then(event => event.u)
    .should("be.a", "number");
});
// This step definition verifies that the buffered events contain a property "b" that is an array representing "bid"
Then('the buffered events should contain property "b" that is a "bid"', () => {
  // Buffer the received events and parse the first event's data as JSON
  cy.getEvents().then(events => JSON.parse(events[0].data))
    // Assert that the parsed event has a property "b"
    .should("have.a.property", "b")
    // Extract the value of the "b" property and assert its type
    .then(event => event.b)
    .should('be.a', 'Array');
});
// This step definition verifies that the stream connection has been closed
Then('the stream connection should be closed', () => {
  // Use a custom Cypress command to assert that the WebSocket connection is closed
  cy.assertWebSocketConnectionClosed();
});
// This step definition checks if a specific SSL connection error is reported
Then('an error should be reported', () => {
  // Use Cypress event handling to catch uncaught exceptions
  cy.on('uncaught:exception', (err) => {
    // Check if the error message includes a specific SSL connection error
    if (err.message.includes("Error in connection establishment: net::ERR_SSL_SERVER_CERT_BAD_FORMAT")) {
      // Log the error to the console
      console.log('Invalid WebSocket Connection Error:', err.message);
      // Indicate that the error was caught
      return true;
    }
    // Allow other uncaught exceptions to propagate
    return false;
  });
});

