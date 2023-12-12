// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Inside cypress/support/index.js or
// Inside cypress/support/indes.ts in this case
/// <reference types="cypress" />

declare global {
    namespace Cypress {
      interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute example
       * @example cy.dataCy('greeting')
       */
      // Functions for cypress\e2e\0-stream-binance\stream_binance.cy.ts
      initWebSocketConnection(value: string): Chainable<Element>;
      getEvents(): Chainable;
      closeWebSocketConnection(): Chainable;
      validateInvalidWebSocketConnection(value: string): Chainable<Element>;
      assertWebSocketConnectionClosed(): Chainable;
      // Functions for cypress\e2e\1-depth-snapshot-binance\depth_snapshot_binance.cy.ts
      checkBinanceApiAccessibility(): Chainable;
      checkgetDepthSnapshot(symbol: string, limit: number): Chainable<Element>;
      getDepthSnapshotWithInvalidSymbol(invalidSymbol: string, limit: number): Chainable<Element>;
      getDepthSnapshotWithInvalidLimit(symbol: string, invalidLimit: number): Chainable<Element>;
      getDepthSnapshotWithoutSymbol(limit: number): Chainable<Element>;
      // Functions for cypress\e2e\2-event-filtering\event_filtering.cy.ts
      getDepthSnapshot(): Chainable;
      // Functions for cypress\e2e\3-event-processing\event_processing.cy.ts
      processEvents(lastUpdateId: number): Chainable<Element>;
    }
  }
}
