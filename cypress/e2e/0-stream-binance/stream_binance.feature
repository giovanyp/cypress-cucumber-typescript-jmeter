# cypress\e2e\0-stream-binance\stream_binance.feature

Feature: Stream Binance Market Depth Updates
@smoke
  Scenario: Open a WebSocket stream to Binance and buffer events
    Given I have a WebSocket connection to "wss://stream.binance.com:9443/ws/bnbbtc@depth"
    When I receive an event from the stream
    Then event should be buffered

  
  Scenario: Verify the correctness of buffered events
    Given I have a WebSocket connection to "wss://stream.binance.com:9443/ws/bnbbtc@depth"
    When I receive an event from the stream
    Then the buffered events should contain property "e" of type "string"
    Then the buffered events should contain property "E" of type "number"
    Then the buffered events should contain property "s" with value "BNBBTC" 
    Then the buffered events should contain property "u" of type "number"
    Then the buffered events should contain property "b" that is a "bid"
    
  @smoke
  Scenario: Close the WebSocket stream
    Given I have a WebSocket connection to "wss://stream.binance.com:9443/ws/bnbbtc@depth"
    When I close the WebSocket connection
    Then the stream connection should be closed
  
  Scenario: Handle errors during WebSocket connection
    Given I have an invalid WebSocket connection to "wss://invalid_stream"
    Then an error should be reported
