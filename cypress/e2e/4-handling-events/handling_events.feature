# cypress\e2e\4-handling-events\handling_events.feature

Feature: Handling events that remove price levels from the local order book
  @smoke
  Scenario: Handling a price removal that is not in our order book, should do nothing.
    Given I open the binance order book
    When I receive an event "3333.33" and quantity "10"
    When I receive an event "1333.33" and quantity "0"
    Then I should still see "3,333.33" in the order book

  Scenario: Handling a price removal in empty order book, should do nothing.
    Given I open the binance order book
    When I receive an event "1333.33" and quantity "0"
    Then There are no bids in the order book