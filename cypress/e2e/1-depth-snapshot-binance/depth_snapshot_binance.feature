# cypress\e2e\1-depth-snapshot-binance\depth_snapshot_binance.feature

Feature: Binance Depth Snapshot

  @smoke
  Scenario: Retrieve depth snapshot with valid parameters
    Given the Binance API is accessible
    When a depth snapshot is requested for symbol BNBBTC with limit 1000 with the response status code should be 200
  
  Scenario: Retrieve depth snapshot with an invalid symbol
    Given the Binance API is accessible
    When a depth snapshot is requested for an invalid symbol with the response status code should be 400 and the response should contain an error message
  
  Scenario: Retrieve depth snapshot with an invalid limit
    Given the Binance API is accessible
    When a depth snapshot is requested with an invalid limit with the response status code should be 400 and the response should contain an error message
  
  Scenario: Retrieve depth snapshot without specifying a symbol
    Given the Binance API is accessible
    When a depth snapshot is requested without specifying a symbol with the response status code should be 400 and the response should contain an error message

  