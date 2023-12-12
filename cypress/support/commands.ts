// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.ts

// Import Cypress commands
//import '@testing-library/cypress/add-commands';

// Initialize an array to buffer WebSocket events
let bufferedEvents = [];
// Initialize a variable to track the WebSocket connection status
let webSocketStatus = null;
// Initialize a variable to store the WebSocket instance
let ws;


// Custom commands for cypress/e2e/0-stream-binance/stream_binance.cy.ts
// Define a custom Cypress command to initialize a WebSocket connection
Cypress.Commands.add('initWebSocketConnection', (url: string) => {
  // Close existing WebSocket connection if it exists
  if (ws) {
      ws.close();
  }

  // Initialize variables to store WebSocket connection and events
  bufferedEvents = [];
  ws = new WebSocket(url);

  // Set up WebSocket event handlers
  ws.onopen = function () {
      // Update WebSocket status when connection is open
      webSocketStatus = "Open";
  };

  ws.onclose = function () {
      // Log a message when WebSocket connection is closed
      console.log("WebSocket closing");
      // Update WebSocket status when connection is closed
      webSocketStatus = "Closed";
  };

  ws.onmessage = function (ev) {
      // Store received WebSocket events in a buffer
      bufferedEvents.push(ev);
  };

  // Wrap the WebSocket connection in Cypress context for later use
  cy.wrap(ws).as('webSocketConnection');
});
// Define a custom Cypress command to retrieve buffered WebSocket events
Cypress.Commands.add('getEvents', () => {
  // Log a message indicating the start of the 'getEvents' command
  console.log("getEvents", bufferedEvents);

  // Wrap the buffered events in the Cypress context and alias it as 'bufferedEvents'
  return cy.wrap(bufferedEvents).as('bufferedEvents');
});
// Define a custom Cypress command to close the WebSocket connection
Cypress.Commands.add('closeWebSocketConnection', () => {
  // Retrieve the WebSocket connection from the Cypress context
  cy.get('@webSocketConnection').then(() => {
      // Close the WebSocket connection
      ws.close();
  });
});
// Define a custom Cypress command to assert that the WebSocket connection is closed
Cypress.Commands.add('assertWebSocketConnectionClosed', () => {
  // Assert that the WebSocket connection status is "Closed"
  expect(webSocketStatus).eq("Closed");
});
// Define a custom Cypress command to validate an invalid WebSocket connection
Cypress.Commands.add('validateInvalidWebSocketConnection', () => {
  // Use the Cypress 'on' method to handle uncaught exceptions
  cy.on('uncaught:exception', (err) => {
      // Check if the error message indicates an invalid WebSocket connection
      if (err.message.includes("Failed to construct 'WebSocket': The URL 'wss://invalid_stream' is invalid.")) {
          // Log the error to the console
          console.error('Invalid WebSocket Connection Error:', err.message);
          // Indicate that the error was caught
          return true;
      }
      // Allow other uncaught exceptions to propagate
      return false;
  });
});


// Custom commands for cypress/e2e/1-depth-snapshot/depth_snapshot.cy.ts

