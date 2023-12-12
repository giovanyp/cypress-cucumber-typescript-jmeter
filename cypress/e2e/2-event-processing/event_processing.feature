# cypress\e2e\2-event-processing\event_processing.feature

Feature: Event Processing

  Scenario: Drop event when u is greater than to the lastUpdateId
    Given I have a WebSocket connection to "wss://stream.binance.com:9443/ws/bnbbtc@depth"
    When I retrieve the latest snapshot
    Then I wait for the next "5" events
    Then All captured events should be greater than or equal to the snapshot lastUpdateId
  
  @smoke
  Scenario: Verify absolute quantity for a price level in an event
    Given I have a WebSocket connection to "wss://stream.binance.com:9443/ws/bnbbtc@depth"
    When listening to the stream
    Then the absolute quantity for the price level should be displayed

  Scenario: Ensure U values are sequential in the stream
    Given I have a WebSocket connection to "wss://stream.binance.com:9443/ws/bnbbtc@depth"
    When listening to the stream
    Then each new event's U should be greater than or equal to the previous event's U+1