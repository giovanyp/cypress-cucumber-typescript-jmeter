# cypress\e2e\3-remove-price-level\remove_price_level.feature

Feature: Event Data for Price Levels

  Scenario: Verify absolute quantity for a price level in an event
    Given I open the binance order book
    When I receive a new bid price event
    Then The absolute quantity for the price level should be displayed

  @smoke
  Scenario: Verify price level removed
    Given I open the binance order book
    When I receive a new bid price of "3333.33" and quantity "33" event
    Then I see a record of price "3,333.33"
    When I receive a new bid price of "3333.33" and quantity "0" event
    Then The bid is removed