// Custom command to check if Binance API is accessible
// Define a custom Cypress command to check the accessibility of the Binance API
Cypress.Commands.add('checkBinanceApiAccessibility', () => {
  // Use Cypress 'request' command to send a ping to the Binance API
  cy.request('https://api.binance.com/api/v3/ping').should((response) => {
      // Assert that the response status is 200, indicating successful accessibility
      expect(response.status).to.eq(200);
  });
});
// Custom command to retrieve depth snapshot with valid parameters
// Define a custom Cypress command to check the accessibility and structure of a depth snapshot from the Binance API
Cypress.Commands.add('checkgetDepthSnapshot', (symbol: string, limit: number) => {
  // Use Cypress 'request' command to fetch the depth snapshot from the Binance API
  cy.request(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`).should((response) => {
      // Assert that the response status is 200, indicating successful retrieval
      expect(response.status).to.eq(200);

      // Add assertions to validate the structure or content of the depth snapshot
      expect(response.body).to.have.property('bids');
      expect(response.body).to.have.property('asks');
  });
});
// Custom command to retrieve depth snapshot with invalid symbol
// Define a custom Cypress command to fetch a depth snapshot with an invalid symbol and handle the response
Cypress.Commands.add('getDepthSnapshotWithInvalidSymbol', (invalidSymbol: string, limit: number) => {
  cy.request({
    url: `https://api.binance.com/api/v3/depth?symbol=${invalidSymbol}&limit=${limit}`,
    failOnStatusCode: false, // Do not fail the test on non-2xx status codes
  }).then((response) => {
    // Check the status code
    if (response.status === 400) {
      // The request returned a 400 status code, which is expected for an invalid symbol
      // Perform assertions on the response content
      expect(response.body).to.have.property('code');
      expect(response.body).to.have.property('msg');

      // Additional assertions based on the expected structure of an error response
      expect(response.body.code).to.be.a('number');
      expect(response.body.msg).to.be.a('string');
      expect(response.body.msg).to.include('Invalid symbol');
    } else {
      // Handle other status codes if needed
      // For example, you might want to log a warning or perform other actions
      cy.log(`Unexpected status code: ${response.status}`);
    }
  });
});
// Custom command to retrieve depth snapshot with invalid limit
// Define a custom Cypress command to fetch a depth snapshot with an invalid limit and handle the response
Cypress.Commands.add('getDepthSnapshotWithInvalidLimit', (symbol: string, invalidLimit: number) => {
  cy.request({
    url: `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${invalidLimit}`,
    failOnStatusCode: false, // Do not fail the test on non-2xx status codes
  }).then((response) => {
    // Check the status code
    if (response.status === 400) {
      // The request returned a 400 status code, which is expected for an invalid limit
      // Perform assertions on the response content
      expect(response.body).to.have.property('code');
      expect(response.body).to.have.property('msg');

      // Additional assertions based on the expected structure of an error response
      expect(response.body.code).to.be.a('number');
      expect(response.body.msg).to.be.a('string');

      // Customize assertions based on the actual error message for an invalid limit
      if (response.body.msg.includes('Illegal characters')) {
        // Handle the case where 'Illegal characters found' is in the error message
        expect(response.body.msg).to.include('Illegal characters found in parameter \'limit\'; legal range is \'^[0-9]{1,20}$\'.');
      } else {
        // Handle other status codes if needed
        // For example, you might want to log a warning or perform other actions
        cy.log(`Unexpected status code: ${response.status}`);
      }
    }
  });
});
// Custom command to retrieve depth snapshot without symbol
// Define a custom Cypress command to fetch a depth snapshot without specifying a symbol and handle the response
Cypress.Commands.add('getDepthSnapshotWithoutSymbol', (limit: number) => {
  cy.request({
    url: `https://api.binance.com/api/v3/depth?limit=${limit}`, // Not specifying a symbol intentionally
    failOnStatusCode: false,
  }).then((response) => {
    // Check the status code
    expect(response.status).to.eq(400);

    // Validate the structure or content of the error response
    expect(response.body).to.have.property('code');
    expect(response.body).to.have.property('msg');

    // Additional assertions based on the expected structure of an error response
    expect(response.body.code).to.be.a('number');
    expect(response.body.msg).to.be.a('string');

    // Customize this assertion based on the actual error message for not specifying a symbol
    expect(response.body.msg).to.include('Mandatory parameter \'symbol\' was not sent, was empty/null, or malformed.');
  });
});
// Custom commands for cypress/e2e/2-event-filtering/event_filtering.cy.ts
// Define a custom Cypress command to fetch a depth snapshot for the BNBBTC symbol with a limit of 1000 and handle the response
Cypress.Commands.add('getDepthSnapshot', () => {
  // Make a GET request to the Binance API to retrieve the depth snapshot for the BNBBTC symbol with a limit of 1000
  return cy.request({
    method: 'GET',
    url: 'https://api.binance.com/api/v3/depth?symbol=BNBBTC&limit=1000',
  }).as('depthSnapshot'); // Assign the response alias for later use
});
